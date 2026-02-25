import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from './services/api';
import { ChevronLeft, CheckCircle, AlertCircle, ArrowRight, Volume2 } from 'lucide-react';
import { getTranslation } from './translations';
import { useApp } from './context/AppContext';

export default function StoryReader() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { interfaceLang } = useApp();
  const t = getTranslation(interfaceLang);

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [returnTo] = useState(() => localStorage.getItem('returnTo') || '/stories');
  const [returnLessonId] = useState(() => localStorage.getItem('returnLessonId'));

  // Story state
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [visibleChapters, setVisibleChapters] = useState([]); // Duolingo style: list of messages
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [userInput, setUserInput] = useState(''); // For fill-in-the-blank
  const [activeHintId, setActiveHintId] = useState(null); // To show word/phrase translation

  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [isRetryMode, setIsRetryMode] = useState(false);
  const [retryIndex, setRetryIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAttemptedQuestions, setTotalAttemptedQuestions] = useState(0);

  const scrollRef = useRef(null);

  useEffect(() => {
    loadStory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [visibleChapters, currentQuestion]);

  const loadStory = async () => {
    const result = await apiService.getStoryById(storyId);
    if (result.success) {
      setStory(result.story);
      const userId = apiService.getCurrentUserId();
      await apiService.startStory(userId, storyId);

      // Initialize first chapter
      if (result.story.chapters && result.story.chapters.length > 0) {
        const first = result.story.chapters[0];
        setVisibleChapters([first]);
        if (first.questions && first.questions.length > 0) {
          setCurrentQuestion(first.questions[0]);
        }
      }
    }
    setLoading(false);
  };


  const getChapterText = (ch) => {
    if (!ch) return '';
    return ch.textKk; // Always show studied language
  };

  const getChapterHint = (ch) => {
    if (!ch) return '';
    // Use interface language or fallback
    if (interfaceLang === 'ru') return ch.textRu || ch.textEn;
    if (interfaceLang === 'en') return ch.textEn || ch.textRu;
    return ch.textRu;
  };

  const getQuestionText = (q) => {
    if (!q) return '';
    const targetLang = localStorage.getItem('selectedLanguage') || 'kk';
    if (targetLang === 'kk') return q.questionTextKk || q.questionText;
    if (targetLang === 'ru') return q.questionTextRu || q.questionText;
    if (targetLang === 'en') return q.questionTextEn || q.questionText;
    return q.questionText;
  }

  const getAnswerText = (a) => {
    if (!a) return '';
    return a.answerText;
  }

  const handleNext = () => {
    if (currentQuestion && !isAnswerChecked) return;

    // Reset feedback
    setIsAnswerChecked(false);
    setSelectedAnswer(null);
    setUserInput('');
    setIsCorrect(false);
    setActiveHintId(null);

    if (isRetryMode) {
      // Handled by handleProceed
      return;
    }

    // Move to next chapter or show next question in current chapter
    const currentChapter = story.chapters[currentChapterIndex];
    if (currentQuestion) {
      const qIndex = currentChapter.questions.findIndex(v => v.id === currentQuestion.id);
      if (qIndex < currentChapter.questions.length - 1) {
        setCurrentQuestion(currentChapter.questions[qIndex + 1]);
        return;
      }
    }

    // Next Chapter
    if (currentChapterIndex < story.chapters.length - 1) {
      const nextIdx = currentChapterIndex + 1;
      const nextChapter = story.chapters[nextIdx];
      setCurrentChapterIndex(nextIdx);
      setVisibleChapters(prev => [...prev, nextChapter]);
      setCurrentQuestion(nextChapter.questions && nextChapter.questions.length > 0 ? nextChapter.questions[0] : null);
    } else {
      // Story finished
      if (wrongQuestions.length > 0) {
        setIsRetryMode(true);
        setRetryIndex(0);
        setCurrentQuestion(wrongQuestions[0]);
      } else {
        completeStory();
      }
    }
  };

  const handleCheckAnswer = () => {
    if (!currentQuestion) return;

    let correct = false;
    if (currentQuestion.questionType === 'fill_blank') {
      if (!userInput.trim()) return;
      const correctAnswer = currentQuestion.answers.find(a => a.isCorrect);
      // Case insensitive check
      correct = userInput.trim().toLowerCase() === correctAnswer?.answerText.toLowerCase();
    } else {
      if (!selectedAnswer) return;
      const correctAnswer = currentQuestion.answers.find(a => a.isCorrect);
      correct = selectedAnswer.id === (correctAnswer?.id || currentQuestion.correctAnswerId);
    }

    setIsCorrect(correct);
    setIsAnswerChecked(true);

    if (!isRetryMode) {
      setTotalAttemptedQuestions(prev => prev + 1);
      if (correct) {
        setScore(prev => prev + 1);
      } else {
        setWrongQuestions(prev => [...prev, currentQuestion]);
      }
    }
  };

  const handleProceed = () => {
    if (isRetryMode) {
      if (isCorrect) {
        const newWrong = [...wrongQuestions];
        newWrong.splice(retryIndex, 1);
        setWrongQuestions(newWrong);
        if (newWrong.length === 0) {
          completeStory();
        } else {
          setRetryIndex(prev => (prev >= newWrong.length ? 0 : prev));
          setCurrentQuestion(newWrong[retryIndex >= newWrong.length ? 0 : retryIndex]);
          setIsAnswerChecked(false);
          setIsCorrect(false);
          setSelectedAnswer(null);
        }
      } else {
        // Stay and retry until correct
        setIsAnswerChecked(false);
        setIsCorrect(false);
        setSelectedAnswer(null);
        setUserInput('');
      }
    } else {
      handleNext();
    }
  }

  const completeStory = async () => {
    const userId = apiService.getCurrentUserId();
    const result = await apiService.completeStory(
      userId,
      storyId,
      score,
      Math.max(totalAttemptedQuestions, 1)
    );

    if (result.success) {
      if (returnLessonId) {
        const lessonXp = parseInt(localStorage.getItem('currentLessonXp') || '20', 10);
        await apiService.completeLesson(returnLessonId, score, Math.max(totalAttemptedQuestions, 1), lessonXp);
      }
      setCompleted(true);
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
    const percentage = totalAttemptedQuestions > 0 ? Math.round((score / totalAttemptedQuestions) * 100) : 100;
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#FFFECF]">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl transform animate-pop">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">{t.lessonCompleted}</h2>
          <p className="text-lg text-gray-600 mb-6">{story?.title}</p>

          <div className="flex gap-4 justify-center mb-6">
            <div className="flex-1 bg-white border-4 border-yellow-300 rounded-3xl p-5 shadow-sm transform hover:scale-105 transition">
              <div className="text-3xl font-black text-yellow-500 mb-1">+{story?.xpReward} XP</div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Опыт</div>
            </div>

            <div className="flex-1 bg-white border-4 border-blue-300 rounded-3xl p-5 shadow-sm transform hover:scale-105 transition" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl font-black text-blue-500 mb-1">+10 💎</div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Алмазы</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-purple-100 rounded-3xl p-6 mb-8 border-2 border-pink-100">
            <div className="text-4xl font-black text-pink-500 mb-2">{percentage}%</div>
            <div className="font-bold text-gray-700">
              {score} {t.outOf} {totalAttemptedQuestions} {t.correctAnswers.toLowerCase()}
            </div>
          </div>
          <button
            onClick={() => navigate(returnTo)}
            className="w-full bg-pink-400 text-white py-4 rounded-2xl font-black text-xl shadow-[0_6px_0_0_#C54554] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all uppercase"
          >
            {t.continue}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFECF]">
      {/* Header */}
      <header className="px-6 py-4 md:py-8 flex items-center gap-6 bg-transparent z-20 max-w-5xl mx-auto w-full">
        <button onClick={() => navigate(returnTo)} className="text-gray-400 hover:text-pink-400 transition transform hover:scale-110">
          <ChevronLeft size={36} strokeWidth={4} />
        </button>
        <div className="flex-1 h-5 bg-white rounded-full overflow-hidden border-2 border-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
          <div
            className="h-full bg-[#58CC02] transition-all duration-700 rounded-full shadow-[inset_0_-4px_0_0_rgba(0,0,0,0.15)]"
            style={{ width: `${((isRetryMode ? (story.chapters.length + retryIndex) : currentChapterIndex) / (story.chapters.length + (isRetryMode ? wrongQuestions.length : 0))) * 100}%` }}
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border-2 border-pink-100 font-black">
          <span className="text-pink-400">{score}</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-400">{totalAttemptedQuestions}</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-8 pb-32">
          {!isRetryMode && visibleChapters.map((ch, idx) => (
            <div key={ch.id} className="animate-fade-in flex flex-col">
              {ch.characterName ? (
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl border-2 border-pink-100 shadow-md flex-shrink-0 bg-pink-50 flex items-center justify-center overflow-hidden">
                    {ch.characterImageUrl ? (
                      <img src={ch.characterImageUrl} alt={ch.characterName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl text-pink-300">👤</span>
                    )}
                  </div>
                  <div className="relative group flex-1">
                    <div
                      onClick={() => setActiveHintId(activeHintId === ch.id ? null : ch.id)}
                      className="relative bg-white border-4 border-pink-200 p-6 rounded-3xl rounded-tl-none shadow-sm cursor-pointer hover:border-pink-300 transition-all active:scale-[0.98] group"
                    >
                      <div className="absolute -left-3 top-0 w-3 h-6 bg-white border-l-4 border-pink-200 clip-triangle-left"></div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-black text-pink-400 uppercase tracking-widest">{ch.characterName}</span>
                        <Volume2 size={16} className="text-pink-200 group-hover:text-pink-400 transition-colors" />
                      </div>
                      <p className="text-2xl font-bold text-gray-700 leading-tight">
                        {getChapterText(ch)}
                      </p>

                      {activeHintId === ch.id && (
                        <div className="mt-3 py-2 px-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-600 animate-slide-up flex items-center gap-2 border border-gray-100 shadow-inner">
                          <span className="text-pink-400 text-xs">A</span>
                          {getChapterHint(ch)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setActiveHintId(activeHintId === ch.id ? null : ch.id)}
                  className="py-4 px-6 bg-pink-50/50 rounded-2xl border-2 border-dashed border-pink-100 text-center cursor-pointer hover:bg-pink-50 transition-all"
                >
                  <p className="italic text-xl text-pink-500 font-bold">
                    {getChapterText(ch)}
                  </p>
                  {activeHintId === ch.id && (
                    <div className="mt-2 text-sm font-medium text-pink-400/80 animate-slide-up">
                      {getChapterHint(ch)}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {isRetryMode && (
            <div className="text-center py-6 bg-red-50 rounded-3xl border-2 border-red-100 text-red-500 font-black uppercase tracking-widest text-sm animate-bounce">
              {t.mistakesPractice}
            </div>
          )}

          {currentQuestion && (
            <div className="animate-slide-up space-y-6 pt-6 border-t-2 border-gray-50">
              <div className="text-center">
                <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-black uppercase mb-3">
                  {currentQuestion.questionType === 'plot' ? 'Вопрос по сюжету' : 'Грамматика'}
                </span>
                <h3 className="text-2xl font-black text-gray-900 leading-tight">
                  {getQuestionText(currentQuestion)}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.questionType === 'fill_blank' ? (
                  <div className="relative">
                    <input
                      type="text"
                      className={`w-full p-6 bg-white border-4 border-b-8 rounded-3xl text-2xl font-black transition-all outline-none ${isAnswerChecked
                        ? isCorrect
                          ? 'border-green-400 text-green-700 bg-green-50 shadow-[0_4px_0_0_#46A302]'
                          : 'border-red-400 text-red-700 bg-red-50 shadow-[0_4px_0_0_#C54554]'
                        : 'border-gray-200 focus:border-pink-300 text-gray-700'
                        }`}
                      placeholder={t.typeHere}
                      value={userInput}
                      onChange={(e) => !isAnswerChecked && setUserInput(e.target.value)}
                      disabled={isAnswerChecked}
                      autoFocus
                    />
                    {isAnswerChecked && !isCorrect && (
                      <div className="mt-4 p-4 bg-red-50 rounded-2xl border-2 border-red-100 flex items-center gap-3 animate-slide-up">
                        <AlertCircle className="text-red-500" />
                        <div>
                          <p className="text-sm font-bold text-red-400 uppercase">{t.correctAnswer}:</p>
                          <p className="text-xl font-black text-red-700">
                            {getAnswerText(currentQuestion.answers.find(a => a.isCorrect))}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  currentQuestion.answers?.map((ans, idx) => {
                    const isSelected = selectedAnswer?.id === ans.id;
                    let variantStyles = "w-full p-5 text-left rounded-2xl border-2 font-black text-lg transition-all flex items-center gap-3 ";

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
                        onClick={() => setSelectedAnswer(ans)}
                        className={variantStyles}
                      >
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm ${isSelected ? 'bg-current text-white' : 'bg-gray-100 text-gray-400'
                          }`}>
                          {idx + 1}
                        </span>
                        {getAnswerText(ans)}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </main>

      {/* Footer Check Bar */}
      <footer className={`fixed bottom-0 left-0 right-0 p-6 transition-all duration-300 border-t-4 z-30 ${!isAnswerChecked ? 'bg-white border-gray-100' :
        isCorrect ? 'bg-[#D7FFB7] border-[#D7FFB7]' : 'bg-[#FFDADC] border-[#FFDADC]'
        }`}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isAnswerChecked && (
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                {isCorrect ? <CheckCircle size={32} color="white" strokeWidth={3} /> : <AlertCircle size={32} color="white" strokeWidth={3} />}
              </div>
            )}
            <div>
              {isAnswerChecked && (
                <h3 className={`font-black text-2xl ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect ? t.correct : t.wrong}
                </h3>
              )}
              {!isAnswerChecked && currentQuestion && (
                <p className="font-bold text-gray-400">
                  {currentQuestion.questionType === 'fill_blank'
                    ? t.fillBlank
                    : (!selectedAnswer && t.selectAnswer)}
                </p>
              )}
            </div>
          </div>

          {!isAnswerChecked ? (
            currentQuestion ? (
              <button
                onClick={handleCheckAnswer}
                disabled={currentQuestion.questionType === 'fill_blank' ? !userInput.trim() : !selectedAnswer}
                className={`px-12 py-5 rounded-2xl font-black text-xl transition-all ${(currentQuestion.questionType === 'fill_blank' ? userInput.trim() : selectedAnswer)
                  ? 'bg-[#58CC02] text-white shadow-[0_6px_0_0_#46A302] hover:brightness-110 active:translate-y-1 active:shadow-none'
                  : 'bg-[#E5E5E5] text-[#AFAFAF] cursor-not-allowed shadow-none'
                  }`}
              >
                {t.checkBtn.toUpperCase()}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-12 py-5 bg-[#58CC02] text-white rounded-2xl font-black text-xl shadow-[0_6px_0_0_#46A302] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all uppercase"
              >
                {t.nextBtn.toUpperCase()}
              </button>
            )
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

      <style dangerouslySetInnerHTML={{
        __html: `
        .clip-triangle-left { clip-path: polygon(100% 0, 0 0, 100% 100%); }
        @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.4s ease-out; }
        @keyframes pop { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-pop { animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}} />
    </div>
  );
}
