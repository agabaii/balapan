
// src/VideoPlayer.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from './services/api';
import { ChevronLeft, CheckCircle, HelpCircle, AlertCircle } from 'lucide-react';

export default function VideoPlayer() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const watchTimerRef = useRef(null);

  // Состояние теста
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
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

  const loadVideo = async () => {
    const result = await apiService.getVideoById(videoId);
    if (result.success) {
      setVideo(result.video);

      const userId = apiService.getCurrentUserId();
      await apiService.startVideo(userId, videoId);
    }
    setLoading(false);
  };

  const startWatchTimer = () => {
    watchTimerRef.current = setInterval(() => {
      setWatchTime(prev => prev + 1);
    }, 1000);
  };

  const handleAnswerSelect = (questionId, answerId) => {
    if (showResults) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerId
    });
  };

  const checkQuiz = () => {
    if (!video || !video.questions) return;

    let correctCount = 0;
    video.questions.forEach(q => {
      const selectedId = selectedAnswers[q.id];
      const correctAnswer = q.answers.find(a => a.isCorrect);
      if (selectedId === correctAnswer?.id) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setShowResults(true);

    if (correctCount === video.questions.length) {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    if (watchTimerRef.current) {
      clearInterval(watchTimerRef.current);
    }

    const userId = apiService.getCurrentUserId();
    const result = await apiService.completeVideo(userId, videoId, watchTime);

    if (result.success) {
      // Small delay to show results
      setTimeout(() => setCompleted(true), 1500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFECF' }}>
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-400"></div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#FFFECF' }}>
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Сабақ аяқталды!
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            {video?.title}
          </p>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-6">
            <div className="text-emerald-500 mb-2 flex justify-center">
              <CheckCircle className="w-16 h-16" />
            </div>
            <div className="font-bold text-gray-700">
              Сұрақтар: {score} / {video?.questions?.length}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-6 text-yellow-500">
            <span className="text-2xl">⭐</span>
            <span className="text-2xl font-bold">+{video?.xpReward} XP</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/videos')}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition"
            >
              К видео
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 bg-pink-400 text-white py-3 rounded-xl font-medium hover:bg-pink-500 transition"
            >
              Профиль
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFECF' }}>
        <div className="text-center">
          <p className="text-gray-700 mb-4">Видео не найдено</p>
          <button
            onClick={() => navigate('/videos')}
            className="bg-pink-400 text-white px-6 py-2 rounded-lg hover:bg-pink-500"
          >
            Назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#FFFECF' }}>
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center" style={{ backgroundColor: '#FFFECF' }}>
        <button
          onClick={() => {
            if (watchTimerRef.current) {
              clearInterval(watchTimerRef.current);
            }
            navigate('/videos');
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Назад</span>
        </button>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 font-bold bg-white px-3 py-1 rounded-full shadow-sm">
            ⏱️ {Math.floor(watchTime / 60)}:{(watchTime % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6">
        {/* Video Info */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {video.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm mt-3">
            <span className="px-3 py-1 bg-white text-pink-500 rounded-full font-bold shadow-sm">
              {video.difficultyLevel === 'beginner' ? 'Начальный' :
                video.difficultyLevel === 'intermediate' ? 'Средний' : 'Продвинутый'}
            </span>
            <span className="text-orange-500 font-bold bg-white px-3 py-1 rounded-full shadow-sm">⭐ +{video.xpReward} XP</span>
          </div>
        </div>

        {/* YouTube Player */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border-4 border-white">
          <div className="relative" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=0&rel=0`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* QUIZ SECTION */}
        <div className="bg-white rounded-3xl p-8 shadow-sm mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <HelpCircle className="text-pink-400" />
            Видео бойынша тест
          </h2>

          {!quizStarted && (
            <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl">
              <p className="text-gray-600 mb-6 text-lg">
                Видеон қарап болғаннан кейін, біліміңді тексеру үшін тесттен өт.
              </p>
              <button
                onClick={() => setQuizStarted(true)}
                className="bg-pink-400 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-pink-500 transition shadow-lg"
              >
                Тестті бастау
              </button>
            </div>
          )}

          {quizStarted && (
            <div className="space-y-10">
              {video.questions?.map((q, idx) => (
                <div key={q.id} className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {idx + 1}. {q.questionText}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.answers?.map((ans) => {
                      const isSelected = selectedAnswers[q.id] === ans.id;
                      const isCorrect = ans.isCorrect;
                      let variantClasses = "p-4 rounded-2xl border-2 transition text-left font-medium flex items-center gap-3 ";

                      if (showResults) {
                        if (isCorrect) {
                          variantClasses += "bg-green-50 border-green-500 text-green-700 ring-2 ring-green-200";
                        } else if (isSelected && !isCorrect) {
                          variantClasses += "bg-red-50 border-red-500 text-red-700";
                        } else {
                          variantClasses += "bg-gray-50 border-gray-100 text-gray-400";
                        }
                      } else {
                        variantClasses += isSelected
                          ? "bg-pink-50 border-pink-400 text-pink-700 shadow-md"
                          : "bg-white border-gray-100 hover:border-pink-200 hover:bg-pink-50/30";
                      }

                      return (
                        <button
                          key={ans.id}
                          disabled={showResults}
                          onClick={() => handleAnswerSelect(q.id, ans.id)}
                          className={variantClasses}
                        >
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-pink-400 text-white' : 'bg-gray-100 text-gray-500'
                            }`}>
                            {String.fromCharCode(65 + q.answers.indexOf(ans))}
                          </span>
                          {ans.answerText}
                          {showResults && isCorrect && <CheckCircle className="ml-auto text-green-500 w-5 h-5" />}
                          {showResults && isSelected && !isCorrect && <AlertCircle className="ml-auto text-red-500 w-5 h-5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {!showResults ? (
                <div className="pt-6 flex justify-center">
                  <button
                    disabled={Object.keys(selectedAnswers).length < (video.questions?.length || 0)}
                    onClick={checkQuiz}
                    className={`px-12 py-4 rounded-2xl font-bold text-lg shadow-lg transition ${Object.keys(selectedAnswers).length < (video.questions?.length || 0)
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:opacity-90'
                      }`}
                  >
                    Тексеру
                  </button>
                </div>
              ) : (
                <div className={`p-6 rounded-2xl text-center font-bold text-lg ${score === video.questions.length ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                  }`}>
                  {score === video.questions.length
                    ? "Керемет! Барлығы дұрыс. Сабақ аяқталды! 🎉"
                    : `Нәтиже: ${score} / ${video.questions.length}. Қателерді қарап, қайта көріңіз.`
                  }
                  {score < video.questions.length && (
                    <button
                      onClick={() => { setShowResults(false); setQuizStarted(false); setSelectedAnswers({}); }}
                      className="block mx-auto mt-4 text-sm underline hover:no-underline"
                    >
                      Қайтадан тапсыру
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}