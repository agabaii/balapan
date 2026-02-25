
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from './services/api';
import { ChevronLeft, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { getTranslation } from './translations';
import { useApp } from './context/AppContext';

export default function VideoPlayer() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { interfaceLang } = useApp();
  const t = getTranslation(interfaceLang);

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const watchTimerRef = useRef(null);
  const [returnTo] = useState(() => localStorage.getItem('returnTo') || '/videos');
  const [returnLessonId] = useState(() => localStorage.getItem('returnLessonId'));

  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [isRetryMode, setIsRetryMode] = useState(false);
  const [retryIndex, setRetryIndex] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadVideo();
    startWatchTimer();

    return () => {
      if (watchTimerRef.current) {
        clearInterval(watchTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  useEffect(() => {
    if (completed) {
      localStorage.removeItem('returnTo');
      localStorage.removeItem('returnLessonId');
    }
  }, [completed]);

  const loadVideo = async () => {
    const result = await apiService.getVideoById(videoId);
    if (result.success) {
      setVideo(result.video);
      const userId = apiService.getCurrentUserId();
      await apiService.startVideo(userId, videoId);
    }
    setLoading(false);
  };

  const getLocalizedTitle = (v) => {
    if (!v) return '';
    if (interfaceLang === 'ru') return v.titleRu || v.title;
    if (interfaceLang === 'en') return v.titleEn || v.titleRu || v.title;
    return v.titleKk || v.title;
  };

  const getAnswerText = (a) => {
    if (!a) return '';
    return a.answerText;
  };

  const startWatchTimer = () => {
    watchTimerRef.current = setInterval(() => {
      setWatchTime(prev => prev + 1);
    }, 1000);
  };

  const handleAnswerSelect = (answerId) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(answerId);
  };

  const checkAnswer = () => {
    const questionsList = isRetryMode ? wrongQuestions : (video.questions || []);
    const currentIndex = isRetryMode ? retryIndex : currentQuestionIndex;
    const currentQuestion = questionsList[currentIndex];

    if (!currentQuestion) return;

    const correctAnswer = currentQuestion.answers.find(a => a.isCorrect);
    const correct = selectedAnswer === correctAnswer?.id;

    setIsCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      if (!isRetryMode) setScore(prev => prev + 1);
    } else {
      if (!isRetryMode) {
        // Add to wrong questions to retry later
        setWrongQuestions(prev => [...prev, currentQuestion]);
      }
    }
  };

  const handleNext = () => {
    const questionsList = isRetryMode ? wrongQuestions : (video.questions || []);
    const currentIndex = isRetryMode ? retryIndex : currentQuestionIndex;

    // Reset for next
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setIsCorrect(false);

    if (currentIndex < questionsList.length - 1) {
      if (isRetryMode) {
        setRetryIndex(prev => prev + 1);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    } else {
      // End of list
      if (!isRetryMode && wrongQuestions.length > 0) {
        // Start retry mode
        setIsRetryMode(true);
        setRetryIndex(0);
      } else if (isRetryMode && wrongQuestions.length > 0 && !isCorrect) {
        // We still have wrong questions? No, we retry them as they come.
        // Wait, the requirement is "at the end incorrect answers are corrected... until error is fixed"
        // If we are in retry mode and answer was wrong, we should maybe stay on this question?
        // Let's refine: if in retry mode and correct, remove from wrongQuestions or just move to next if available.
        // If it was the last wrong question and we finished it correctly, we are done.

        // Let's simplify: in retry mode, we filter out corrected once.
        const stillWrong = wrongQuestions.filter((_, idx) => idx !== retryIndex);
        if (stillWrong.length > 0) {
          setWrongQuestions(stillWrong);
          setRetryIndex(0); // Restart retry loop
        } else {
          handleComplete();
        }
      } else {
        handleComplete();
      }
    }
  };

  // Override handleNext for retry logic: if correct, remove from wrong list.
  const handleProceed = () => {
    if (isRetryMode) {
      if (isCorrect) {
        const newWrong = [...wrongQuestions];
        newWrong.splice(retryIndex, 1);
        setWrongQuestions(newWrong);
        if (newWrong.length === 0) {
          handleComplete();
        } else {
          // Stay on same index or go to 0 if last was removed
          setRetryIndex(prev => (prev >= newWrong.length ? 0 : prev));
          setSelectedAnswer(null);
          setIsAnswerChecked(false);
          setIsCorrect(false);
        }
      } else {
        // Wrong in retry mode? Just reset and try again?
        // "пока ошибку не исправит"
        setSelectedAnswer(null);
        setIsAnswerChecked(false);
        setIsCorrect(false);
        // Stay on same retryIndex
      }
    } else {
      handleNext();
    }
  };

  const handleComplete = async () => {
    if (watchTimerRef.current) {
      clearInterval(watchTimerRef.current);
    }
    const userId = apiService.getCurrentUserId();
    const result = await apiService.completeVideo(userId, videoId, watchTime);

    if (result.success) {
      if (returnLessonId) {
        const lessonXp = parseInt(localStorage.getItem('currentLessonXp') || '20', 10);
        await apiService.completeLesson(returnLessonId, 1, 1, lessonXp);
      }
      setTimeout(() => setCompleted(true), 500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFECF]">
        <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#FFFECF]">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl transform animate-pop">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">{t.lessonCompleted}</h2>
          <p className="text-lg text-gray-600 mb-6">{getLocalizedTitle(video)}</p>

          <div className="flex gap-4 justify-center mb-6">
            <div className="flex-1 bg-white border-4 border-yellow-300 rounded-3xl p-5 shadow-sm transform hover:scale-105 transition">
              <div className="text-3xl font-black text-yellow-500 mb-1">+{video?.xpReward} XP</div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Опыт</div>
            </div>

            <div className="flex-1 bg-white border-4 border-blue-300 rounded-3xl p-5 shadow-sm transform hover:scale-105 transition" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl font-black text-blue-500 mb-1">+10 💎</div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Алмазы</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-6 mb-8 border-2 border-green-200">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" strokeWidth={3} />
            <div className="font-black text-gray-700 text-lg">
              {t.correctAnswers}: {score} / {video?.questions?.length}
            </div>
          </div>
          <button
            onClick={() => navigate(returnTo)}
            className="w-full bg-pink-400 text-white py-4 rounded-2xl font-black text-xl shadow-[0_6px_0_0_#C54554] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all"
          >
            {t.continue.toUpperCase()}
          </button>
        </div>
      </div>
    );
  }

  const currentList = isRetryMode ? wrongQuestions : (video?.questions || []);
  const currentIndex = isRetryMode ? retryIndex : currentQuestionIndex;
  const q = currentList[currentIndex];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFECF]">
      <header className="px-6 py-6 md:py-8 flex items-center gap-6 bg-transparent z-20 max-w-5xl mx-auto w-full">
        <button
          onClick={() => {
            if (watchTimerRef.current) clearInterval(watchTimerRef.current);
            navigate(returnTo);
          }}
          className="text-gray-400 hover:text-pink-400 transition transform hover:scale-110"
        >
          <ChevronLeft size={36} strokeWidth={4} />
        </button>

        <div className="flex-1 h-5 bg-white rounded-full overflow-hidden border-2 border-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
          {quizStarted && (
            <div
              className="h-full bg-[#58CC02] transition-all duration-700 rounded-full shadow-[inset_0_-4px_0_0_rgba(0,0,0,0.15)]"
              style={{ width: `${((isRetryMode ? (video.questions.length - wrongQuestions.length + retryIndex) : currentQuestionIndex) / video.questions.length) * 100}%` }}
            />
          )}
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border-2 border-pink-100 font-black text-gray-500 text-sm">
          ⏱️ {Math.floor(watchTime / 60)}:{(watchTime % 60).toString().padStart(2, '0')}
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        {!quizStarted ? (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-[2.5rem] p-4 shadow-2xl border-4 border-white aspect-video relative overflow-hidden group">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=0&rel=0&modestbranding=1`}
                title={getLocalizedTitle(video)}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-xl border-2 border-pink-100 text-center">
              <h1 className="text-3xl font-black text-gray-900 mb-4">{getLocalizedTitle(video)}</h1>
              <div className="flex justify-center gap-6 mb-8">
                <span className="px-4 py-2 bg-pink-100 text-pink-500 rounded-2xl font-black text-sm uppercase">
                  {video.difficultyLevel === 'beginner' ? t.difficultyBeginner :
                    video.difficultyLevel === 'intermediate' ? t.difficultyIntermediate : t.difficultyAdvanced}
                </span>
                <span className="px-4 py-2 bg-yellow-100 text-yellow-600 rounded-2xl font-black text-sm uppercase">
                  ⭐ +{video.xpReward} XP
                </span>
              </div>
              <button
                onClick={() => setQuizStarted(true)}
                className="w-full max-w-md bg-pink-400 text-white py-5 rounded-2xl font-black text-2xl shadow-[0_6px_0_0_#C54554] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all uppercase"
              >
                {t.start}
              </button>
            </div>
          </div>
        ) : q ? (
          <div className="space-y-8 animate-slide-up">
            <div className="text-center">
              <h2 className="text-sm font-black text-pink-400 uppercase tracking-widest mb-2">
                {isRetryMode ? t.mistakesPractice : t.quiz}
              </h2>
              <h1 className="text-3xl font-black text-gray-800 leading-tight">
                {q.questionText}
              </h1>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {q.answers?.map((ans, idx) => {
                const isSelected = selectedAnswer === ans.id;
                let variantStyles = "w-full p-6 text-left rounded-3xl border-2 font-black text-xl transition-all flex items-center gap-4 ";

                if (isAnswerChecked) {
                  if (ans.isCorrect) {
                    variantStyles += "bg-green-100 border-green-400 text-green-700 shadow-[0_4px_0_0_#46A302]";
                  } else if (isSelected) {
                    variantStyles += "bg-red-100 border-red-400 text-red-700 shadow-[0_4px_0_0_#C54554]";
                  } else {
                    variantStyles += "bg-gray-50 border-gray-100 text-gray-300 opacity-50";
                  }
                } else {
                  variantStyles += isSelected
                    ? "bg-blue-50 border-blue-400 text-blue-600 shadow-[0_4px_0_0_#3B82F6] translate-y-[-2px]"
                    : "bg-white border-gray-200 text-gray-700 hover:border-blue-200 hover:bg-blue-50/30 shadow-[0_4px_0_0_#E5E7EB]";
                }

                return (
                  <button
                    key={ans.id}
                    disabled={isAnswerChecked}
                    onClick={() => handleAnswerSelect(ans.id)}
                    className={variantStyles}
                  >
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm ${isSelected ? 'bg-current text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                      {idx + 1}
                    </span>
                    {getAnswerText(ans)}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </main>

      {/* Footer Check Bar */}
      {quizStarted && (
        <footer className={`fixed bottom-0 left-0 right-0 p-6 transition-all duration-300 border-t-4 ${!isAnswerChecked ? 'bg-white border-gray-100' :
          isCorrect ? 'bg-[#D7FFB7] border-[#D7FFB7]' : 'bg-[#FFDADC] border-[#FFDADC]'
          }`}>
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isAnswerChecked && (
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                  {isCorrect ? <CheckCircle size={40} color="white" strokeWidth={3} /> : <AlertCircle size={40} color="white" strokeWidth={3} />}
                </div>
              )}
              <div>
                {isAnswerChecked && (
                  <h3 className={`font-black text-2xl ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? t.correct : t.wrong}
                  </h3>
                )}
                {!isAnswerChecked && !selectedAnswer && (
                  <p className="font-bold text-gray-400">{t.selectAnswer}</p>
                )}
              </div>
            </div>

            {!isAnswerChecked ? (
              <button
                onClick={checkAnswer}
                disabled={!selectedAnswer}
                className={`px-12 py-5 rounded-2xl font-black text-xl transition-all ${(selectedAnswer)
                  ? 'bg-[#58CC02] text-white shadow-[0_6px_0_0_#46A302] hover:brightness-110 active:translate-y-1 active:shadow-none'
                  : 'bg-[#E5E5E5] text-[#AFAFAF] cursor-not-allowed shadow-none'
                  }`}
              >
                {t.checkBtn.toUpperCase()}
              </button>
            ) : (
              <button
                onClick={handleProceed}
                className={`px-12 py-5 rounded-2xl font-black text-xl text-white flex items-center gap-3 active:translate-y-1 active:shadow-none transition-all ${isCorrect ? 'bg-[#58CC02] shadow-[0_6px_0_0_#46A302]' : 'bg-[#FF4B4B] shadow-[0_6px_0_0_#EA2B2B]'
                  }`}
              >
                <span>{t.nextBtn.toUpperCase()}</span>
                <ArrowRight size={24} strokeWidth={3} />
              </button>
            )}
          </div>
        </footer>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.4s ease-out; }
        .animate-pop { animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes pop { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}} />
    </div>
  );
}
