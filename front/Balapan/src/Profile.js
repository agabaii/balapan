import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiService from './services/api';
import StreakDisplay from './StreakDisplay';
import { getTranslation } from './translations';
import { useApp } from './context/AppContext';
import TopBar from './TopBar';


export default function Profile() {
  const navigate = useNavigate();
  const { interfaceLang, activeCourses, currentCourseId, switchCourse } = useApp();
  const t = getTranslation(interfaceLang);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [courseProgress, setCourseProgress] = useState(0);


  const birdStages = [
    {
      name: t.birdStage0,
      image: '/yzo.png',
      description: t.birdDesc0,
      minXP: 0
    },
    {
      name: t.birdStage1,
      image: '/balapan.png',
      description: t.birdDesc1,
      minXP: 375
    },
    {
      name: t.birdStage2,
      image: '/kniga.png',
      description: t.birdDesc2,
      minXP: 750
    },
    {
      name: t.birdStage3,
      image: '/pusk (2).png',
      description: t.birdDesc3,
      minXP: 1125
    }
  ];

  useEffect(() => {
    checkAuthAndLoadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthAndLoadProfile = async () => {
    if (!apiService.isLoggedIn()) {
      navigate('/login');
      return;
    }

    // Загружаем профиль
    const result = await apiService.getUserProfile();

    if (result.success) {
      const currentStage = apiService.calculateBirdStage(result.user.totalXp || 0);
      setUserData({
        ...result.user,
        birdStage: currentStage
      });
      setError(null);
    } else {
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
          <p className="text-gray-700 font-medium">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFECF' }}>
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-gray-700 font-medium mb-4">{t.error}: {error}</p>
          <button
            onClick={checkAuthAndLoadProfile}
            className="bg-pink-400 text-white px-6 py-2 rounded-lg hover:bg-pink-500"
          >
            {t.tryAgain}
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFECF' }}>
        <div className="text-center">
          <p className="text-gray-700 font-medium mb-4">{t.error}</p>
          <Link to="/login" className="text-pink-400 hover:underline">
            {t.login}
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
      <TopBar userData={userData} />

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
                      <span>{t.editProfile}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* My Courses — multi-course block */}
            {activeCourses.length > 0 && (
              <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {interfaceLang === 'ru' ? '📚 Мои курсы' : interfaceLang === 'kk' ? '📚 Менің курстарым' : '📚 My Courses'}
                  </h3>
                  <Link to="/language" className="text-sm font-medium text-pink-400 hover:underline">
                    {interfaceLang === 'ru' ? '+ Добавить' : interfaceLang === 'kk' ? '+ Қосу' : '+ Add'}
                  </Link>
                </div>
                <div className="flex flex-wrap gap-3">
                  {activeCourses.map(course => {
                    const FLAGS = { kk: '🇰🇿', ru: '🇷🇺', en: '🇺🇸' };
                    const NAMES = {
                      kk: { ru: 'Казахский', kk: 'Қазақша', en: 'Kazakh' },
                      ru: { ru: 'Русский', kk: 'Орысша', en: 'Russian' },
                      en: { ru: 'Английский', kk: 'Ағылшынша', en: 'English' },
                    };
                    const isActive = String(course.id) === String(currentCourseId);
                    return (
                      <button
                        key={course.id}
                        onClick={() => { switchCourse(course.id); }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition border-2 ${isActive
                            ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                            : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-pink-300 hover:bg-pink-50'
                          }`}
                      >
                        <span className="text-xl">{FLAGS[course.languageCode] || '📚'}</span>
                        <span>{NAMES[course.languageCode]?.[interfaceLang] || course.languageCode}</span>
                        {isActive && <span className="text-yellow-500">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-bold text-gray-900">
                  {currentXP} / {nextStageXP} {t.xpToNext}
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
                  ? `${t.moreXp} ${nextStageXP - currentXP} ${t.andGrow}`
                  : t.maxLevel}
              </p>
            </div>

            {/* NEW: Streak Display */}
            <StreakDisplay userId={userData.id} />

            {/* AI Learning Tools Section */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border-l-4 border-pink-400">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🚀</span> AI {t.learning || 'Learning Tools'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/chat" className="flex items-center p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition border border-pink-100 group">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl mr-4 shadow-sm group-hover:scale-110 transition">💬</div>
                  <div>
                    <div className="font-bold text-gray-900">AI Tutor</div>
                    <div className="text-xs text-gray-500">Practice speaking with AI</div>
                  </div>
                </Link>
                <Link to="/vocabulary" className="flex items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition border border-purple-100 group">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl mr-4 shadow-sm group-hover:scale-110 transition">🗂️</div>
                  <div>
                    <div className="font-bold text-gray-900">Vocabulary</div>
                    <div className="text-xs text-gray-500">SRS Word Mastery</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Course Progress */}
            {currentCourse && (
              <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {t.progressCourse}: {currentCourse.name}
                </h3>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${courseProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {courseProgress}% {t.completed}
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
              {t.logout}
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
                    <span className="text-gray-600">{t.totalXp}:</span>
                    <span className="font-bold text-gray-900">{currentXP}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t.level}:</span>
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
