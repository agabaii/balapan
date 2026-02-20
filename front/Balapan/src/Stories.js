// front/src/Stories.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from './services/api';
import { Home, Headphones, Play, BookOpen } from 'lucide-react';
import { getTranslation } from './translations';
import { useApp } from './context/AppContext';
import TopBar from './TopBar';


export default function Stories() {
  const navigate = useNavigate();
  const { interfaceLang, currentCourse } = useApp();
  const [stories, setStories] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sourceLang, setSourceLang] = useState(interfaceLang || 'ru');


  useEffect(() => {
    setSourceLang(interfaceLang || 'ru');
    loadStoriesAndStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDifficulty, interfaceLang]);


  const loadStoriesAndStats = async () => {
    if (!apiService.isLoggedIn()) {
      navigate('/login');
      return;
    }

    const userId = apiService.getCurrentUserId();

    // Load stories
    const language = localStorage.getItem('selectedLanguage') || 'kazakh';
    const storiesResult = await apiService.getStories(selectedDifficulty);
    if (storiesResult.success) {
      setStories(storiesResult.stories);
    }

    // Load user stats
    const statsResult = await apiService.getUserStoryStats(userId);
    if (statsResult.success) {
      setUserStats(statsResult.stats);
    }

    setLoading(false);
  };

  const t = getTranslation(interfaceLang);


  // Helper to get content based on TARGET language
  const getTargetContent = (obj, fieldBase) => {
    if (!obj) return '';
    const targetLang = localStorage.getItem('selectedLanguage') || 'kazakh';

    if (targetLang === 'russian') return obj[fieldBase + 'Ru'] || obj[fieldBase];
    if (targetLang === 'english') return obj[fieldBase + 'En'] || obj[fieldBase];
    // Default kazakh
    return obj[fieldBase + 'Kk'] || obj[fieldBase];
  };

  // Helper to get content based on INTERFACE language (for translations)
  const getInterfaceContent = (obj, fieldBase) => {
    if (!obj) return '';
    if (sourceLang === 'en') {
      return obj[fieldBase + 'En'] || obj[fieldBase + 'Ru'] || obj[fieldBase];
    }
    // Default russian
    return obj[fieldBase + 'Ru'] || obj[fieldBase + 'En'] || obj[fieldBase];
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return t.difficultyBeginner;
      case 'intermediate': return t.difficultyIntermediate;
      case 'advanced': return t.difficultyAdvanced;
      default: return difficulty;
    }
  };

  const getCategoryEmoji = (category) => {
    switch (category) {
      case 'culture': return '🏛️';
      case 'daily_life': return '☕';
      case 'travel': return '✈️';
      case 'history': return '📜';
      case 'food': return '🍽️';
      default: return '📖';
    }
  };

  const getLanguageTitle = () => {
    const lang = localStorage.getItem('selectedLanguage') || 'kazakh';
    switch (lang) {
      case 'russian': return 'на русском';
      case 'english': return 'на английском';
      default: return 'на казахском';
    }
  };

  const isStoryCompleted = (storyId) => {
    if (!userStats || !userStats.progress) return false;
    const progress = userStats.progress.find(p => p.story.id === storyId);
    return progress && progress.isCompleted;
  };

  const getStoryProgress = (storyId) => {
    if (!userStats || !userStats.progress) return null;
    return userStats.progress.find(p => p.story.id === storyId);
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFECF' }}>
      <TopBar userData={{ currentStreak: userStats?.currentStreak || 0 }} />

      <div className="flex">
        <div className="w-48 px-4 py-6 space-y-2">
          <Link
            to="/lesson"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition"
            style={{ color: '#A0A0FF' }}
          >
            <Home size={20} style={{ color: '#A0A0FF' }} />
            <span>{t.navHome}</span>
          </Link>
          <Link
            to="/stories"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition"
            style={{ backgroundColor: '#FFE0F0', color: '#F9ADD1' }}
          >
            <BookOpen size={20} style={{ color: '#F9ADD1' }} />
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

        <div className="flex-1 px-6 py-4">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📚 {t.navStories} {getLanguageTitle()}
            </h1>
            <p className="text-lg text-gray-600">
              {sourceLang === 'en' ? 'Learn language through engaging stories' : 'Учите язык через увлекательные истории'}
            </p>
          </div>

          {/* Stats Bar */}
          {userStats && (
            <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-400">{userStats.completed}</div>
                  <div className="text-sm text-gray-600 mt-1">{t.completed}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{userStats.inProgress}</div>
                  <div className="text-sm text-gray-600 mt-1">{sourceLang === 'en' ? 'In progress' : 'В процессе'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{userStats.totalStarted}</div>
                  <div className="text-sm text-gray-600 mt-1">{sourceLang === 'en' ? 'Total started' : 'Всего начато'}</div>
                </div>
              </div>
            </div>
          )}

          {/* Difficulty Filter */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setSelectedDifficulty('all')}
              className={`px-6 py-2 rounded-full font-medium transition ${selectedDifficulty === 'all'
                ? 'bg-pink-400 text-white'
                : 'bg-white text-gray-700 hover:bg-pink-50'
                }`}
            >
              {t.difficultyAll}
            </button>
            <button
              onClick={() => setSelectedDifficulty('beginner')}
              className={`px-6 py-2 rounded-full font-medium transition ${selectedDifficulty === 'beginner'
                ? 'bg-green-400 text-white'
                : 'bg-white text-gray-700 hover:bg-green-50'
                }`}
            >
              {t.difficultyBeginner}
            </button>
            <button
              onClick={() => setSelectedDifficulty('intermediate')}
              className={`px-6 py-2 rounded-full font-medium transition ${selectedDifficulty === 'intermediate'
                ? 'bg-yellow-400 text-white'
                : 'bg-white text-gray-700 hover:bg-yellow-50'
                }`}
            >
              {t.difficultyIntermediate}
            </button>
            <button
              onClick={() => setSelectedDifficulty('advanced')}
              className={`px-6 py-2 rounded-full font-medium transition ${selectedDifficulty === 'advanced'
                ? 'bg-red-400 text-white'
                : 'bg-white text-gray-700 hover:bg-red-50'
                }`}
            >
              {t.difficultyAdvanced}
            </button>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => {
              const progress = getStoryProgress(story.id);
              const isCompleted = isStoryCompleted(story.id);

              return (
                <Link
                  key={story.id}
                  to={`/story/${story.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
                >
                  {/* Cover Image */}
                  <div className="relative h-48 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                    <span className="text-6xl">{getCategoryEmoji(story.category)}</span>

                    {/* Completed Badge */}
                    {isCompleted && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        ✓ {sourceLang === 'en' ? 'Completed' : 'Завершено'}
                      </div>
                    )}

                    {/* In Progress Badge */}
                    {progress && !isCompleted && (
                      <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {sourceLang === 'en' ? 'Chapter' : 'Глава'} {progress.currentChapter}
                      </div>
                    )}
                  </div>

                  {/* Story Info */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(story.difficultyLevel)}`}>
                        {getDifficultyText(story.difficultyLevel)}
                      </span>
                      <span className="text-gray-500 text-sm">⏱️ {story.estimatedTime} {t.minutes}</span>
                      <span className="text-yellow-500 text-sm">⭐ +{story.xpReward} XP</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {getTargetContent(story, 'title')}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {getInterfaceContent(story, 'title')}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {getInterfaceContent(story, 'description')}
                    </p>

                    {/* Chapters Count */}
                    <div className="mt-4 text-sm text-gray-500">
                      📖 {story.chapters?.length || 0} {sourceLang === 'en' ? 'chapters' : 'глав'}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Empty State */}
          {stories.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                Нет историй для этого уровня
              </h3>
              <p className="text-gray-600">
                Попробуйте выбрать другой уровень сложности
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}