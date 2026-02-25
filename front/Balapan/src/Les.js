import { useNavigate } from 'react-router-dom';
import { Headphones, Star } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import apiService from './services/api';
import { useApp } from './context/AppContext';
import { translations } from './translations';



export default function LessonExercise() {
  const navigate = useNavigate();
  const { interfaceLang } = useApp();
  const [lessonData, setLessonData] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [loadingLesson, setLoadingLesson] = useState(true);
  const [lives, setLives] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [isCorrectResult, setIsCorrectResult] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Matching State
  const [matchLeft, setMatchLeft] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]); // Array of IDs or strings

  // Story State
  const [currentStoryLine, setCurrentStoryLine] = useState(0);

  const successSound = useRef(new Audio('https://d35aaqx5ub95lt.cloudfront.net/sounds/7decff4876b55365e64a1329bf0b98eb.mp3'));
  const errorSound = useRef(new Audio('https://d35aaqx5ub95lt.cloudfront.net/sounds/f0b694389146f2fc71a4f783186ee1be.mp3'));

  useEffect(() => {
    loadLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadLesson = async () => {
    const courseId = localStorage.getItem('selectedCourseId');
    const lessonId = localStorage.getItem('currentLessonId');
    if (!courseId || !lessonId) { navigate('/lesson'); return; }

    try {
      const result = await apiService.getCourseById(courseId);
      if (result.success && result.course.levels) {
        let found = null;
        for (const level of result.course.levels) {
          found = (level.lessons || []).find(l => l.id === parseInt(lessonId));
          if (found) break;
        }
        if (found) {
          setLessonData(found);
        }
      }
    } catch (e) { console.error(e); } finally { setLoadingLesson(false); }
  };

  const processedExercises = useMemo(() => {
    if (!lessonData || !lessonData.exercises) return [];
    return lessonData.exercises.map(ex => {
      try {
        let data = ex.contentJson ? JSON.parse(ex.contentJson) : {};
        const trans = data.translations && data.translations[interfaceLang] ? data.translations[interfaceLang] : (data.translations?.ru || data.translations?.en);
        if (trans) {
          data = { ...data, ...trans };
        }

        // Prioritize direct database fields from Admin Panel
        const technicalTs = ['WORD_MATCH', 'TRANSLATE_SENTENCE', 'WORD_TRANSLATE', 'LISTEN_BUILD', 'LISTEN_CHOOSE', 'LISTEN_SIMILAR', 'REPEAT_PHRASE', 'MATCHING', 'TRANSLATION', 'BUILD_SENTENCE', 'CHOOSE_SENTENCE', 'LISTENING'];

        if (ex.questionText && ex.questionText !== "" && !technicalTs.includes(ex.questionText)) {
          data.question = ex.questionText;
        }

        if (ex.correctAnswer && ex.correctAnswer !== "") {
          data.answer = ex.correctAnswer;
          data.target = ex.correctAnswer;
        }
        if (ex.mappings && ex.mappings !== "{}" && ex.mappings !== "") {
          try {
            data.pairs = JSON.parse(ex.mappings);
          } catch (e) { }
        }
        if (ex.options && ex.options.length > 0) {
          const optTexts = ex.options.map(o => o.optionText);
          if (ex.exerciseType === 'TRANSLATE_SENTENCE' || ex.exerciseType === 'LISTEN_BUILD') {
            data.words = optTexts;
          } else {
            data.options = optTexts;
            const correctOpt = ex.options.find(o => o.isCorrect);
            if (correctOpt) {
              data.answer = correctOpt.optionText;
              data.target = correctOpt.optionText;
            }
          }
        }

        // If it's a sentence builder but we don't have words array, generate it from target
        if ((ex.exerciseType === 'TRANSLATE_SENTENCE' || ex.exerciseType === 'LISTEN_BUILD') && (!data.words || data.words.length === 0) && data.target) {
          data.words = data.target.split(' ').sort(() => Math.random() - 0.5);
        }

        // Shuffle options if they exist
        if (data.options && Array.isArray(data.options)) {
          data.options = [...data.options].sort(() => Math.random() - 0.5);
        }

        // Shuffle words for sentence builders if they exist
        if (data.words && Array.isArray(data.words)) {
          data.words = [...data.words].sort(() => Math.random() - 0.5);
        }

        return { ...ex, data };
      } catch (e) { return { ...ex, data: {} }; }
    });
  }, [lessonData, interfaceLang]);

  const ex = processedExercises && processedExercises.length > 0
    ? processedExercises[currentExerciseIndex]
    : null;

  const speak = (text) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Better language detection: if it contains Cyrillic/Kazakh specific letters, it's kk or ru
    // Kazakh specific: Ә, Ғ, Қ, Ң, Ө, Ұ, Ү, Һ, І
    const isKazakhOrRussian = /[а-яА-ЯёЁӘғҚңӨұҮһіІ]/.test(text);
    if (isKazakhOrRussian) {
      // If we are studying Kazakh course, use kk-KZ
      utterance.lang = 'kk-KZ';
    } else {
      utterance.lang = 'en-US';
    }
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleCheckAnswer = () => {
    if (!ex) return;
    let isCorrect = false;

    if (ex.exerciseType === 'STORY' || ex.exerciseType === 'VIDEO') {
      isCorrect = selectedAnswer === ex.data.answer;
    } else {
      switch (ex.exerciseType) {
        case 'WORD_TRANSLATE':
        case 'LISTEN_SIMILAR':
        case 'LISTEN_CHOOSE':
          isCorrect = selectedAnswer === ex.data.answer;
          break;
        case 'TRANSLATE_SENTENCE':
        case 'LISTEN_BUILD':
          const userJoined = (selectedAnswer || []).join(' ').toLowerCase().replace(/[.,!?;]/g, '').trim();
          const target = ex.data.target.toLowerCase().replace(/[.,!?;]/g, '').trim();
          isCorrect = userJoined === target;
          break;
        case 'WORD_MATCH':
          isCorrect = matchedPairs.length === Object.keys(ex.data.pairs).length * 2;
          break;
        case 'REPEAT_PHRASE':
          isCorrect = selectedAnswer === ex.data.text;
          break;
        default: isCorrect = false;
      }
    }

    setIsCorrectResult(isCorrect);
    setShowResult(true);
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      successSound.current.play().catch(() => { });
    } else {
      setLives(prev => prev - 1);
      errorSound.current.play().catch(() => { });
      if (lives <= 1) setGameOver(true);
    }
  };

  const handleNext = () => {
    if (currentExerciseIndex < lessonData.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrectResult(false);
      setCurrentStoryLine(0);
      setMatchedPairs([]);
      setMatchLeft(null);
    } else {
      handleCompleteLesson();
    }
  };

  const handleCompleteLesson = async () => {
    const xpReward = lessonData.xpReward || 20;
    try {
      await apiService.completeLesson(lessonData.id, correctAnswers, lessonData.exercises.length, xpReward);
      setCompleted(true);
    } catch (err) {
      console.error("Error completing lesson:", err);
    } finally {
      // Logic for ending completion could go here if needed
    }
  };

  // Memoized shuffles for matching to prevent re-shuffle on every render
  const shuffleMatch = useMemo(() => {
    if (!ex || (ex.exerciseType !== 'WORD_MATCH' && ex.exerciseType !== 'MATCHING')) return { left: [], right: [] };

    const pairs = ex.data.pairs || {};
    const left = Object.keys(pairs).sort(() => Math.random() - 0.5);
    const right = Object.values(pairs).sort(() => Math.random() - 0.5);
    return { left, right };
  }, [ex]);

  if (loadingLesson) return <div className="min-h-screen bg-white flex items-center justify-center font-black">ЗАГРУЗКА...</div>;
  if (!lessonData) return <div className="min-h-screen bg-white flex items-center justify-center font-black text-red-500">УРОК НЕ НАЙДЕН</div>;

  // ex is already defined above at line 74 using processedExercises

  if (!ex && !completed) return <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center">
    <div className="text-6xl mb-6">🏗️</div>
    <h2 className="text-2xl font-black text-gray-800 mb-4 tracking-tight">ЭТОТ УРОК ПОКА ПУСТ</h2>
    <p className="text-gray-500 font-bold mb-8">Мы еще работаем над наполнением этого раздела. Попробуйте другой урок!</p>
    <button onClick={() => navigate('/lesson')} className="px-10 py-4 bg-blue-500 text-white font-black rounded-2xl shadow-[0_4px_0_0_#1d4ed8]">
      ВЕРНУТЬСЯ
    </button>
  </div>;

  const progress = lessonData.exercises.length > 0
    ? ((currentExerciseIndex + (showResult ? 1 : 0)) / lessonData.exercises.length) * 100
    : 100;

  // --- RENDERS ---

  const renderWordMatch = () => {
    const data = ex.data;
    const handleMatch = (side, item) => {
      if (showResult || matchedPairs.includes(item)) return;
      if (side === 'left') {
        setMatchLeft(item);
        speak(item);
      } else {
        if (!matchLeft) return;
        if (data.pairs[matchLeft] === item) {
          setMatchedPairs([...matchedPairs, matchLeft, item]);
          setMatchLeft(null);
          successSound.current.play().catch(() => { });
          if (matchedPairs.length + 2 === Object.keys(data.pairs).length * 2) {
            setIsCorrectResult(true);
            setShowResult(true);
            setCorrectAnswers(prev => prev + 1);
          }
        } else {
          errorSound.current.play().catch(() => { });
          setMatchLeft(null);
          setLives(prev => prev - 1);
          if (lives <= 1) setGameOver(true);
        }
      }
    };

    return (
      <div className="w-full max-w-2xl px-4 animate-pop">
        <h2 className="text-2xl font-black mb-8 text-gray-800 text-center">{data.title || 'Найдите пары'}</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            {shuffleMatch.left.map(item => (
              <button
                key={item}
                onClick={() => handleMatch('left', item)}
                className={`w-full p-5 rounded-2xl font-bold border-2 transition shadow-[0_4px_0_0_#e5e5e5]
                    ${matchedPairs.includes(item) ? 'bg-gray-100 border-gray-100 text-gray-300 shadow-none' : (matchLeft === item ? 'bg-blue-100 border-blue-400 text-blue-600' : 'bg-white border-gray-200')}
                   `}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {shuffleMatch.right.map(item => (
              <button
                key={item}
                onClick={() => handleMatch('right', item)}
                className={`w-full p-5 rounded-2xl font-bold border-2 transition shadow-[0_4px_0_0_#e5e5e5]
                     ${matchedPairs.includes(item) ? 'bg-gray-100 border-gray-100 text-gray-300 shadow-none' : 'bg-white border-gray-200'}
                    `}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };


  const renderStory = () => {
    const data = ex.data;
    const lines = data.lines || [];
    const isInteractionTime = currentStoryLine >= lines.length;

    return (
      <div className="w-full max-w-2xl px-4 animate-fade-in">
        <div className="space-y-6 mb-12">
          {lines.slice(0, currentStoryLine + 1).map((line, i) => (
            <div key={i} className={`flex items-start gap-4 animate-pop ${i === currentStoryLine ? 'opacity-100 scale-100' : 'opacity-60 scale-95'}`}>
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center font-black text-pink-400 border-2 border-pink-200 shadow-sm">
                {line.char[0]}
              </div>
              <div className="bg-white border-2 border-gray-100 p-5 rounded-2xl shadow-sm relative cursor-pointer hover:bg-gray-50 transition" onClick={() => speak(line.text)}>
                <div className="absolute left-[-8px] top-4 w-4 h-4 bg-white border-l-2 border-b-2 border-gray-100 rotate-45"></div>
                <p className="font-black text-gray-400 text-[10px] mb-1 uppercase tracking-widest">{line.char}</p>
                <p className="text-xl font-bold text-gray-800 leading-snug">{line.text}</p>
              </div>
            </div>
          ))}
        </div>

        {!isInteractionTime ? (
          <button
            onClick={() => {
              const nextLine = lines[currentStoryLine + 1];
              if (nextLine) speak(nextLine.text);
              setCurrentStoryLine(prev => prev + 1);
            }}
            className="w-full py-5 bg-blue-500 text-white font-black rounded-2xl shadow-[0_4px_0_0_#1d4ed8] hover:brightness-110 active:translate-y-1 active:shadow-none transition"
          >
            ДАЛЕЕ
          </button>
        ) : (
          <div className="animate-pop bg-blue-50 p-8 rounded-3xl border-2 border-blue-100 shadow-sm">
            <h3 className="text-2xl font-black text-blue-800 mb-6">{data.question}</h3>
            <div className="grid grid-cols-1 gap-3">
              {data.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => !showResult && setSelectedAnswer(opt)}
                  className={`p-5 rounded-2xl font-bold text-left transition border-2 shadow-sm ${selectedAnswer === opt ? 'bg-white border-blue-400 text-blue-600' : 'bg-white border-gray-100 text-gray-700 hover:border-blue-200'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderVideo = () => {
    const data = ex.data;
    return (
      <div className="w-full max-w-3xl flex flex-col items-center animate-fade-in">
        <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl mb-10 border-4 border-gray-800">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${data.youtubeId}?autoplay=0&rel=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="w-full bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-duo-light">
          <h3 className="text-2xl font-black mb-6 text-gray-800">{data.question}</h3>
          <div className="grid grid-cols-1 gap-3">
            {data.options.map(opt => (
              <button key={opt} onClick={() => !showResult && setSelectedAnswer(opt)} className={`p-5 rounded-2xl border-2 font-bold text-left transition ${selectedAnswer === opt ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-600 hover:bg-gray-50'}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderNormalExercise = () => {
    const data = ex.data;

    switch (ex.exerciseType) {
      case 'WORD_TRANSLATE':
        const wordQuestion = typeof data.question === 'object' ? data.question[interfaceLang] : data.question;
        return (
          <div className="w-full max-w-xl animate-pop">
            <h2 className="text-3xl font-black mb-12 text-gray-800 text-center">
              {interfaceLang === 'en' ? `How do you say "${wordQuestion}"?` :
                interfaceLang === 'kk' ? `"${wordQuestion}" қалай аударылады?` :
                  `Как переводится "${wordQuestion}"?`}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => { if (!showResult) setSelectedAnswer(opt); speak(opt); }}
                  className={`p-6 rounded-2xl font-black text-xl transition border-2 shadow-[0_4px_0_0_#e5e5e5] active:translate-y-1 active:shadow-none ${selectedAnswer === opt ? 'bg-blue-100 border-blue-400 text-blue-600 shadow-[0_4px_0_0_#93c5fd]' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      case 'TRANSLATE_SENTENCE':
      case 'LISTEN_BUILD':
        const isListen = ex.exerciseType === 'LISTEN_BUILD';
        const displayQuestion = typeof data.question === 'object' ? data.question[interfaceLang] : data.question;

        return (
          <div className="w-full max-w-2xl animate-pop">
            <h2 className="text-3xl font-black mb-12 text-gray-800 text-center">
              {isListen ? (interfaceLang === 'en' ? 'Listen and assemble' : interfaceLang === 'kk' ? 'Тыңдап, жинаңыз' : 'Слушайте и соберите') :
                (interfaceLang === 'en' ? 'Translate this sentence' : interfaceLang === 'kk' ? 'Сөйлемді аударыңыз' : 'Переведите предложение')}
            </h2>
            <div className="flex items-center gap-8 mb-12">
              <div className="relative bg-white border-4 border-pink-200 rounded-3xl p-8 shadow-sm flex-1 flex items-center gap-6">
                <div className="absolute left-[-12px] bottom-10 w-6 h-6 bg-white border-l-4 border-b-4 border-pink-200 rotate-45 rounded-bl-md"></div>
                {isListen && (
                  <button
                    onClick={() => speak(data.target)}
                    className="p-5 bg-pink-400 text-white rounded-2xl shadow-[0_4px_0_0_#FF8EC4] hover:brightness-110 active:translate-y-1 active:shadow-none transition transform hover:scale-105"
                  >
                    <Headphones size={36} />
                  </button>
                )}
                {!isListen && <p className="text-2xl font-black text-gray-700 leading-tight">{displayQuestion}</p>}
                {isListen && <p className="text-lg font-bold text-pink-300 italic uppercase tracking-wider">{interfaceLang === 'en' ? 'Tap to listen' : interfaceLang === 'kk' ? 'Тыңдау үшін басыңыз' : 'Нажмите чтобы послушать'}</p>}
              </div>
            </div>
            <div className="min-h-[70px] border-b-2 border-gray-200 mb-10 flex flex-wrap gap-2 p-2 bg-gray-50/50 rounded-t-xl">
              {(Array.isArray(selectedAnswer) ? selectedAnswer : []).map((w, idx) => (
                <button key={idx} onClick={() => !showResult && setSelectedAnswer(prev => Array.isArray(prev) ? prev.filter((_, i) => i !== idx) : [])} className="bg-white border-2 border-gray-200 rounded-xl px-4 py-2 font-bold shadow-sm animate-pop">
                  {w}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {(data.words || []).map((w, idx) => (
                <button
                  key={idx}
                  disabled={showResult || (Array.isArray(selectedAnswer) && selectedAnswer.includes(w))}
                  onClick={() => { setSelectedAnswer(prev => [...(Array.isArray(prev) ? prev : []), w]); speak(w); }}
                  className={`px-5 py-3 rounded-xl font-bold border-2 transition shadow-[0_4px_0_0_#e5e5e5] ${(Array.isArray(selectedAnswer) && selectedAnswer.includes(w)) ? 'bg-gray-100 text-transparent border-gray-100 shadow-none' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'}`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        );
      case 'WORD_MATCH': return renderWordMatch();
      case 'LISTEN_CHOOSE':
      case 'LISTEN_SIMILAR':
        return (
          <div className="w-full max-w-xl flex flex-col items-center animate-pop">
            <h2 className="text-3xl font-black mb-12 text-gray-800 text-center">
              {interfaceLang === 'en' ? 'What do you hear?' : interfaceLang === 'kk' ? 'Не естідіңіз?' : (data.question || 'Что вы слышите?')}
            </h2>
            <button
              onClick={() => speak(data.answer)}
              className="w-32 h-32 bg-blue-500 rounded-3xl flex items-center justify-center shadow-[0_8px_0_0_#1d4ed8] hover:brightness-110 active:scale-95 transition mb-12 text-white"
            >
              <Headphones size={48} strokeWidth={3} />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {data.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => { if (!showResult) setSelectedAnswer(opt); speak(opt); }}
                  className={`p-6 rounded-2xl font-black text-xl transition border-2 shadow-[0_4px_0_0_#e5e5e5] active:translate-y-1 active:shadow-none
                      ${selectedAnswer === opt ? 'bg-blue-100 border-blue-400 text-blue-600 shadow-[0_4px_0_0_#93c5fd]' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}
                    `}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      case 'REPEAT_PHRASE':
        return (
          <div className="w-full max-w-xl flex flex-col items-center animate-pop">
            <h2 className="text-3xl font-black mb-12 text-gray-800 text-center">
              {interfaceLang === 'en' ? 'Repeat the phrase' : interfaceLang === 'kk' ? 'Фразаны қайталаңыз' : 'Повторите фразу'}
            </h2>
            <div className="flex items-center gap-6 mb-12">
              <button
                onClick={() => speak(data.text)}
                className="p-4 bg-blue-500 text-white rounded-2xl shadow-[0_4px_0_0_#1d4ed8]"
              >
                <Headphones size={32} />
              </button>
              <p className="text-3xl font-black text-gray-800 border-b-4 border-dotted border-gray-300 pb-2">{data.text}</p>
            </div>

            <div className="relative group">
              <button
                onClick={() => {
                  setSelectedAnswer('recording...');
                  setTimeout(() => setSelectedAnswer(data.text), 2000);
                }}
                className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300
                  ${selectedAnswer === 'recording...' ? 'bg-red-500 animate-pulse' : 'bg-pink-400 hover:scale-110'}
                  text-white shadow-xl
                `}
              >
                {selectedAnswer === 'recording...' ? <Star size={64} fill="white" className="animate-spin" /> : <Star size={64} fill="white" />}
              </button>
              {selectedAnswer === 'recording...' && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full font-black text-sm animate-bounce">
                  {interfaceLang === 'en' ? 'RECORDING...' : interfaceLang === 'kk' ? 'ЖАЗЫЛУДА...' : 'ЗАПИСЬ...'}
                </div>
              )}
            </div>
            <p className="mt-10 text-gray-400 font-bold uppercase tracking-widest italic">
              {selectedAnswer === 'recording...' ? (interfaceLang === 'en' ? 'Speaking...' : interfaceLang === 'kk' ? 'Сөйлеңіз...' : 'Говорите...') :
                (selectedAnswer ? (interfaceLang === 'en' ? 'Analyzed!' : interfaceLang === 'kk' ? 'Талданды!' : 'Проанализировано!') :
                  (interfaceLang === 'en' ? 'Tap the star and repeat' : interfaceLang === 'kk' ? 'Жұлдызшаны басып қайталаңыз' : 'Нажмите на звезду и повторите'))}
            </p>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFECF]">
      {/* ProgressBar Top */}
      <header className="max-w-5xl w-full mx-auto px-6 py-6 md:py-10 flex items-center gap-6">
        <button onClick={() => navigate('/lesson')} className="text-gray-400 hover:text-pink-400 transition transform hover:scale-110 active:scale-95">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="flex-1 h-5 bg-white rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border-2 border-white">
          <div
            className="h-full bg-[#58CC02] transition-all duration-700 rounded-full shadow-[inset_0_-4px_0_0_rgba(0,0,0,0.15)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border-2 border-pink-100">
          <span className="text-pink-400 text-xl">❤️</span>
          <span className="text-pink-400 text-xl font-black">{lives}</span>
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 pb-40">
        {completed ? (
          <div className="text-center max-w-sm animate-pop">
            <div className="text-[140px] mb-8 filter drop-shadow-xl">🏆</div>
            <h1 className="text-5xl font-black text-gray-800 mb-4 tracking-tighter uppercase">ОТЛИЧНО!</h1>
            <p className="text-gray-500 font-bold text-xl mb-10 leading-relaxed">Вы завершили этот урок и стали на шаг ближе к цели.</p>

            <div className="flex gap-4 justify-center">
              <div className="py-6 px-10 bg-white border-4 border-yellow-300 rounded-[2.5rem] shadow-lg animate-bounce duration-2000">
                <p className="text-yellow-500 font-black text-4xl">+{lessonData.xpReward || 20} XP</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Опыт</p>
              </div>

              <div className="py-6 px-10 bg-white border-4 border-blue-300 rounded-[2.5rem] shadow-lg animate-bounce duration-2000" style={{ animationDelay: '0.2s' }}>
                <p className="text-blue-500 font-black text-4xl">
                  +{correctAnswers === lessonData.exercises.length ? 5 : 2} 💎
                </p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Алмазы</p>
              </div>
            </div>
          </div>
        ) : (
          ex.exerciseType === 'STORY' ? renderStory() : (ex.exerciseType === 'VIDEO' ? renderVideo() : renderNormalExercise())
        )}
      </main>

      {/* Footer Check Bar */}
      {!completed && (
        <footer className={`fixed bottom-0 left-0 right-0 p-8 md:p-12 border-t-4 transition-all duration-300 z-50
          ${showResult
            ? (isCorrectResult ? 'bg-[#D7FFB7] border-[#D7FFB7] translate-y-0' : 'bg-[#FFDADC] border-[#FFDADC] translate-y-0')
            : 'bg-white border-gray-100'}
        `}>
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="hidden md:flex flex-col flex-1">
              {showResult && (
                <div className="animate-pop pl-4">
                  <h3 className={`text-3xl font-black mb-1 ${isCorrectResult ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrectResult ? 'ПРАВИЛЬНО!' : 'ОШИБКА!'}
                  </h3>
                  {!isCorrectResult && (
                    <p className="text-red-600 font-bold text-xl">Правильный ответ: {ex.data.answer || ex.data.target}</p>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={showResult ? handleNext : handleCheckAnswer}
              disabled={(!selectedAnswer && ex.exerciseType !== 'WORD_MATCH' && ex.exerciseType !== 'STORY') || (ex.exerciseType === 'STORY' && currentStoryLine < (ex.data.lines?.length || 0) && !showResult)}
              className={`
                px-16 py-5 rounded-2xl font-black text-xl uppercase tracking-widest transition-all duration-200
                ${!showResult
                  ? (!selectedAnswer && ex.exerciseType !== 'WORD_MATCH' && ex.exerciseType !== 'STORY'
                    ? 'bg-[#E5E5E5] text-[#AFAFAF] shadow-none'
                    : 'bg-[#58CC02] text-white shadow-[0_6px_0_0_#46A302] hover:brightness-110 active:translate-y-1 active:shadow-none')
                  : (isCorrectResult
                    ? 'bg-[#58CC02] text-white shadow-[0_6px_0_0_#46A302] hover:brightness-110'
                    : 'bg-[#FF4B4B] text-white shadow-[0_6px_0_0_#EA2B2B] hover:brightness-110')
                }
              `}
            >
              {showResult ? 'ДАЛЬШЕ' : 'ПРОВЕРИТЬ'}
            </button>
          </div>
        </footer>
      )}

      {/* Game Over Modal */}
      {gameOver && (
        <div className="fixed inset-0 bg-white/98 flex flex-col items-center justify-center z-[100] p-10 text-center animate-fade-in">
          <div className="text-[150px] mb-10">💔</div>
          <h1 className="text-6xl font-black text-gray-800 mb-6 tracking-tighter uppercase">Закончились жизни</h1>
          <p className="text-2xl text-gray-500 font-bold mb-14 max-w-xl">Не сдавайтесь! Ошибки — это путь к знаниям. Попробуйте снова чуть позже.</p>
          <button onClick={() => navigate('/lesson')} className="px-16 py-6 bg-blue-500 text-white font-black rounded-3xl text-3xl shadow-[0_8px_0_0_#1d4ed8] hover:scale-105 active:translate-y-2 active:shadow-none transition">
            ВЕРНУТЬСЯ
          </button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes pop { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-pop { animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
      `}} />
    </div>
  );
}