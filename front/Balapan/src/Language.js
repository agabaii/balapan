// src/Language.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from './services/api';
import { useApp } from './context/AppContext';
import TopBar from './TopBar';

export default function Language() {
  const navigate = useNavigate();
  const { addCourse, activeCourses } = useApp();
  const [courses, setCourses] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [loading, setLoading] = useState(true);

  const languageMapping = {
    'kk': { id: 'kazakh', name: 'Қазақ тілі', flag: '/kt.jpg', bgColor: '#FFFFFF', borderColor: '#E5E5E5' },
    'ru': { id: 'russian', name: 'Русский язык', flag: '/rf.jpg', bgColor: '#FFFFFF', borderColor: '#E5E5E5' },
    'en': { id: 'english', name: 'English language', flag: '/usa.png', bgColor: '#FFFFFF', borderColor: '#E5E5E5' }
  };

  useEffect(() => {
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCourses = async () => {
    try {
      const result = await apiService.getCourses();
      if (result.success && result.courses.length > 0) {
        setCourses(result.courses);
        setSelectedLanguage(result.courses[0].languageCode);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    const selectedCourse = courses.find(c => c.languageCode === selectedLanguage);
    if (!selectedCourse) return;

    const isActive = activeCourses.some(c => String(c.id) === String(selectedCourse.id));

    // If user is already studying it, just switch and go back
    if (isActive) {
      addCourse({
        id: selectedCourse.id,
        languageCode: selectedCourse.languageCode,
        title: selectedCourse.title || selectedCourse.languageCode,
      });
      navigate('/lesson');
      return;
    }

    // Otherwise add new
    addCourse({
      id: selectedCourse.id,
      languageCode: selectedCourse.languageCode,
      title: selectedCourse.title || selectedCourse.languageCode,
    });
    navigate('/lesson');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFECF]">
      <div className="animate-bounce text-6xl">🐣</div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FFFECF' }}>
      <TopBar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col items-center">
        <h1 className="text-4xl font-black text-gray-800 mb-4 uppercase tracking-tighter">Какой язык выберем?</h1>
        <p className="text-gray-500 font-bold mb-12 text-lg">Выбери курс, чтобы начать обучение прямо сейчас</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full mb-16">
          {courses.map((course) => {
            const lang = languageMapping[course.languageCode] || { name: course.languageCode, flag: '📚' };
            const isActive = activeCourses.some(c => String(c.id) === String(course.id));
            const isSelected = selectedLanguage === course.languageCode;

            return (
              <button
                key={course.id}
                onClick={() => setSelectedLanguage(course.languageCode)}
                className={`
                  group relative p-8 rounded-[2.5rem] border-4 transition-all duration-300 transform active:scale-95
                  ${isSelected
                    ? 'bg-white border-blue-400 shadow-[0_8px_0_0_#93c5fd] -translate-y-1'
                    : 'bg-white border-gray-100 hover:border-gray-200 shadow-[0_4px_0_0_#f3f4f6]'}
                `}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 overflow-hidden rounded-2xl group-hover:scale-110 transition duration-300">
                    <img src={lang.flag} alt={lang.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black text-gray-800 uppercase tracking-tight">{lang.name}</p>
                    {isActive && (
                      <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-600 text-[10px] font-black rounded-full uppercase">
                        Уже учу
                      </span>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <div className="absolute top-4 right-4 text-blue-500 bg-blue-50 w-8 h-8 rounded-full flex items-center justify-center font-black animate-pop">
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedLanguage}
          className={`
            w-full max-w-sm py-6 rounded-3xl font-black text-2xl uppercase tracking-widest transition-all duration-300
            shadow-[0_8px_0_0_rgba(0,0,0,0.1)] active:translate-y-2 active:shadow-none
            ${selectedLanguage
              ? 'bg-pink-400 text-white hover:brightness-110 shadow-[0_8px_0_0_#C54554]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}
          `}
        >
          ВПЕРЕД!
        </button>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes pop { 0% { transform: scale(0); } 100% { transform: scale(1); } }
        .animate-pop { animation: pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}} />
    </div>
  );
}
