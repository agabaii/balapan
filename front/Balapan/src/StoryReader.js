// front/src/StoryReader.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from './services/api';

export default function StoryReader() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  
  const [story, setStory] = useState(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    loadStory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId]);

  const loadStory = async () => {
    const result = await apiService.getStoryById(storyId);
    if (result.success) {
      setStory(result.story);
      
      // Start the story
      const userId = apiService.getCurrentUserId();
      await apiService.startStory(userId, storyId);
    }
    setLoading(false);
  };

  const currentChapter = story?.chapters?.[currentChapterIndex];
  const hasQuestion = currentChapter?.questions?.length > 0;
  const currentQuestion = currentChapter?.questions?.[0];

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer.isCorrect;
    setShowResult(true);
    
    if (isCorrect) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setScore(prev => ({ ...prev, total: prev.total + 1 }));
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < story.chapters.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
      setShowTranslation(false);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      completeStory();
    }
  };

  const completeStory = async () => {
    const userId = apiService.getCurrentUserId();
    const result = await apiService.completeStory(
      userId,
      storyId,
      score.correct,
      score.total
    );

    if (result.success) {
      setCompleted(true);
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
    const percentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#FFFECF' }}>
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            История завершена!
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            {story?.title}
          </p>

          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 mb-6">
            <div className="text-5xl font-bold text-pink-400 mb-2">
              {percentage}%
            </div>
            <div className="text-gray-700">
              {score.correct} из {score.total} правильных ответов
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-6 text-yellow-500">
            <span className="text-2xl">⭐</span>
            <span className="text-2xl font-bold">+{story?.xpReward} XP</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/stories')}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition"
            >
              К историям
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

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFECF' }}>
        <div className="text-center">
          <p className="text-gray-700 mb-4">История не найдена</p>
          <button
            onClick={() => navigate('/stories')}
            className="bg-pink-400 text-white px-6 py-2 rounded-lg hover:bg-pink-500"
          >
            Назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFECF' }}>
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate('/stories')}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            <span>←</span>
            <span>Назад</span>
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Глава {currentChapterIndex + 1} / {story.chapters.length}
            </span>
            <span className="text-sm font-medium text-pink-400">
              {score.correct}/{score.total} ✓
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Story Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {story.title}
          </h1>
          <p className="text-lg text-gray-600">{story.titleKk}</p>
        </div>

        {/* Chapter Card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mb-6">
          {/* Character */}
          {currentChapter?.characterName && (
            <div className="flex items-center gap-3 mb-6 pb-6 border-b">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-2xl">
                👤
              </div>
              <div>
                <div className="font-bold text-gray-900">{currentChapter.characterName}</div>
                <div className="text-sm text-gray-500">говорит...</div>
              </div>
            </div>
          )}

          {/* Kazakh Text */}
          <div className="mb-6">
            <p className="text-2xl leading-relaxed text-gray-900 font-medium">
              {currentChapter?.textKk}
            </p>
          </div>

          {/* Translation Toggle */}
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className="text-pink-400 hover:text-pink-500 font-medium text-sm flex items-center gap-2 mb-4"
          >
            <span>{showTranslation ? '🙈' : '👀'}</span>
            <span>{showTranslation ? 'Скрыть перевод' : 'Показать перевод'}</span>
          </button>

          {/* Russian Translation */}
          {showTranslation && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-lg text-gray-700 italic">
                {currentChapter?.textRu}
              </p>
            </div>
          )}

          {/* Question */}
          {hasQuestion && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {currentQuestion?.questionText}
              </h3>

              <div className="space-y-3">
                {currentQuestion?.answers?.map((answer) => {
                  const isSelected = selectedAnswer?.id === answer.id;
                  const showCorrect = showResult && answer.isCorrect;
                  const showWrong = showResult && isSelected && !answer.isCorrect;

                  return (
                    <button
                      key={answer.id}
                      onClick={() => !showResult && handleAnswerSelect(answer)}
                      disabled={showResult}
                      className={`
                        w-full text-left p-4 rounded-xl border-2 transition
                        ${showCorrect ? 'bg-green-100 border-green-500' : ''}
                        ${showWrong ? 'bg-red-100 border-red-500' : ''}
                        ${isSelected && !showResult ? 'bg-pink-100 border-pink-400' : ''}
                        ${!isSelected && !showResult && !showCorrect ? 'bg-white border-gray-200 hover:border-pink-300' : ''}
                        ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{answer.answerText}</span>
                        {showCorrect && <span className="text-green-600 text-xl">✓</span>}
                        {showWrong && <span className="text-red-600 text-xl">✗</span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Check Answer Button */}
              {!showResult && (
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selectedAnswer}
                  className={`
                    w-full mt-4 py-4 rounded-xl font-bold text-lg transition
                    ${selectedAnswer
                      ? 'bg-pink-400 text-white hover:bg-pink-500'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  Проверить
                </button>
              )}

              {/* Next Button */}
              {showResult && (
                <button
                  onClick={handleNextChapter}
                  className="w-full mt-4 bg-pink-400 text-white py-4 rounded-xl font-bold text-lg hover:bg-pink-500 transition"
                >
                  {currentChapterIndex < story.chapters.length - 1 ? 'Продолжить' : 'Завершить'}
                </button>
              )}
            </div>
          )}

          {/* Continue without question */}
          {!hasQuestion && (
            <button
              onClick={handleNextChapter}
              className="w-full mt-6 bg-pink-400 text-white py-4 rounded-xl font-bold text-lg hover:bg-pink-500 transition"
            >
              {currentChapterIndex < story.chapters.length - 1 ? 'Продолжить' : 'Завершить'}
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl p-4">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-500"
              style={{ width: `${((currentChapterIndex + 1) / story.chapters.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}