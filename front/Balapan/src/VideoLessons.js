// src/VideoLessons.js
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiService from './services/api';
import { Home, Headphones, Play, BookOpen } from 'lucide-react';

export default function VideoLessons() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [userData, setUserData] = useState(null);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [clickedLockedVideo, setClickedLockedVideo] = useState(null);

  const videosPerPage = 5;

  useEffect(() => {
    loadVideosAndProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDifficulty]);

  const loadVideosAndProgress = async () => {
    if (!apiService.isLoggedIn()) {
      navigate('/login');
      return;
    }

    const userId = apiService.getCurrentUserId();

    const userResult = await apiService.getUserProfile();
    if (userResult.success) {
      setUserData(userResult.user);
    }

    const videosResult = await apiService.getVideoLessons(selectedDifficulty);
    if (videosResult.success) {
      setVideos(videosResult.videos);
    }

    const progressResult = await apiService.getUserVideoStats(userId);
    if (progressResult.success) {
      setUserProgress(progressResult.stats.progress || []);
    }

    setLoading(false);
  };

  const isVideoCompleted = (videoId) => {
    return userProgress.some(p => p.videoLesson.id === videoId && p.isCompleted);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return { bg: '#D1FAE5', shadow: '#10B981' };
      case 'intermediate': return { bg: '#FEF3C7', shadow: '#F59E0B' };
      case 'advanced': return { bg: '#FEE2E2', shadow: '#EF4444' };
      default: return { bg: '#FFDAEC', shadow: '#FF8EC4' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFECF' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-400 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Загрузка видео...</p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(videos.length / videosPerPage);
  const startIndex = currentPage * videosPerPage;
  const endIndex = startIndex + videosPerPage;
  const currentVideos = videos.slice(startIndex, endIndex);

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

  const displayVideos = currentVideos.map((video, index) => {
    const globalIndex = startIndex + index;
    const isCompleted = isVideoCompleted(video.id);
    const previousCompleted = globalIndex === 0 || isVideoCompleted(videos[globalIndex - 1]?.id);
    const isUnlocked = globalIndex === 0 || previousCompleted;
    const colors = getDifficultyColor(video.difficultyLevel);

    return {
      ...video,
      unlocked: isUnlocked,
      completed: isCompleted,
      colors: colors,
      offsetX: index === 0 ? 0 : index === 1 ? -60 : index === 2 ? 50 : index === 3 ? -45 : 55,
      globalIndex: globalIndex
    };
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFECF' }}>
      <header className="px-6 py-4 flex justify-between items-center" style={{ backgroundColor: '#FFFECF' }}>
        <Link to="/">
          <img
            src="/fav.png"
            className="h-18 cursor-pointer hover:opacity-80 transition"
            alt="Balapan Logo"
          />
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full px-4 py-2">
            <span className="text-2xl">🔥</span>
            <span className="font-bold text-orange-500 text-lg">
              {userData?.currentStreak || 0}
            </span>
          </div>
          <Link to="/Profile">
            <img
              src="/ava.jpg"
              className="w-10 h-10 rounded-full object-cover"
              alt="Avatar"
            />
          </Link>
        </div>
      </header>

      <div className="flex" style={{ backgroundColor: '#FFFECF' }}>
        <div className="w-48 px-4 py-6 space-y-2">
          <Link
            to="/lesson"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition"
            style={{ color: '#A0A0FF' }}
          >
            <Home size={20} style={{ color: '#A0A0FF' }} />
            <span>ИЗУЧЕНИЕ</span>
          </Link>
          <Link
            to="/podcasts"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition"
            style={{ color: '#A0A0FF' }}
          >
            <Headphones size={20} style={{ color: '#A0A0FF' }} />
            <span>ПОДКАСТЫ</span>
          </Link>
          <Link
            to="/videos"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition"
            style={{ backgroundColor: '#FFE0F0', color: '#F9ADD1' }}
          >
            <Play size={20} style={{ color: '#F9ADD1' }} />
            <span>ВИДЕО</span>
          </Link>
          <Link
            to="/stories"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition"
            style={{ color: '#A0A0FF' }}
          >
            <BookOpen size={20} style={{ color: '#A0A0FF' }} />
            <span>ИСТОРИИ</span>
          </Link>
        </div>

        <div className="flex-1 px-6 py-6 flex gap-6" style={{ backgroundColor: '#FFFECF' }}>
          <div className="flex-1">
            <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: '#FFE0F0' }}>
              <div className="text-center">
                <h2 className="text-2xl font-black mb-2" style={{ color: '#A0A0FF' }}>
                  Видео-уроки казахского языка
                </h2>
                <p className="text-base font-medium" style={{ color: '#A0A0FF' }}>
                  Учите через видео
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 mt-4">
                {['all', 'beginner', 'intermediate', 'advanced'].map(diff => (
                  <button
                    key={diff}
                    onClick={() => {
                      setSelectedDifficulty(diff);
                      setCurrentPage(0);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition ${selectedDifficulty === diff
                        ? 'bg-pink-400 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    {diff === 'all' ? 'ВСЕ' :
                      diff === 'beginner' ? 'НАЧАЛЬНЫЙ' :
                        diff === 'intermediate' ? 'СРЕДНИЙ' : 'ПРОДВИНУТЫЙ'}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-center gap-4 mt-4">
                <span className="text-sm font-bold" style={{ color: '#A0A0FF' }}>
                  {videos.length} видео
                </span>
                {totalPages > 1 && (
                  <>
                    <span className="text-sm" style={{ color: '#A0A0FF' }}>•</span>
                    <span className="text-sm font-bold" style={{ color: '#A0A0FF' }}>
                      Страница {currentPage + 1} из {totalPages}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div
              className={`relative py-6 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
              style={{ backgroundColor: '#FFFECF', minHeight: '300px' }}
            >
              <div className="flex items-start justify-between gap-8">
                {displayVideos.map((video, index) => (
                  <div
                    key={video.id}
                    className="relative flex flex-col items-center"
                    style={{
                      transform: `translateY(${video.offsetX}px)`,
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    {video.globalIndex === 0 && video.unlocked && !video.completed && (
                      <div className="absolute -top-12 left-1 rounded-full px-6 py-2 border-2 font-black text-sm"
                        style={{
                          backgroundColor: '#FFFECF',
                          borderColor: '#F9ADD1',
                          color: '#F9ADD1',
                          boxShadow: '0 4px 0 0 #FFFB57'
                        }}>
                        НАЧАТЬ
                      </div>
                    )}

                    {video.completed && (
                      <div className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}

                    {!video.unlocked && clickedLockedVideo === video.id && (
                      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-20">
                        Пройди предыдущее видео
                      </div>
                    )}

                    <Link
                      to={video.unlocked ? `/video/${video.id}` : '#'}
                      onClick={(e) => {
                        if (video.unlocked) {
                          localStorage.setItem('currentVideoId', video.id);
                        } else {
                          e.preventDefault();
                          setClickedLockedVideo(video.id);
                          setTimeout(() => setClickedLockedVideo(null), 3000);
                        }
                      }}
                      className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all ${video.unlocked
                          ? 'hover:scale-105 cursor-pointer'
                          : 'cursor-not-allowed grayscale'
                        }`}
                      style={video.unlocked ? {
                        backgroundColor: video.colors.bg,
                        boxShadow: `0 6px 0 0 ${video.colors.shadow}`
                      } : {
                        backgroundColor: '#E5E5E5',
                        boxShadow: '0 6px 0 0 #B0B0B0'
                      }}
                    >
                      <Play
                        className={`w-16 h-16 ${!video.unlocked ? 'opacity-40' : ''}`}
                        style={{ color: video.unlocked ? video.colors.shadow : '#9CA3AF' }}
                        fill="currentColor"
                      />
                    </Link>

                    {video.unlocked && (
                      <div className="text-center mt-2 max-w-[120px]">
                        <p className="text-xs font-medium text-gray-700">
                          {video.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          ⏱️ {video.durationMinutes} мин
                        </p>
                        <p className="text-xs font-bold mt-1" style={{ color: '#F9ADD1' }}>
                          +{video.xpReward} XP
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="absolute right-25 top-0 transform translate-x-8">
                <img
                  src="/kni.png"
                  className="w-56 h-56 object-contain"
                  alt="Character"
                />
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 0}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition ${currentPage === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-pink-300 hover:bg-pink-400 text-white shadow-[0_4px_0_0_#C54554]'
                    }`}
                >
                  ← Назад
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
                  Далее →
                </button>
              </div>
            )}

            {videos.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎥</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  Нет видео для этого уровня
                </h3>
                <p className="text-gray-600">
                  Выберите другой уровень сложности
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}