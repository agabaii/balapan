// src/Profile.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiService from './services/api';
import StreakDisplay from './StreakDisplay';

export default function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [courseProgress, setCourseProgress] = useState(0);

  const birdStages = [
    { 
      name: 'В яйце', 
      image: '/yzo.png',
      description: 'Начало пути',
      minXP: 0
    },
    { 
      name: 'Вылупление', 
      image: '/balapan.png',
      description: 'Птенец вылупляется!',
      minXP: 375
    },
    { 
      name: 'Маленький птенец', 
      image: '/kniga.png',
      description: 'Растет и развивается',
      minXP: 750
    },
    { 
      name: 'Птенец-выпускник', 
      image: '/pusk (2).png',
      description: 'Готов к полету!',
      minXP: 1125
    }
  ];

  useEffect(() => {
    checkAuthAndLoadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthAndLoadProfile = async () => {
    console.log('🔍 Проверка авторизации...');
    
    if (!apiService.isLoggedIn()) {
      console.log('❌ Пользователь не авторизован, редирект на /login');
      navigate('/login');
      return;
    }

    const userId = apiService.getCurrentUserId();
    console.log('✅ Пользователь авторизован, userId:', userId);

    // Загружаем профиль
    const result = await apiService.getUserProfile();
    
    if (result.success) {
      console.log('✅ Профиль загружен:', result.user);
      const currentStage = apiService.calculateBirdStage(result.user.totalXp || 0);
      setUserData({
        ...result.user,
        birdStage: currentStage
      });
      setError(null);
    } else {
      console.error('❌ Ошибка загрузки профиля:', result.message);
      setError(result.message);
    }

    // Загружаем данные о курсе
    const courseId = localStorage.getItem('selectedCourseId');
    if (courseId) {
      const courseResult = await apiService.getCourseById(courseId);
      if (courseResult.success) {
        setCurrentCourse(courseResult.course);
        
        // Считаем прогресс
        const progressResult = await apiService.getUserProgress();
        if (progressResult.success && courseResult.course.levels) {
          const totalLessons = courseResult.course.levels.reduce((sum, level) => 
            sum + (level.lessons?.length || 0), 0
          );
          const completedLessons = progressResult.progress.filter(p => p.isCompleted).length;
          const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
          setCourseProgress(progress);
        }
      }
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFECF' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-400 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFECF' }}>
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-gray-700 font-medium mb-4">Ошибка: {error}</p>
          <button 
            onClick={checkAuthAndLoadProfile}
            className="bg-pink-400 text-white px-6 py-2 rounded-lg hover:bg-pink-500"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFECF' }}>
        <div className="text-center">
          <p className="text-gray-700 font-medium mb-4">Профиль не найден</p>
          <Link to="/login" className="text-pink-400 hover:underline">
            Войти в систему
          </Link>
        </div>
      </div>
    );
  }

  const currentStage = userData.birdStage || 0;
  const currentXP = userData.totalXp || 0;
  const nextStageXP = birdStages[Math.min(currentStage + 1, 3)]?.minXP || 1500;
  const progressPercent = Math.min(
    ((currentXP - birdStages[currentStage].minXP) / 
    (nextStageXP - birdStages[currentStage].minXP)) * 100,
    100
  );

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

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Left Column */}
          <div className="flex-1">
            {/* User Info Card */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <img 
                    src="/ava.jpg" 
                    className="w-20 h-20 rounded-full object-cover"
                    alt="Profile"
                  />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {userData.username}
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                      {userData.nativeLanguage === 'kk' ? 'Қазақ тілі' : 
                       userData.nativeLanguage === 'en' ? 'English' : 'Русский язык'}
                    </p>
                    <Link to="/edit" className="text-sm font-medium mt-2 flex items-center gap-1 hover:underline" style={{ color: '#F9ADD1' }}>
                      <span>✏️</span>
                      <span>Редактировать профиль</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* XP Progress Card */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-bold text-gray-900">
                  {currentXP} / {nextStageXP} XP до следующего уровня
                </span>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${progressPercent}%`,
                    background: 'linear-gradient(to right, #FFDAEC, #FF8EC4)'
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                {currentStage < 3 
                  ? `Еще ${nextStageXP - currentXP} XP и ваш Балапан подрастет!`
                  : 'Ваш Балапан достиг максимального уровня!'}
              </p>
            </div>

            {/* NEW: Streak Display */}
            <StreakDisplay userId={userData.id} />

            {/* Course Progress */}
            {currentCourse && (
              <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Прогресс курса: {currentCourse.name}
                </h3>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${courseProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {courseProgress}% завершено
                </p>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={() => {
                apiService.logout();
                navigate('/login');
              }}
              className="w-full bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition"
            >
              Выйти из аккаунта
            </button>
          </div>

          {/* Right Column - Bird Stage */}
          <div className="w-80">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {birdStages[currentStage].name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {birdStages[currentStage].description}
                </p>
                
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <img 
                    src={birdStages[currentStage].image}
                    alt={birdStages[currentStage].name}
                    className="w-full h-full object-contain animate-bounce-slow"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Всего XP:</span>
                    <span className="font-bold text-gray-900">{currentXP}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Уровень:</span>
                    <span className="font-bold text-gray-900">{currentStage + 1} / 4</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}