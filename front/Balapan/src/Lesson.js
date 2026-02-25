import { Home, Headphones, Star, Lock, Check } from 'lucide-react';
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
  const [streakStats, setStreakStats] = useState({
    currentStreak: 0,
    xpToday: 0,
    dailyGoal: 50
  });

  const [storiesMap, setStoriesMap] = useState({});
  const [videosMap, setVideosMap] = useState({});
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    loadCourseAndUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCourseId]);

  const loadCourseAndUser = async () => {
    setLoading(true);
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
    if (result.success && result.course) {
      const sortedCourse = { ...result.course };
      const rawLang = result.course.languageCode || localStorage.getItem('selectedLanguage') || 'kk';
      const langMap = {
        'kazakh': 'kk', 'kazakhstani': 'kk', 'kaz': 'kk', 'kk': 'kk',
        'russian': 'ru', 'russo': 'ru', 'rus': 'ru', 'ru': 'ru',
        'english': 'en', 'eng': 'en', 'en': 'en',
      };
      const langCode = langMap[rawLang?.toLowerCase()] || rawLang || 'kk';
      console.log('[Lesson] rawLang:', rawLang, '→ langCode:', langCode);

      if (sortedCourse.levels) {
        sortedCourse.levels.sort((a, b) => a.levelNumber - b.levelNumber);
        sortedCourse.levels.forEach(level => {
          if (level.lessons) {
            level.lessons.sort((a, b) => a.lessonNumber - b.lessonNumber);
          }
        });
      }
      setCourseData(sortedCourse);

      try {
        let storiesData = [];
        try {
          const storiesRes = await fetch(`http://localhost:8081/api/stories?language=${langCode}`);
          const storiesJson = await storiesRes.json();
          if (Array.isArray(storiesJson) && storiesJson.length > 0) {
            storiesData = storiesJson;
            console.log(`[Lesson] Loaded ${storiesData.length} stories for language="${langCode}"`);
          }
        } catch (e) {
          console.error('[Lesson] Stories fetch error:', e);
        }

        if (storiesData.length === 0) {
          console.warn(`[Lesson] No stories for language="${langCode}", trying all stories`);
          try {
            const fallbackRes = await fetch(`http://localhost:8081/api/stories`);
            const fallbackJson = await fallbackRes.json();
            if (Array.isArray(fallbackJson) && fallbackJson.length > 0) {
              storiesData = fallbackJson;
              console.log(`[Lesson] Fallback: loaded ${storiesData.length} stories (no language filter)`);
            }
          } catch (e) {
            console.error('[Lesson] Fallback stories load failed', e);
          }
        }

        let videosData = [];
        try {
          const videosRes = await fetch(`http://localhost:8081/api/videos?language=${langCode}`);
          const videosJson = await videosRes.json();
          if (Array.isArray(videosJson) && videosJson.length > 0) {
            videosData = videosJson;
            console.log(`[Lesson] Loaded ${videosData.length} videos for language="${langCode}"`);
          }
        } catch (e) {
          console.error('[Lesson] Videos fetch error:', e);
        }

        if (videosData.length === 0) {
          console.warn(`[Lesson] No videos for language="${langCode}", trying all videos`);
          try {
            const fallbackRes = await fetch(`http://localhost:8081/api/videos`);
            const fallbackJson = await fallbackRes.json();
            if (Array.isArray(fallbackJson) && fallbackJson.length > 0) {
              videosData = fallbackJson;
              console.log(`[Lesson] Fallback: loaded ${videosData.length} videos (no language filter)`);
            }
          } catch (e) {
            console.error('[Lesson] Fallback videos load failed', e);
          }
        }

        const sMap = {};
        (storiesData || []).forEach((s, i) => { sMap[i + 1] = s.id; });
        setStoriesMap(sMap);

        const vMap = {};
        (videosData || []).forEach(v => { vMap[v.orderNumber] = v.id; });
        setVideosMap(vMap);

        console.log('[Lesson] storiesMap built:', sMap, '| videosMap built:', vMap);

        if (userResult.user) {
          const stats = await apiService.getStreakStats(userResult.user.id);
          if (stats) {
            setStreakStats({
              currentStreak: stats.currentStreak || 0,
              xpToday: stats.xpToday || 0,
              dailyGoal: 50
            });
          }
        }
      } catch (e) {
        console.error('[Lesson] Failed to load stories/videos map', e);
      }
    } else {
      console.warn("Course not found, redirecting to language selection");
      localStorage.removeItem('selectedCourseId');
      navigate('/language');
      return;
    }
    setLoading(false);
  };

  const resolveStoryId = (orderIndex) => storiesMap[orderIndex] || null;
  const resolveVideoId = (orderIndex) => videosMap[orderIndex] || null;

  const t = getTranslation(interfaceLang);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFECF]">
        <div className="text-center group">
          <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4 box-content"></div>
          <p className="text-gray-700 font-bold text-lg animate-pulse">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!courseData || !courseData.levels || courseData.levels.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFECF] p-6">
        <div className="bg-white p-10 rounded-3xl border-4 border-pink-200 text-center shadow-xl max-w-sm">
          <p className="text-gray-700 font-bold text-xl mb-6">{t.coursesNotFound}</p>
          <Link to="/language" className="inline-block py-3 px-8 bg-pink-400 text-white font-black rounded-2xl shadow-[0_4px_0_0_#C54554] hover:scale-105 transition transform active:scale-95">
            {t.back}
          </Link>
        </div>
      </div>
    );
  }

  const isLessonUnlocked = (levelIdx, lessonIdx) => {
    if (levelIdx === 0 && lessonIdx === 0) return true;

    if (lessonIdx > 0) {
      const prevLesson = courseData.levels[levelIdx].lessons[lessonIdx - 1];
      return completedLessons.includes(prevLesson.id);
    } else if (levelIdx > 0) {
      const prevLevel = courseData.levels[levelIdx - 1];
      if (prevLevel.lessons && prevLevel.lessons.length > 0) {
        const lastLessonOfPrevLevel = prevLevel.lessons[prevLevel.lessons.length - 1];
        return completedLessons.includes(lastLessonOfPrevLevel.id);
      }
    }

    return false;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFECF]">
      <TopBar userData={userData} />

      <div className="flex flex-1 max-w-6xl mx-auto w-full">
        {/* Sidebar Nav */}
        <aside className="w-64 fixed left-0 top-[80px] bottom-0 p-6 hidden lg:flex flex-col gap-3">
          <Link
            to="/lesson"
            className="flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-lg transition duration-200 bg-[#FFE0F0] text-[#F9ADD1] shadow-[0_4px_0_0_#F9ADD1] uppercase italic"
          >
            <Home size={24} strokeWidth={3} />
            <span>{t.navHome}</span>
          </Link>
          <Link
            to="/podcasts"
            className="flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-lg transition duration-200 text-gray-400 hover:bg-white/50 uppercase italic"
          >
            <Headphones size={24} strokeWidth={3} />
            <span>{t.navPodcasts}</span>
          </Link>
        </aside>

        {/* Main Content (Snake Map) */}
        <main className="flex-1 lg:ml-64 px-4 py-8 flex flex-col items-center gap-20">
          {courseData.levels.map((level, lIndex) => {
            const levelTitle = interfaceLang === 'kk' ? level.titleKk : (interfaceLang === 'en' ? level.titleEn : level.titleRu);
            const levelDesc = interfaceLang === 'kk' ? level.descriptionKk : (interfaceLang === 'en' ? level.descriptionEn : level.descriptionRu);

            return (
              <div key={level.id} className="w-full flex flex-col items-center">
                {/* Level Header */}
                <div className="w-full max-w-[600px] bg-[#FFE0F0] rounded-3xl p-6 mb-12 shadow-[0_8px_0_0_#F9ADD1] border-2 border-[#F9ADD1] relative overflow-hidden group">
                  <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition duration-700">
                    <Star size={120} fill="#F9ADD1" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-[#F9ADD1] font-black text-sm tracking-widest uppercase mb-1">
                      Раздел {level.levelNumber}
                    </h3>
                    <h2 className="text-[#A0A0FF] font-black text-2xl mb-2">
                      {levelTitle || level.title}
                    </h2>
                    <p className="text-[#A0A0FF] font-bold opacity-80">
                      {levelDesc || level.description}
                    </p>
                  </div>
                </div>

                {/* Lessons Snake */}
                <div className="flex flex-col items-center gap-4 relative w-full overflow-visible">
                  {(level.lessons || []).map((lesson, idx) => {
                    const isUnlocked = isLessonUnlocked(lIndex, idx);
                    const isCompleted = completedLessons.includes(lesson.id);

                    const offsets = [0, 50, 100, 50, 0, -50, -100, -50];
                    const leftOffset = offsets[idx % offsets.length];

                    const lessonTitle = interfaceLang === 'kk' ? lesson.titleKk : (interfaceLang === 'en' ? lesson.titleEn : lesson.titleRu);

                    const resolvedVideoId = lesson.linkedVideoId ? resolveVideoId(lesson.linkedVideoId) : null;
                    const resolvedStoryId = lesson.linkedStoryId ? resolveStoryId(lesson.linkedStoryId) : null;

                    const MASCOTS = ['/ptenez.png', '/pusk (2).png', '/balapan.png', '/kni.png', '/kniga.png', '/let.png'];
                    const showMascot = idx % 3 === 0 && idx !== 0;
                    const mascotImg = MASCOTS[(lIndex * 10 + idx) % MASCOTS.length];
                    const mascotSide = leftOffset > 0 ? 'left' : (leftOffset < 0 ? 'right' : (idx % 6 === 0 ? 'right' : 'left'));

                    const getLessonLink = () => {
                      if (!isUnlocked) return '#';
                      if (lesson.linkedVideoId) return resolvedVideoId ? `/video/${resolvedVideoId}` : '#';
                      if (lesson.linkedStoryId) return resolvedStoryId ? `/story/${resolvedStoryId}` : '#';
                      return '/les';
                    };

                    const storiesMapLoaded = Object.keys(storiesMap).length > 0 || Object.keys(videosMap).length > 0;
                    const isContentMissing = storiesMapLoaded && (
                      (lesson.linkedVideoId && !resolvedVideoId) ||
                      (lesson.linkedStoryId && !resolvedStoryId)
                    );

                    return (
                      <div
                        key={lesson.id}
                        className={`flex flex-col items-center transition duration-500 relative w-full z-10`}
                        style={{ transform: `translateX(${leftOffset}px)` }}
                      >
                        {/* Mascot rendering */}
                        {showMascot && (
                          <div
                            className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-0"
                            style={{
                              [mascotSide]: '-150px',
                              opacity: isUnlocked ? 1 : 0.4
                            }}
                          >
                            <img
                              src={mascotImg}
                              alt="mascot"
                              className="w-48 h-48 object-contain animate-float hover:scale-110 transition-transform duration-500"
                              style={{ animationDelay: `${idx * 0.3}s` }}
                            />
                          </div>
                        )}

                        <Link
                          to={getLessonLink()}
                          onClick={(e) => {
                            e.preventDefault();
                            if (!isUnlocked || isContentMissing) return;
                            setActiveLesson({ ...lesson, resolvedVideoId, resolvedStoryId, lessonTitle, isCompleted });
                          }}
                          className={`
                            relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200
                            ${isUnlocked && !isContentMissing ? 'hover:scale-110 active:scale-95 cursor-pointer transform' : 'cursor-not-allowed'}
                          `}
                          style={isUnlocked
                            ? {
                              backgroundColor: isCompleted ? '#FFE0F0' : '#FFDAEC',
                              boxShadow: `0 8px 0 0 ${isCompleted ? '#F9ADD1' : '#FF8EC4'}`,
                              border: `4px solid white`
                            }
                            : {
                              backgroundColor: '#E5E5E5',
                              boxShadow: '0 8px 0 0 #AFAFAF',
                              border: '4px solid #D5D5D5'
                            }
                          }
                        >
                          <Star size={44} fill="white" color="white" strokeWidth={0} />

                          {isUnlocked && !isCompleted && (
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white border-2 border-pink-400 text-pink-500 font-black text-xs px-4 py-2 rounded-xl shadow-md whitespace-nowrap animate-bounce">
                              СТАРТ
                            </div>
                          )}
                          {!isUnlocked && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-full">
                              <Lock size={32} fill="#AFAFAF" color="#AFAFAF" />
                            </div>
                          )}
                        </Link>

                        <div className="mt-3 text-center">
                          <p className="text-[#6B7280] font-black text-sm max-w-[140px] leading-tight uppercase tracking-tight">
                            {lessonTitle || lesson.title}
                          </p>
                          {isContentMissing && (
                            <p className="text-red-400 text-xs font-bold mt-1">⚠ контент не найден</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Global Lesson Pop-up */}
          {activeLesson && (
            <>
              <div
                className="fixed inset-0 z-[100] bg-black/5 backdrop-blur-sm"
                onClick={() => setActiveLesson(null)}
              ></div>
              <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] w-[320px] p-8 bg-[#FFDAEC] rounded-[2.5rem] shadow-2xl animate-pop border-8 border-white pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-[#C14D7D] font-black text-2xl mb-2 leading-tight text-center uppercase">
                  {activeLesson.lessonTitle || activeLesson.title}
                </h2>
                <p className="text-[#C14D7D]/70 font-bold mb-6 uppercase tracking-wider text-xs text-center">
                  {activeLesson.isCompleted ? 'ХОТИТЕ ПОВТОРИТЬ?' : 'НОВОЕ ЗАДАНИЕ'}
                </p>
                <button
                  onClick={() => {
                    const xp = activeLesson.isCompleted ? 3 : (activeLesson.xpReward || 20);
                    localStorage.setItem('currentLessonId', activeLesson.id);
                    localStorage.setItem('currentLessonXp', xp);

                    // ✅ ИСПРАВЛЕНО: проверяем resolvedVideoId/resolvedStoryId вместо linkedVideoId/linkedStoryId
                    if (activeLesson.resolvedVideoId) {
                      localStorage.setItem('returnTo', '/lesson');
                      localStorage.setItem('returnLessonId', activeLesson.id);
                      navigate(`/video/${activeLesson.resolvedVideoId}`);
                    } else if (activeLesson.resolvedStoryId) {
                      localStorage.setItem('returnTo', '/lesson');
                      localStorage.setItem('returnLessonId', activeLesson.id);
                      navigate(`/story/${activeLesson.resolvedStoryId}`);
                    } else {
                      navigate('/les');
                    }
                  }}
                  className="w-full bg-white text-[#F9ADD1] py-4 rounded-2xl font-black text-lg shadow-[0_6px_0_0_#F9ADD1] hover:brightness-105 active:translate-y-1 active:shadow-none transition-all uppercase mb-3"
                >
                  {activeLesson.isCompleted ? 'ПОВТОРИТЬ' : 'НАЧАТЬ'}
                </button>
                <button
                  onClick={() => setActiveLesson(null)}
                  className="w-full py-2 text-[#C14D7D]/60 font-black uppercase text-xs hover:text-[#C14D7D] transition text-center"
                >
                  ЗАКРЫТЬ
                </button>
              </div>
            </>
          )}
        </main>

        {/* Sidebar Info/Promos (Right Side) */}
        <aside className="w-80 p-6 hidden xl:flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 border-2 border-pink-100 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <img src="/kni.png" className="w-16 h-16 object-contain" alt="Balapan Super" />
              <div>
                <h3 className="font-black text-gray-800 leading-tight">Балапан Супер</h3>
                <p className="text-sm text-gray-500 font-bold">Учись быстрее!</p>
              </div>
            </div>
            <button className="w-full py-3 bg-pink-400 text-white font-black rounded-2xl shadow-[0_4px_0_0_#C54554] hover:brightness-110 transition active:translate-y-1 active:shadow-none">
              АКТИВИРОВАТЬ
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border-2 border-blue-100 shadow-sm transition hover:shadow-md">
            <h3 className="font-black text-blue-400 mb-2 uppercase tracking-wider text-sm">Цель на день</h3>
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-3 border border-gray-50">
              <div
                className="h-full bg-blue-400 transition-all duration-1000 ease-out rounded-full shadow-[inset_0_-2px_0_0_rgba(0,0,0,0.1)]"
                style={{ width: `${Math.min(100, (streakStats.xpToday / streakStats.dailyGoal) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{streakStats.xpToday} / {streakStats.dailyGoal} XP</p>
              {streakStats.xpToday >= streakStats.dailyGoal && (
                <span className="text-yellow-400 font-bold text-xs animate-pulse">ЦЕЛЬ ДОСТИГНУТА! 🌟</span>
              )}
            </div>
          </div>
        </aside>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        main > div { animation: slideIn 0.5s ease-out forwards; }
        @keyframes pop { 
          0% { transform: scale(0.9) translateY(10px); opacity: 0; } 
          100% { transform: scale(1) translateY(0); opacity: 1; } 
        }
        .animate-pop { animation: pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}} />
    </div>
  );
}