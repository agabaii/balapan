import { Home, Headphones, Play, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiService from './services/api';
import { getTranslation } from './translations';
import { useApp } from './context/AppContext';
import TopBar from './TopBar';


export default function Lessons() {
  const navigate = useNavigate();
  const { currentCourseId, interfaceLang } = useApp();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [clickedLockedLesson, setClickedLockedLesson] = useState(null);

  useEffect(() => {
    loadCourseAndUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCourseId]);


  const loadCourseAndUser = async () => {
    setLoading(true);
    setCurrentLevelIndex(0);
    setCurrentPage(0);

    const userResult = await apiService.getUserProfile();
    if (userResult.success) {
      setUserData(userResult.user);
    }

    const progressResult = await apiService.getUserProgress();
    if (progressResult.success) {
      const completed = progressResult.progress
        .filter(p => p.isCompleted)
        .map(p => p.lesson.id);
      setCompletedLessons(completed);
    }

    const courseId = currentCourseId || localStorage.getItem('selectedCourseId');
    if (!courseId) {
      navigate('/language');
      return;
    }

    const result = await apiService.getCourseById(courseId);
    if (result.success) {
      setCourseData(result.course);
    }

    setLoading(false);
  };


  const t = getTranslation(interfaceLang);

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

  if (!courseData || !courseData.levels || courseData.levels.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFECF' }}>
        <div className="text-center">
          <p className="text-gray-700 font-medium mb-4">{t.coursesNotFound}</p>
          <Link to="/language" className="text-pink-400 hover:underline">
            {t.back}
          </Link>
        </div>
      </div>
    );
  }

  const currentLevel = courseData.levels[currentLevelIndex];
  const lessons = currentLevel.lessons || [];
  const totalLevels = courseData.levels.length;
  const lessonsPerPage = 5;
  const totalPages = Math.ceil(lessons.length / lessonsPerPage);

  const isPreviousLevelCompleted = () => {
    if (currentLevelIndex === 0) return true;

    for (let i = 0; i < currentLevelIndex; i++) {
      const prevLevel = courseData.levels[i];
      const prevLessons = prevLevel.lessons || [];
      const allCompleted = prevLessons.every(lesson => completedLessons.includes(lesson.id));
      if (!allCompleted) return false;
    }
    return true;
  };

  const isCurrentLevelUnlocked = isPreviousLevelCompleted();

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const goToNextLevel = () => {
    if (currentLevelIndex < totalLevels - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentLevelIndex(currentLevelIndex + 1);
        setCurrentPage(0);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const goToPreviousLevel = () => {
    if (currentLevelIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentLevelIndex(currentLevelIndex - 1);
        setCurrentPage(0);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const startIndex = currentPage * lessonsPerPage;
  const endIndex = startIndex + lessonsPerPage;
  const currentLessons = lessons.slice(startIndex, endIndex);

  const displayLessons = currentLessons.map((lesson, index) => {
    const globalIndex = startIndex + index;
    const isCompleted = completedLessons.includes(lesson.id);
    const previousCompleted = globalIndex === 0 || completedLessons.includes(lessons[globalIndex - 1]?.id);
    const isUnlocked = isCurrentLevelUnlocked && (globalIndex === 0 || previousCompleted);

    const getImagePath = () => {
      return '/kni.png';
    };

    return {
      id: lesson.id,
      imagePath: getImagePath(),
      unlocked: isUnlocked,
      completed: isCompleted,
      offsetX: index === 0 ? 0 : index === 1 ? -60 : index === 2 ? 50 : index === 3 ? -45 : 55,
      lesson: lesson,
      globalIndex: globalIndex
    };
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFECF' }}>
      <TopBar userData={userData} />

      <div className="flex">
        <div className="w-48 px-4 py-6 space-y-2">
          <Link
            to="/lesson"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition"
            style={{ backgroundColor: '#FFE0F0', color: '#F9ADD1' }}
          >
            <Home size={20} style={{ color: '#F9ADD1' }} />
            <span>{t.navHome}</span>
          </Link>
          <Link
            to="/stories"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition"
            style={{ color: '#A0A0FF' }}
          >
            <BookOpen size={20} style={{ color: '#A0A0FF' }} />
            <span>{t.navStories}</span>
          </Link>
          <Link
            to="/videos"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition"
            style={{ color: '#A0A0FF' }}
          >
            <Play size={20} style={{ color: '#A0A0FF' }} />
            <span>{t.navVideos}</span>
          </Link>
          <Link
            to="/podcasts"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition"
            style={{ color: '#A0A0FF' }}
          >
            <Headphones size={20} style={{ color: '#A0A0FF' }} />
            <span>{t.navPodcasts}</span>
          </Link>
        </div>

        <div className="flex-1 px-6 py-6 flex gap-6">
          <div className="flex-1">
            <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: '#FFE0F0' }}>
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={goToPreviousLevel}
                  disabled={currentLevelIndex === 0}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition ${currentLevelIndex === 0
                    ? 'opacity-30 cursor-not-allowed text-gray-400'
                    : 'bg-pink-200 hover:bg-pink-300 text-gray-800'
                    }`}
                >
                  ← {t.prevLevelBtn}
                </button>

                <div className="text-center flex-1">
                  <div className="text-xs font-bold mb-1" style={{ color: '#A0A0FF' }}>
                    {t.level} {currentLevel.levelNumber} {t.outOf} {totalLevels}
                  </div>
                  <h2 className="text-2xl font-black" style={{ color: '#A0A0FF' }}>
                    {currentLevel.title}
                  </h2>
                </div>

                <button
                  onClick={goToNextLevel}
                  disabled={currentLevelIndex === totalLevels - 1}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition ${currentLevelIndex === totalLevels - 1
                    ? 'opacity-30 cursor-not-allowed text-gray-400'
                    : 'bg-pink-200 hover:bg-pink-300 text-gray-800'
                    }`}
                >
                  {t.nextLevelBtn} →
                </button>
              </div>

              <p className="text-base font-medium text-center" style={{ color: '#A0A0FF' }}>
                {currentLevel.description}
              </p>

              <div className="flex items-center justify-center gap-4 mt-4">
                <span className="text-sm font-bold" style={{ color: '#A0A0FF' }}>
                  {lessons.length} {lessons.length === 1 ? t.lessonCount1 : t.lessonCountMany}
                </span>
                <span className="text-sm" style={{ color: '#A0A0FF' }}>•</span>
                <span className="text-sm font-bold" style={{ color: '#A0A0FF' }}>
                  {t.page} {currentPage + 1} {t.outOf} {totalPages}
                </span>
              </div>
            </div>

            <div
              className={`relative py-12 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
            >
              <div className="flex items-start justify-between gap-8">
                {displayLessons.map((lessonItem, index) => (
                  <div
                    key={lessonItem.id}
                    className="relative flex flex-col items-center"
                    style={{
                      transform: `translateY(${lessonItem.offsetX}px)`,
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    {lessonItem.globalIndex === 0 && lessonItem.unlocked && !lessonItem.completed && (
                      <div className="absolute -top-12 left-1 rounded-full px-6 py-2 border-2 font-black text-sm"
                        style={{
                          backgroundColor: '#FFFECF',
                          borderColor: '#F9ADD1',
                          color: '#F9ADD1',
                          boxShadow: '0 4px 0 0 #FFFB57'
                        }}>
                        {t.start}
                      </div>
                    )}

                    {!lessonItem.unlocked && clickedLockedLesson === lessonItem.id && (
                      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-20">
                        {isCurrentLevelUnlocked ? t.lockedPrevious : t.lockedPrevLevel}
                      </div>
                    )}

                    <Link
                      to={lessonItem.unlocked ? '/les' : '#'}
                      onClick={(e) => {
                        if (lessonItem.unlocked) {
                          localStorage.setItem('currentLessonId', lessonItem.id);
                          localStorage.setItem('currentLessonXp', lessonItem.lesson.xpReward || 20);
                        } else {
                          e.preventDefault();
                          setClickedLockedLesson(lessonItem.id);
                          setTimeout(() => setClickedLockedLesson(null), 3000);
                        }
                      }}
                      className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all ${lessonItem.unlocked
                        ? 'hover:scale-105 cursor-pointer'
                        : 'cursor-not-allowed grayscale'
                        }`}
                      style={lessonItem.unlocked ? {
                        backgroundColor: '#FFDAEC',
                        boxShadow: '0 6px 0 0 #FF8EC4'
                      } : {
                        backgroundColor: '#E5E5E5',
                        boxShadow: '0 6px 0 0 #B0B0B0'
                      }}
                    >
                      <img
                        src={lessonItem.imagePath}
                        className={`w-24 h-24 object-cover rounded-full ${!lessonItem.unlocked ? 'grayscale opacity-60' : ''}`}
                        alt="Lesson"
                      />
                    </Link>

                    {lessonItem.unlocked && (
                      <div className="text-center mt-2 max-w-[120px]">
                        <p className="text-xs font-medium text-gray-700">
                          {lessonItem.lesson.title}
                        </p>
                        <p className="text-xs font-bold mt-1" style={{ color: '#F9ADD1' }}>
                          +{lessonItem.lesson.xpReward} XP
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="absolute right-25 top-1/10 transform translate-x-8">
                <img
                  src="/kni.png"
                  className="w-56 h-56 object-contain"
                  alt="Character"
                />
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 0}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition ${currentPage === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-pink-300 hover:bg-pink-400 text-white shadow-[0_4px_0_0_#C54554]'
                    }`}
                >
                  ← {t.prevBtn}
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (i !== currentPage) {
                          setIsTransitioning(true);
                          setTimeout(() => {
                            setCurrentPage(i);
                            setIsTransitioning(false);
                          }, 300);
                        }
                      }}
                      className={`w-3 h-3 rounded-full transition ${i === currentPage ? 'bg-pink-400' : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                    />
                  ))}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages - 1}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition ${currentPage === totalPages - 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-pink-300 hover:bg-pink-400 text-white shadow-[0_4px_0_0_#C54554]'
                    }`}
                >
                  {t.nextBtn} →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}