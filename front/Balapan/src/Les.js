// src/Les.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiService from './services/api';

export default function LessonExercise() {
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lessonData, setLessonData] = useState(null);
  const [currentSection, setCurrentSection] = useState('theory');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [loadingLesson, setLoadingLesson] = useState(true);
  const [error, setError] = useState(null);
  const [animateError, setAnimateError] = useState(false);
  const [animateSuccess, setAnimateSuccess] = useState(false);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    loadLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadLesson = async () => {
    console.log('📖 Загрузка урока...');

    const courseId = localStorage.getItem('selectedCourseId');
    const lessonId = localStorage.getItem('currentLessonId');

    if (!courseId) {
      console.log('❌ Курс не выбран');
      navigate('/lesson');
      return;
    }

    if (!lessonId) {
      console.log('❌ ID урока не найден');
      navigate('/lesson');
      return;
    }

    try {
      const result = await apiService.getCourseById(courseId);

      if (result.success && result.course.levels) {
        let foundLesson = null;

        for (const level of result.course.levels) {
          if (level.lessons) {
            foundLesson = level.lessons.find(lesson => lesson.id === parseInt(lessonId));
            if (foundLesson) break;
          }
        }

        if (foundLesson) {
          console.log('✅ Урок загружен:', foundLesson.title);
          setLessonData(foundLesson);
        } else {
          console.log('⚠️ Урок не найден с ID:', lessonId);
          setError('Урок не найден');
        }
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки урока:', error);
      setError('Ошибка загрузки урока: ' + error.message);
    } finally {
      setLoadingLesson(false);
    }
  };

  // Генерируем секции на основе контента урока
  const generateSections = () => {
    if (!lessonData) return [];

    const sections = [];

    // Теория
    if (lessonData.content?.theoryText) {
      sections.push({
        id: 'theory',
        name: 'ТЕОРИЯ',
        type: 'theory'
      });
    }

    // Грамматика
    if (lessonData.content?.grammarRules) {
      sections.push({
        id: 'grammar',
        name: 'ГРАММАТИКА',
        type: 'note'
      });
    }

    // Примеры
    if (lessonData.content?.examples) {
      sections.push({
        id: 'examples',
        name: 'ПРИМЕРЫ',
        type: 'note'
      });
    }

    // Советы
    if (lessonData.content?.tips) {
      sections.push({
        id: 'tips',
        name: 'СОВЕТЫ',
        type: 'note'
      });
    }

    // Произношение
    if (lessonData.content?.pronunciationGuide) {
      sections.push({
        id: 'pronunciation',
        name: 'ПРОИЗНОШЕНИЕ',
        type: 'note'
      });
    }

    // Упражнения
    if (lessonData.exercises && lessonData.exercises.length > 0) {
      lessonData.exercises.forEach((_, index) => {
        sections.push({
          id: `exercise-${index}`,
          name: `УПРАЖНЕНИЕ ${index + 1}`,
          type: 'exercise',
          exerciseIndex: index
        });
      });
    }

    return sections;
  };

  const sections = generateSections();

  const handleAnswerSelect = (optionIndex) => {
    if (showResult) return;
    setSelectedAnswer(optionIndex);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;

    const currentExercise = lessonData.exercises[currentExerciseIndex];
    const selectedOption = currentExercise.options[selectedAnswer];

    setShowResult(true);

    if (selectedOption.isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
      setAnimateSuccess(true);
    } else {
      setAnimateError(true);
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives === 0) {
        setGameOver(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        return;
      }
    }
    setTimeout(() => { setAnimateError(false); setAnimateSuccess(false); }, 500);

    setTimeout(() => {
      const currentSectionIndex = sections.findIndex(s => s.id === currentSection);
      if (currentSectionIndex < sections.length - 1) {
        // Переход к следующей секции
        const nextSection = sections[currentSectionIndex + 1];
        setCurrentSection(nextSection.id);
        if (nextSection.type === 'exercise') {
          setCurrentExerciseIndex(nextSection.exerciseIndex);
        }
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        // Завершаем урок
        handleCompleteLesson();
      }
    }, 1500);
  };

  const handleCompleteLesson = async () => {
    console.log('🎯 ===== ЗАВЕРШЕНИЕ УРОКА =====');
    setLoading(true);
    setError(null);

    try {
      const lessonId = lessonData?.id;
      const xpToAdd = lessonData?.xpReward || 20;
      const totalQuestions = lessonData?.exercises?.length || 0;

      if (!lessonId) {
        throw new Error('ID урока не найден');
      }

      const result = await apiService.completeLesson(
        lessonId,
        correctAnswers,
        totalQuestions,
        xpToAdd
      );

      if (result.success) {
        console.log('✅ УРОК УСПЕШНО ЗАВЕРШЕН!');
        setCompleted(true);

        setTimeout(() => {
          navigate('/lesson');
        }, 2000);
      } else {
        const errorMsg = result.message || 'Неизвестная ошибка при завершении урока';
        console.error('❌ Ошибка завершения:', errorMsg);
        setError(errorMsg);
        alert('Ошибка: ' + errorMsg);
      }
    } catch (error) {
      console.error('❌ КРИТИЧЕСКАЯ ОШИБКА:', error);
      setError(error.message);
      alert('Ошибка: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNextSection = () => {
    const currentSectionIndex = sections.findIndex(s => s.id === currentSection);
    if (currentSectionIndex < sections.length - 1) {
      const nextSection = sections[currentSectionIndex + 1];
      setCurrentSection(nextSection.id);
      if (nextSection.type === 'exercise') {
        setCurrentExerciseIndex(nextSection.exerciseIndex);
        setSelectedAnswer(null);
        setShowResult(false);
      }
    } else {
      handleCompleteLesson();
    }
  };

  const renderContent = () => {
    if (!lessonData) return null;

    const section = sections.find(s => s.id === currentSection);
    if (!section) return null;

    switch (section.type) {
      case 'theory':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📖 {lessonData.content.theoryTitle || 'Теория'}
            </h2>
            <p className="text-base text-gray-800 whitespace-pre-line leading-relaxed">
              {lessonData.content.theoryText}
            </p>
          </div>
        );

      case 'note':
        if (section.id === 'grammar') {
          return (
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-3">📖 Грамматика</h3>
              <p className="text-base text-gray-800 whitespace-pre-line">
                {lessonData.content.grammarRules}
              </p>
            </div>
          );
        } else if (section.id === 'examples') {
          return (
            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-3">💡 Примеры</h3>
              <p className="text-base text-gray-800 whitespace-pre-line">
                {lessonData.content.examples}
              </p>
            </div>
          );
        } else if (section.id === 'tips') {
          return (
            <div className="bg-yellow-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-3">💭 Советы</h3>
              <p className="text-base text-gray-800 whitespace-pre-line">
                {lessonData.content.tips}
              </p>
            </div>
          );
        } else if (section.id === 'pronunciation') {
          return (
            <div className="bg-pink-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-3">🗣️ Произношение</h3>
              <p className="text-base text-gray-800 whitespace-pre-line">
                {lessonData.content.pronunciationGuide}
              </p>
            </div>
          );
        }
        break;

      case 'exercise':
        const exercise = lessonData.exercises[section.exerciseIndex];

        // --- MATCHING TYPE ---
        if (exercise.exerciseType === 'match') {
          // Parse pairs: "A=B"
          // We need state for matching. Ideally we should move this to a sub-component, 
          // but for now we implement inline or assume simple state.
          // Since we need complex state, let's use a simple approach: 
          // Click left item, then click right item.

          if (!exercise.pairsParsed) {
            exercise.pairsParsed = exercise.options.map(opt => {
              const parts = opt.optionText.split('=');
              return { id: opt.id, left: parts[0], right: parts[1], original: opt };
            });
            // Shuffle right side
            exercise.leftItems = exercise.pairsParsed.map(p => ({ id: p.id, text: p.left, matched: false }));
            exercise.rightItems = [...exercise.pairsParsed]
              .sort(() => Math.random() - 0.5)
              .map(p => ({ id: p.id, text: p.right, matched: false }));
          }

          const handleMatchClick = (side, item) => {
            if (showResult || item.matched) return;

            if (side === 'left') {
              setSelectedAnswer({ ...selectedAnswer, left: item });
            } else {
              if (!selectedAnswer?.left) return;

              // Check match
              const isCorrect = selectedAnswer.left.id === item.id;

              if (isCorrect) {
                // Mark as matched
                exercise.leftItems.find(i => i.id === item.id).matched = true;
                exercise.rightItems.find(i => i.id === item.id).matched = true;
                setSelectedAnswer(null);

                // Check if all matched
                if (exercise.leftItems.every(i => i.matched)) {
                  setCorrectAnswers(correctAnswers + 1);
                  setAnimateSuccess(true);
                  setShowResult(true);
                  setTimeout(() => { setAnimateSuccess(false); handleNextSection(); }, 1500);
                }
              } else {
                // Wrong match visual feedback?
                setAnimateError(true);
                const newLives = lives - 1;
                setLives(newLives);
                setTimeout(() => setAnimateError(false), 500);
                if (newLives === 0) {
                  setGameOver(true);
                  setTimeout(() => window.location.reload(), 2000);
                } else {
                  alert('Неверно! Попробуйте снова.');
                }
                setSelectedAnswer(null);
              }
            }
          };

          return (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">{exercise.questionText}</h3>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  {exercise.leftItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleMatchClick('left', item)}
                      disabled={item.matched}
                      className={`w-full p-4 rounded-xl font-bold transition
                         ${item.matched ? 'bg-green-100 text-green-800 opacity-50' :
                          selectedAnswer?.left?.id === item.id ? 'bg-blue-200 border-2 border-blue-400' : 'bg-white border-2 border-gray-200 hover:border-pink-300'}
                       `}
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
                <div className="space-y-4">
                  {exercise.rightItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleMatchClick('right', item)}
                      disabled={item.matched}
                      className={`w-full p-4 rounded-xl font-bold transition
                         ${item.matched ? 'bg-green-100 text-green-800 opacity-50' : 'bg-white border-2 border-gray-200 hover:border-pink-300'}
                       `}
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        // --- SENTENCE BUILDER ---
        if (exercise.exerciseType === 'sentence') {
          // State: builtSentence (array of words)
          // We reuse selectedAnswer as the array of selected word INDICES from options
          // Initially selectedAnswer needs to be []
          if (!selectedAnswer && !showResult) {
            // We need to initialize it differently than 'null'
            // but we can check if it's an array
          }

          const currentSelection = Array.isArray(selectedAnswer) ? selectedAnswer : [];

          const handleWordClick = (word, index) => {
            if (showResult) return;
            // Add word index to selection
            if (!currentSelection.includes(index)) {
              setSelectedAnswer([...currentSelection, index]);
            }
          };

          const handleRemoveWord = (indexToRemove) => {
            if (showResult) return;
            setSelectedAnswer(currentSelection.filter(i => i !== indexToRemove));
          };

          const handleCheckSentence = () => {
            const builtSentence = currentSelection.map(i => exercise.options[i].optionText).join(' ');
            const isCorrect = builtSentence === exercise.correctAnswer;

            setShowResult(true);
            if (isCorrect) {
              setCorrectAnswers(correctAnswers + 1);
              setAnimateSuccess(true);
              setTimeout(() => { setAnimateSuccess(false); handleNextSection(); }, 2000);
            } else {
              setAnimateError(true);
              const newLives = lives - 1;
              setLives(newLives);
              setTimeout(() => setAnimateError(false), 500);
              if (newLives === 0) {
                setGameOver(true);
                setTimeout(() => window.location.reload(), 2000);
              }
            }
          };

          return (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">{exercise.questionText}</h3>

              <div className="min-h-[80px] bg-gray-100 rounded-xl p-4 mb-6 flex flex-wrap gap-2">
                {currentSelection.map((wordIndex, i) => (
                  <button
                    key={i}
                    onClick={() => handleRemoveWord(wordIndex)}
                    className="bg-white px-4 py-2 rounded-lg shadow-sm border font-bold hover:bg-red-50"
                  >
                    {exercise.options[wordIndex].optionText}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                {exercise.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleWordClick(option, index)}
                    disabled={currentSelection.includes(index) || showResult}
                    className={`px-4 py-3 rounded-xl font-bold border-b-4 transition
                        ${currentSelection.includes(index)
                        ? 'opacity-0'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 active:translate-y-1 active:border-b-0'}
                      `}
                  >
                    {option.optionText}
                  </button>
                ))}
              </div>

              {!showResult && (
                <button
                  onClick={handleCheckSentence}
                  disabled={currentSelection.length === 0}
                  className="w-full mt-8 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl transition shadow-[0_4px_0_0_#166534]"
                >
                  ПРОВЕРИТЬ
                </button>
              )}

              {showResult && (
                <div className={`mt-6 p-4 rounded-xl text-center ${currentSelection.map(i => exercise.options[i].optionText).join(' ') === exercise.correctAnswer
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                  } ${animateSuccess ? 'animate-pop' : ''} ${animateError ? 'animate-shake' : ''}`}>
                  {currentSelection.map(i => exercise.options[i].optionText).join(' ') === exercise.correctAnswer ? (
                    <div className="text-xl font-bold">✅ Правильно!</div>
                  ) : (
                    <div>
                      <div className="font-bold">❌ Неправильно</div>
                      <div className="text-sm mt-1">Правильный ответ: {exercise.correctAnswer}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }

        // --- DEFAULT (MULTIPLE CHOICE) ---
        return (
          <div>
            <div className="mb-4">
              <span className="text-sm font-bold text-gray-600">
                Упражнение {section.exerciseIndex + 1} из {lessonData.exercises.length}
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {exercise.questionText}
            </h3>

            <div className="space-y-3">
              {exercise.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all ${selectedAnswer === index
                    ? showResult
                      ? option.isCorrect
                        ? 'bg-green-200 border-2 border-green-500'
                        : 'bg-red-200 border-2 border-red-500'
                      : 'bg-pink-200 border-2 border-pink-400'
                    : 'bg-gray-100 hover:bg-gray-200 border-2 border-gray-300'
                    } ${selectedAnswer === index && animateError ? 'animate-shake' : ''}`}
                >
                  {option.optionText}
                </button>
              ))}
            </div>

            {!showResult && selectedAnswer !== null && (
              <button
                onClick={handleCheckAnswer}
                className="w-full mt-6 bg-pink-300 hover:bg-pink-400 text-white font-bold py-4 px-8 rounded-2xl transition shadow-[0_4px_0_0_#C54554]"
              >
                ПРОВЕРИТЬ
              </button>
            )}

            {showResult && (
              <div className={`mt-6 p-4 rounded-xl text-center ${exercise.options[selectedAnswer].isCorrect
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
                } ${animateSuccess ? 'animate-pop' : ''}`}>
                {exercise.options[selectedAnswer].isCorrect ? (
                  <span className="text-xl">✅ Правильно!</span>
                ) : (
                  <span className="text-xl">❌ Неправильно. Правильный ответ: {exercise.correctAnswer}</span>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Loading state
  if (loadingLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFECF' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-400 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Загрузка урока...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !lessonData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFECF' }}>
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-gray-700 font-medium mb-4">{error}</p>
          <Link to="/lesson" className="text-pink-400 hover:underline">
            Вернуться к урокам
          </Link>
        </div>
      </div>
    );
  }

  // No lesson found
  if (!lessonData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFECF' }}>
        <div className="text-center">
          <p className="text-gray-700 font-medium mb-4">Урок не найден</p>
          <Link to="/lesson" className="text-pink-400 hover:underline">
            Вернуться к урокам
          </Link>
        </div>
      </div>
    );
  }

  const currentSectionIndex = sections.findIndex(s => s.id === currentSection);
  const isLastSection = currentSectionIndex === sections.length - 1;
  const currentSectionData = sections[currentSectionIndex];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFECF' }}>
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center">
        <Link to="/">
          <img
            src="/fav.png"
            className="h-18 cursor-pointer hover:opacity-80 transition"
            alt="Balapan Logo"
          />
        </Link>
        <div className="flex items-center gap-4">
          {/* Lives Display */}
          <div className="flex items-center gap-1 bg-white px-4 py-2 rounded-full shadow-sm">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="text-2xl">
                {i < lives ? '❤️' : '🖤'}
              </span>
            ))}
          </div>
          <Link to="/lesson" className="text-base font-bold text-gray-700 hover:text-gray-900">
            Уроки
          </Link>
          <Link to="/profile">
            <img
              src="/ava.jpg"
              className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-pink-400"
              alt="Avatar"
            />
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Lesson Header */}
            <div className="mb-6">
              <button
                className="px-6 py-2 rounded-full font-bold text-sm border-2 transition"
                style={{
                  backgroundColor: '#FFFECF',
                  borderColor: '#000000',
                  color: '#000000'
                }}
              >
                {lessonData.title}
              </button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              {/* Error message if any */}
              {error && (
                <div className="bg-red-100 border-2 border-red-400 text-red-700 rounded-2xl p-4 mb-6">
                  <p className="font-bold">❌ Ошибка:</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Game Over Modal */}
              {gameOver && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center animate-pop">
                    <div className="text-6xl mb-4">💔</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Жизни закончились!</h2>
                    <p className="text-gray-600 mb-4">Урок начнется заново...</p>
                    <div className="flex gap-2 justify-center">
                      <span className="text-3xl">🖤</span>
                      <span className="text-3xl">🖤</span>
                      <span className="text-3xl">🖤</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Render current section content */}
              {!completed && renderContent()}

              {/* Navigation button */}
              {!completed && currentSectionData?.type !== 'exercise' && (
                <button
                  onClick={handleNextSection}
                  disabled={loading}
                  className="w-full mt-6 bg-pink-300 hover:bg-pink-400 text-white font-bold py-4 px-8 rounded-2xl transition shadow-[0_4px_0_0_#C54554] disabled:opacity-50"
                >
                  {isLastSection ? (loading ? '⏳ ЗАВЕРШЕНИЕ...' : 'ЗАВЕРШИТЬ УРОК') : 'ДАЛЕЕ →'}
                </button>
              )}

              {/* Completion message */}
              {completed && (
                <div className="bg-green-100 border-2 border-green-400 rounded-2xl p-6 text-center">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Урок завершен!
                  </h3>
                  <p className="text-sm text-gray-600">
                    +{lessonData.xpReward} XP добавлено
                  </p>
                  {lessonData.exercises && lessonData.exercises.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      Правильных ответов: {correctAnswers} из {lessonData.exercises.length}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Перенаправление к урокам...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80">
            <div className="rounded-2xl p-0 mb-6 relative" style={{ backgroundColor: '#FFDAEC' }}>
              <div className="flex justify-center">
                <img
                  src="/mal.png"
                  className="w-30 h-30 object-contain"
                  alt="Chick"
                />
              </div>
            </div>

            <div className="rounded-2xl p-6 space-y-3" style={{ backgroundColor: '#FFDAEC' }}>
              <h3 className="text-base font-bold text-gray-900 mb-4">Секции урока:</h3>
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => {
                    if (index <= currentSectionIndex || currentSectionData?.type !== 'exercise') {
                      setCurrentSection(section.id);
                      if (section.type === 'exercise') {
                        setCurrentExerciseIndex(section.exerciseIndex);
                        setSelectedAnswer(null);
                        setShowResult(false);
                      }
                    }
                  }}
                  disabled={index > currentSectionIndex && currentSectionData?.type === 'exercise'}
                  className={`block w-full text-left px-4 py-3 rounded-lg font-bold text-sm border-b-2 border-black transition ${section.id === currentSection
                    ? 'bg-pink-300'
                    : index > currentSectionIndex && currentSectionData?.type === 'exercise'
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-opacity-80'
                    }`}
                  style={{ backgroundColor: section.id === currentSection ? '#FF8EC4' : '#FFDAEC' }}
                >
                  {section.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}