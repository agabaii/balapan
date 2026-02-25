import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Trophy, LogOut, Award, UserPlus, ShoppingBag, Trash2,
  User, Edit2, Settings, Zap, Star, Flame
} from 'lucide-react';
import apiService from './services/api';
import Avatar from './components/Avatar';
import { getTranslation } from './translations';
import { useApp } from './context/AppContext';
import TopBar from './TopBar';

export default function Profile() {
  const navigate = useNavigate();
  const { interfaceLang, activeCourses, currentCourseId, switchCourse, removeCourse } = useApp();
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

  const handleDeleteCourse = (e, courseId) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(t.deleteCourseConfirm || 'Вы уверены, что хотите удалить этот курс? Прогресс будет сохранен, но курс исчезнет из вашего списка.');
    if (confirmDelete) {
      removeCourse(courseId);
    }
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
    <div className="min-h-screen bg-[#FFFECF] pb-20">
      <TopBar userData={userData} />

      <div className="max-w-4xl mx-auto px-4 pt-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-[2.5rem] p-8 mb-8 border-2 border-[#F9ADD1] shadow-[0_8px_0_0_#F9ADD1] relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-[#FFDAEC] bg-[#FFFECF] flex items-center justify-center overflow-hidden shadow-inner p-2">
                {userData.avatarData ? (
                  <Avatar size={100} {...JSON.parse(userData.avatarData)} />
                ) : (
                  <User size={64} className="text-[#F9ADD1]" />
                )}
              </div>
              <Link
                to="/edit"
                className="absolute bottom-0 right-0 bg-[#A0A0FF] text-white p-2 rounded-full border-2 border-white shadow-md hover:scale-110 transition active:scale-95"
              >
                <Edit2 size={16} />
              </Link>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h1 className="text-3xl font-black text-[#C14D7D] uppercase tracking-tight">
                  {userData.username}
                </h1>
                <span className="bg-[#FFE0F0] text-[#F9ADD1] text-xs font-black px-3 py-1 rounded-full border border-[#F9ADD1]">
                  {userData.email}
                </span>
              </div>

              <p className="text-[#A0A0FF] font-black text-lg mb-4 italic uppercase tracking-wider">
                {birdStages[currentStage].name}
              </p>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Link
                  to="/edit"
                  className="flex items-center gap-2 bg-white border-2 border-gray-200 px-4 py-2 rounded-2xl font-black text-xs text-gray-400 hover:border-[#F9ADD1] hover:text-[#F9ADD1] transition shadow-sm active:translate-y-0.5"
                >
                  <Settings size={14} /> Настройки
                </Link>
                <button
                  onClick={() => { apiService.logout(); navigate('/login'); }}
                  className="flex items-center gap-2 bg-white border-2 border-red-100 px-4 py-2 rounded-2xl font-black text-xs text-red-300 hover:border-red-400 hover:text-red-500 transition shadow-sm active:translate-y-0.5"
                >
                  <LogOut size={14} /> Выйти
                </button>
              </div>
            </div>
          </div>

          {/* Background Decorative Star */}
          <div className="absolute right-[-20px] top-[-20px] opacity-5 pointer-events-none">
            <Star size={200} fill="#F9ADD1" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Streak Card */}
              <div className="bg-white rounded-3xl p-5 border-2 border-[#FFDAEC] shadow-[0_6px_0_0_#FFDAEC] flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🔥</span>
                </div>
                <div>
                  <div className="text-2xl font-black text-orange-500">{userData.currentStreak || 0}</div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Дней марафона</div>
                </div>
              </div>

              {/* XP Card */}
              <div className="bg-white rounded-3xl p-5 border-2 border-[#FFE0F0] shadow-[0_6px_0_0_#FFE0F0] flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">⭐</span>
                </div>
                <div>
                  <div className="text-2xl font-black text-yellow-500">{currentXP}</div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Всего опыта</div>
                </div>
              </div>

              {/* Gems Card */}
              <Link to="/shop" className="bg-white rounded-3xl p-5 border-2 border-blue-50 shadow-[0_6px_0_0_rgba(160,160,255,0.2)] flex items-center gap-4 hover:scale-105 transition cursor-pointer">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">💎</span>
                </div>
                <div>
                  <div className="text-2xl font-black text-blue-400">{userData.gems || 0}</div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Алмазы</div>
                </div>
              </Link>

              {/* League Card */}
              <div className="bg-white rounded-3xl p-5 border-2 border-indigo-50 shadow-[0_6px_0_0_rgba(99,102,241,0.1)] flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🛡️</span>
                </div>
                <div>
                  <div className="text-2xl font-black text-indigo-500">БРОНЗА</div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Лига</div>
                </div>
              </div>
            </div>

            {/* Balapan Evolution Card */}
            <div className="bg-white rounded-[2.5rem] p-8 border-2 border-[#F9ADD1] shadow-[0_8px_0_0_#F9ADD1] relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 bg-[#FFFECF] rounded-full flex items-center justify-center border-4 border-[#FFDAEC] shadow-inner relative group shrink-0">
                <img
                  src={birdStages[currentStage].image}
                  alt="Balapan Stage"
                  className="w-24 h-24 object-contain animate-bounce-slow"
                />
                <div className="absolute -bottom-2 bg-[#A0A0FF] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-md">
                  Уровень {currentStage + 1}
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-black text-[#C14D7D] uppercase tracking-tight mb-2">
                  Твой Балапан: <span className="text-[#A0A0FF]">{birdStages[currentStage].name}</span>
                </h3>
                <p className="text-xs text-gray-400 font-bold mb-6 leading-relaxed">
                  {birdStages[currentStage].description}
                </p>

                {/* Evolution Progress */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{currentXP} XP</span>
                    <span className="text-[10px] font-black text-[#F9ADD1] uppercase tracking-widest">Цель: {nextStageXP} XP</span>
                  </div>
                  <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-50 shadow-inner">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out relative"
                      style={{
                        width: `${progressPercent}%`,
                        background: 'linear-gradient(90deg, #FFDAEC, #F9ADD1, #FF8EC4)',
                        boxShadow: '0 0 10px rgba(249, 173, 209, 0.5)'
                      }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-[10px] text-[#A0A0FF] font-black uppercase text-right">
                    {currentStage < 3
                      ? `Осталось ${nextStageXP - currentXP} XP до эволюции!`
                      : 'Достигнута финальная форма!'}
                  </p>
                </div>
              </div>

              {/* Decorative decoration */}
              <div className="absolute right-[-10px] bottom-[-10px] opacity-10 rotate-12">
                <Zap size={80} fill="#FFDAEC" />
              </div>
            </div>

            {/* Active Courses */}
            {activeCourses.length > 0 && (
              <div className="bg-white rounded-[2rem] p-8 border-2 border-[#FFDAEC] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-gray-800 uppercase tracking-tight">Мои курсы</h3>
                  <Link to="/language" className="text-xs font-black text-[#A0A0FF] hover:underline uppercase tracking-widest">+ добавить</Link>
                </div>
                <div className="space-y-3">
                  {activeCourses.map(course => {
                    const isActive = String(course.id) === String(currentCourseId);
                    const NAMES = {
                      kk: 'Казахский',
                      ru: 'Русский',
                      en: 'Английский',
                    };
                    const FLAGS = { kk: '/kt.jpg', ru: '/rf.jpg', en: '/usa.png' };
                    return (
                      <div
                        key={course.id}
                        onClick={() => switchCourse(course.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition active:translate-y-1 cursor-pointer ${isActive
                          ? 'border-[#F9ADD1] bg-[#FFE0F0] text-[#C14D7D]'
                          : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-[#FFDAEC]'
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 overflow-hidden rounded-lg flex-shrink-0 shadow-sm border border-gray-100">
                            <img src={FLAGS[course.languageCode] || '/fav.png'} alt="flag" className="w-full h-full object-cover" />
                          </div>
                          <span className="font-black uppercase tracking-tight">{NAMES[course.languageCode] || course.languageCode}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isActive && <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[10px] text-[#F9ADD1] border border-[#F9ADD1]"><Award size={14} /></div>}
                          <button
                            onClick={(e) => handleDeleteCourse(e, course.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-50 rounded-xl transition cursor-pointer"
                            title={t.deleteCourse || "Удалить курс"}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Friends Card Placeholder */}
            <div className="bg-white rounded-[2rem] p-7 border-2 border-[#FFDAEC] shadow-sm text-center">
              <div className="w-16 h-16 bg-[#FFFECF] rounded-full flex items-center justify-center mx-auto mb-4 text-[#F9ADD1]">
                <UserPlus size={32} />
              </div>
              <h3 className="font-black text-gray-800 uppercase tracking-tight mb-2 text-sm">Друзья</h3>
              <p className="text-xs text-gray-400 font-bold mb-6">Учиться вместе веселее! Добавьте друзей, чтобы соревноваться.</p>
              <button className="w-full py-3 bg-[#A0A0FF] text-white rounded-2xl font-black text-xs shadow-[0_4px_0_0_#7A7AFF] hover:brightness-105 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest">
                Найти друзей
              </button>
            </div>

            {/* Achievements Section */}
            <div className="bg-white rounded-[2rem] p-7 border-2 border-[#FFDAEC] shadow-sm">
              <h3 className="font-black text-gray-800 uppercase tracking-tight mb-4 text-sm">Достижения</h3>
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border-2 border-dashed border-gray-200 grayscale opacity-40">
                    <Trophy size={20} className="text-gray-400" />
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 font-bold mt-4 uppercase">Больше открытых уроков — больше наград!</p>
            </div>

            {/* Inventory/Items */}
            <div className="bg-white rounded-[2rem] p-7 border-2 border-[#FFE0F0] shadow-sm">
              <h3 className="font-black text-gray-800 uppercase tracking-tight mb-4 text-sm">Мои предметы</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Flame size={20} className="text-orange-400" fill="currentColor" />
                    <span className="text-xs font-black text-gray-600 uppercase">Заморозка</span>
                  </div>
                  <span className="bg-[#FFE0F0] text-[#F9ADD1] text-xs font-black px-3 py-1 rounded-full border border-[#F9ADD1]">
                    {userData.streakFreezes || 0}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 font-bold mt-4 uppercase text-center">Купи больше в магазине!</p>
            </div>

            {/* Shop Promo Card */}
            <div className="bg-gradient-to-br from-[#A0A0FF] to-[#7A7AFF] rounded-[2rem] p-6 text-white text-center shadow-lg relative overflow-hidden group hover:scale-[1.02] transition duration-500">
              <div className="absolute top-[-20%] left-[-20%] w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition duration-[2s]"></div>
              <ShoppingBag className="mx-auto mb-2 animate-bounce-slow" fill="white" size={32} />
              <h3 className="font-black uppercase tracking-widest text-sm mb-1">Магазин Balapan</h3>
              <p className="text-[10px] font-bold opacity-90 mb-4">Легендарные образы и бонусы!</p>
              <button
                onClick={() => navigate('/shop')}
                className="w-full bg-white text-[#7A7AFF] py-2 rounded-xl font-black text-[10px] shadow-md hover:bg-[#FFFECF] transition active:scale-95"
              >
                ПЕРЕЙТИ В МАГАЗИН
              </button>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}
