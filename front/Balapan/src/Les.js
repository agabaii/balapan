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
  const [isCorrectResult, setIsCorrectResult] = useState(false);
  const [characterImg, setCharacterImg] = useState('https://d33wubrfki0l68.cloudfront.net/6656201662927237.svg');

  const characterImgs = [
    'https://d35aaqx5ub95lt.cloudfront.net/images/owls/7113149830589632.svg', // Duo
    'https://d35aaqx5ub95lt.cloudfront.net/images/leagues/9e49495_7b0d.svg', // Shield
    'https://d35aaqx5ub95lt.cloudfront.net/images/character-lily.svg',
    'https://d35aaqx5ub95lt.cloudfront.net/images/character-zari.svg',
    'https://d35aaqx5ub95lt.cloudfront.net/images/character-junior.svg'
  ];

  useEffect(() => {
    setCharacterImg(characterImgs[Math.floor(Math.random() * characterImgs.length)]);
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

  const speak = (text) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU'; // Для казахского обычно используется RU или TR голос как замена
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleAnswerSelect = (optionIndex) => {
    if (showResult) return;
    const currentExercise = lessonData.exercises[currentExerciseIndex];
    if (currentExercise && currentExercise.options[optionIndex]) {
      speak(currentExercise.options[optionIndex].optionText);
    }
    setSelectedAnswer(optionIndex);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;

    const currentExercise = lessonData.exercises[currentExerciseIndex];
    let isCorrect = false;

    if (currentExercise.exerciseType === 'write') {
      isCorrect = (selectedAnswer || '').toString().toLowerCase().trim() === (currentExercise.correctAnswer || '').toLowerCase().trim();
    } else if (currentExercise.exerciseType === 'sentence') {
      const userJoined = (Array.isArray(selectedAnswer) ? selectedAnswer : [])
        .map(idx => currentExercise.options[idx]?.optionText || '')
        .join('');

      const cleanUser = userJoined.replace(/\s+/g, '').toLowerCase();
      const cleanCorrect = (currentExercise.correctAnswer || '').replace(/\s+/g, '').toLowerCase();

      isCorrect = cleanUser === cleanCorrect;
    } else if (currentExercise.exerciseType === 'match') {
      // Logic for match is mostly in handleMatchClick, but we'll set isCorrect here just in case
      isCorrect = !!selectedAnswer?.isAllMatched;
    } else {
      const selectedOption = currentExercise.options[selectedAnswer];
      isCorrect = selectedOption ? selectedOption.isCorrect : false;
    }

    setIsCorrectResult(isCorrect);
    setShowResult(true);

    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
      setAnimateSuccess(true);
      if (currentExercise.exerciseType !== 'write') {
        speak(currentExercise.options[selectedAnswer].optionText);
      } else {
        speak(selectedAnswer);
      }
    } else {
      setAnimateError(true);
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives === 0) {
        setGameOver(true);
        return;
      }
    }
    setTimeout(() => { setAnimateError(false); setAnimateSuccess(false); }, 500);
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
        setIsCorrectResult(false);
      }
    } else {
      handleCompleteLesson();
    }
  };

  const renderContent = (characterImg) => {
    if (!lessonData) return null;

    const section = sections.find(s => s.id === currentSection);
    if (!section) return null;

    switch (section.type) {
      case 'theory':
        return (
          <div className="animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <img src={characterImg} className="w-16 h-16 object-contain" alt="Character" />
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
                {lessonData.content.theoryTitle || 'Теория'}
              </h2>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-duo-light">
              <p className="text-xl text-gray-800 whitespace-pre-line leading-relaxed font-medium">
                {lessonData.content.theoryText}
              </p>
            </div>
          </div>
        );

      case 'note':
        const noteStyles = {
          grammar: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: '📝', title: 'Грамматика' },
          examples: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: '💡', title: 'Примеры' },
          tips: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: '💭', title: 'Советы' },
          pronunciation: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-800', icon: '🗣️', title: 'Произношение' }
        };
        const style = noteStyles[section.id] || noteStyles.grammar;

        return (
          <div className="animate-fade-in">
            <div className={`p-8 rounded-3xl border-2 ${style.bg} ${style.border}`}>
              <h3 className={`text-2xl font-black mb-4 flex items-center gap-3 ${style.text}`}>
                <span>{style.icon}</span> {style.title}
              </h3>
              <p className={`text-xl font-medium whitespace-pre-line leading-relaxed ${style.text}`}>
                {section.id === 'grammar' ? lessonData.content.grammarRules :
                  section.id === 'examples' ? lessonData.content.examples :
                    section.id === 'tips' ? lessonData.content.tips :
                      lessonData.content.pronunciationGuide}
              </p>
            </div>
            <div className="mt-8 flex justify-center transform transition hover:scale-110">
              <img src={characterImg} className="w-32 h-32 object-contain" alt="Character" />
            </div>
          </div>
        );

      case 'exercise':
        const exercise = lessonData.exercises[section.exerciseIndex];

        // Duolingo-style Character Speech Bubble
        const renderQuestionHeader = (question, audio) => (
          <div className="flex items-end gap-6 mb-8 mt-4 animate-pop">
            <div className="w-24 h-24 flex-shrink-0">
              <img src={characterImg} className="w-full h-full object-contain" alt="Character" />
            </div>
            <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-duo-light flex-1">
              <div className="absolute left-[-9px] bottom-6 w-4 h-4 bg-white border-l-2 border-b-2 border-gray-200 rotate-45"></div>
              <h3 className="text-xl font-bold text-gray-800 leading-tight">
                {question}
              </h3>
              {audio && (
                <button
                  onClick={() => speak(question)}
                  className="mt-3 text-blue-500 hover:text-blue-600 flex items-center gap-2 font-bold transition transform active:scale-95"
                >
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm tracking-wide">ПРОСЛУШАТЬ</span>
                </button>
              )}
            </div>
          </div>
        );

        // --- MATCHING TYPE ---
        if (exercise.exerciseType === 'match') {
          if (!exercise.pairsParsed) {
            exercise.pairsParsed = exercise.options.map(opt => {
              const parts = opt.optionText.split('=');
              return { id: opt.id, left: parts[0], right: parts[1], original: opt };
            });
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
              // Check if the pair is correct based on original pairs
              const leftText = selectedAnswer.left.text;
              const rightText = item.text;

              const isCorrect = exercise.pairsParsed.some(p =>
                (p.left === leftText && p.right === rightText) ||
                (p.left === rightText && p.right === leftText)
              );

              if (isCorrect) {
                // Find IDs of items that match these texts to mark them as matched
                // We mark the specific ones selected, but could also mark all identical ones? 
                // Let's just mark the ones that were successfully matched.
                // Actually, the current ID system is safer for internal tracking.
                exercise.leftItems.find(i => i.text === leftText && !i.matched).matched = true;
                exercise.rightItems.find(i => i.text === rightText && !i.matched).matched = true;
                setSelectedAnswer(null);
                if (exercise.leftItems.every(i => i.matched)) {
                  setCorrectAnswers(correctAnswers + 1);
                  setAnimateSuccess(true);
                  setIsCorrectResult(true);
                  setShowResult(true);
                  setTimeout(() => { setAnimateSuccess(false); handleNextSection(); }, 2500);
                }
              } else {
                setAnimateError(true);
                const newLives = lives - 1;
                setLives(newLives);
                setTimeout(() => setAnimateError(false), 500);
                if (newLives === 0) {
                  setGameOver(true);
                  setTimeout(() => window.location.reload(), 2000);
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
          const currentSelection = Array.isArray(selectedAnswer) ? selectedAnswer : [];

          const handleWordClick = (word, index) => {
            if (showResult) return;
            speak(word.optionText);
            if (!currentSelection.includes(index)) {
              setSelectedAnswer([...currentSelection, index]);
            }
          };

          const handleRemoveWord = (indexToRemove) => {
            if (showResult) return;
            setSelectedAnswer(currentSelection.filter(i => i !== indexToRemove));
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
            </div>
          );
        }

        // --- WRITE TYPE ---
        if (exercise.exerciseType === 'write') {
          return (
            <div className="w-full">
              {renderQuestionHeader(exercise.questionText)}
              <div className="mb-6">
                <input
                  type="text"
                  autoFocus
                  placeholder="Введите ответ"
                  value={selectedAnswer || ''}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  disabled={showResult}
                  className={`w-full p-6 text-xl font-bold bg-white border-b-4 rounded-2xl transition outline-none
                    ${showResult
                      ? (selectedAnswer?.toLowerCase().trim() === exercise.correctAnswer.toLowerCase().trim()
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-red-500 bg-red-50 text-red-700')
                      : 'border-gray-200 focus:border-blue-400 focus:bg-blue-50'
                    }`}
                />
              </div>
            </div>
          );
        }

        // --- DEFAULT (MULTIPLE CHOICE) ---
        return (
          <div className="w-full">
            {renderQuestionHeader(exercise.questionText)}
            <div className="grid grid-cols-1 gap-3">
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
          </div>
        );

      default:
        return null;
    }
  };

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
  const progress = ((currentSectionIndex + (showResult ? 1 : 0)) / sections.length) * 100;
  const currentSectionData = sections[currentSectionIndex];

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: '#FFFFFF' }}>
      <header className="max-w-5xl w-full mx-auto px-6 py-6 flex items-center gap-4">
        <Link to="/lesson" className="text-gray-400 hover:text-gray-600 transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>
        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-red-500 text-2xl font-bold">❤️</span>
          <span className="text-red-500 text-xl font-bold">{lives}</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full">
          {!completed ? (
            <div className="animate-fade-in">
              {renderContent(characterImg)}
            </div>
          ) : (
            <div className="text-center animate-pop">
              <div className="text-8xl mb-6">🏆</div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">УРОК ЗАВЕРШЕН!</h1>
              <p className="text-xl text-gray-600 mb-8">Вы отлично поработали и заработали опыт.</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-orange-100 p-6 rounded-2xl border-2 border-orange-200">
                  <div className="text-orange-500 font-bold uppercase text-sm mb-1">Очки опыта</div>
                  <div className="text-3xl font-black text-orange-600">+{lessonData.xpReward} XP</div>
                </div>
                <div className="bg-blue-100 p-6 rounded-2xl border-2 border-blue-200">
                  <div className="text-blue-500 font-bold uppercase text-sm mb-1">Точность</div>
                  <div className="text-3xl font-black text-blue-600">
                    {Math.round((correctAnswers / (lessonData.exercises?.length || 1)) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {!completed && (
        <footer className={`py-6 border-t-2 ${showResult
          ? isCorrectResult
            ? 'bg-green-100 border-green-200'
            : 'bg-red-100 border-red-200'
          : 'bg-white border-gray-100'
          }`}>
          <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
            <div className="flex-1">
              {showResult && (
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl font-bold ${isCorrectResult
                    ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                    {isCorrectResult ? '✓' : '✗'}
                  </div>
                  <div>
                    <h4 className={`text-xl font-black ${isCorrectResult
                      ? 'text-green-700' : 'text-red-700'
                      }`}>
                      {isCorrectResult ? 'Правильно!' : 'Не совсем верно'}
                    </h4>
                    {!isCorrectResult && (
                      <p className="text-red-600 font-bold">
                        Правильный ответ: {lessonData.exercises[currentExerciseIndex]?.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={showResult ? handleNextSection : (currentSectionData?.type === 'exercise' ? handleCheckAnswer : handleNextSection)}
              disabled={loading || (currentSectionData?.type === 'exercise' && !showResult &&
                (currentSectionData.exerciseType === 'match'
                  ? true
                  : selectedAnswer === null
                )
              )}
              className={`px-12 py-4 rounded-2xl font-black text-lg transition shadow-duo uppercase tracking-wider
                ${!showResult
                  ? (selectedAnswer !== null || currentSectionData?.type !== 'exercise' || currentSectionData.exerciseType === 'match')
                    ? (currentSectionData.exerciseType === 'match' ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-green-500 text-white hover:bg-green-400')
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  : (isCorrectResult
                    ? 'bg-green-500 text-white hover:bg-green-400'
                    : 'bg-red-500 text-white hover:bg-red-400')
                }`}
            >
              {loading ? '...' : (showResult ? 'Продолжить' : (currentSectionData?.type === 'exercise' ? 'Проверить' : 'Далее'))}
            </button>
          </div>
        </footer>
      )}

      {gameOver && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl animate-pop">
            <div className="text-7xl mb-6">💔</div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Ой-ой!</h2>
            <p className="text-xl text-gray-600 mb-8">У вас закончились жизни. Не сдавайтесь, попробуйте еще раз!</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-500 hover:bg-blue-400 text-white font-black py-4 rounded-2xl transition shadow-duo-blue uppercase"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .shadow-duo { box-shadow: 0 4px 0 0 #22c55e; }
        .shadow-duo:active { box-shadow: none; transform: translateY(4px); }
        .shadow-duo-blue { box-shadow: 0 4px 0 0 #2563eb; }
        .shadow-duo-blue:active { box-shadow: none; transform: translateY(4px); }
        .shadow-duo-light { box-shadow: 0 2px 0 0 #e5e7eb; }
        @keyframes pop { 0% { transform: scale(0.9) translateY(10px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
        .animate-pop { animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .shadow-duo-red { box-shadow: 0 4px 0 0 #ef4444; }
        .shadow-duo-red:active { box-shadow: none; transform: translateY(4px); }
      `}} />
    </div>
  );
}