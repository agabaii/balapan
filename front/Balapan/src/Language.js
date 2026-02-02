// src/Language.jsx
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from './services/api';

export default function Language() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('kazakh');
  const [loading, setLoading] = useState(true);

  // Маппинг для отображения
  const languageMapping = {
    'kk': { id: 'kazakh', name: 'Қазақ тілі', image: '/kt.jpg', bgColor: '#D4F1F4' },
    'ru': { id: 'russian', name: 'Русский язык', image: '/rf.jpg', bgColor: '#FFE0F0' },
    'en': { id: 'english', name: 'English language', image: '/usa.png', bgColor: '#FFE0F0' }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const result = await apiService.getCourses();

    if (result.success && result.courses.length > 0) {
      setCourses(result.courses);
      // Выбираем первый курс по умолчанию
      const firstCourse = result.courses[0];
      const mappedLang = languageMapping[firstCourse.languageCode];
      if (mappedLang) {
        setSelectedLanguage(mappedLang.id);
      }
    }

    setLoading(false);
  };

  const handleContinue = () => {
    // Находим выбранный курс
    const selectedCourse = courses.find(c => {
      const mapped = languageMapping[c.languageCode];
      return mapped && mapped.id === selectedLanguage;
    });

    if (selectedCourse) {
      localStorage.setItem('selectedCourseId', selectedCourse.id);
      navigate('/lesson');
    }
  };

  // Формируем список языков для отображения
  const languages = courses.map(course => {
    const mapped = languageMapping[course.languageCode];
    return mapped ? { ...mapped, courseId: course.id, disabled: false } : null;
  }).filter(Boolean);

  // Добавляем disabled языки если их нет в курсах
  if (!courses.find(c => c.languageCode === 'de')) {
    languages.push({
      id: 'german',
      name: 'German',
      image: '/gm.jpg',
      bgColor: '#D0D0D0',
      disabled: true
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFECF' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-400 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Загрузка курсов...</p>
        </div>
      </div>
    );
  }

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
        <Link to="/">
          <button className="p-3 mr-8 bg-white rounded-full hover:bg-pink-50 transition shadow-md hover:shadow-lg">
            <ArrowLeft size={24} color="#F9ADD1" strokeWidth={2.5} />
          </button>
        </Link>
      </header>

      {/* Content Container */}
      <div className="max-w-2xl mx-auto px-6 pt-8">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-10">
          Языки
        </h1>

        {/* Language Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => !lang.disabled && setSelectedLanguage(lang.id)}
              disabled={lang.disabled}
              className={`relative rounded-2xl p-6 transition-all ${lang.disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-105 cursor-pointer'
                } ${selectedLanguage === lang.id
                  ? 'ring-4 ring-pink-400'
                  : ''
                }`}
              style={{ backgroundColor: lang.bgColor }}
            >
              <div className="flex flex-col items-center">
                <img
                  src={lang.image}
                  alt={lang.name}
                  className="w-16 h-16 object-contain mb-3"
                />
                <p className="text-sm font-medium text-gray-800 text-center">
                  {lang.name}
                </p>
                {lang.disabled && (
                  <span className="absolute top-2 right-2 text-xs text-gray-600 bg-white px-2 py-1 rounded">
                    Скоро
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {languages.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            <p>Курсы не найдены</p>
            <p className="text-sm mt-2">Убедитесь что бэкенд запущен</p>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={languages.length === 0}
          className="block w-full max-w-md mx-auto bg-pink-300 hover:bg-pink-400 text-white font-bold py-4 px-8 rounded-2xl transition shadow-[0_4px_0_0_#C54554] text-center disabled:opacity-50"
        >
          ПРОДОЛЖИТЬ
        </button>
      </div>
    </div>
  );
}