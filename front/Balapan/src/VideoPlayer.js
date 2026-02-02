// src/VideoPlayer.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from './services/api';
import { ChevronLeft, CheckCircle } from 'lucide-react';

export default function VideoPlayer() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const watchTimerRef = useRef(null);

  useEffect(() => {
    loadVideo();
    startWatchTimer();
    
    return () => {
      if (watchTimerRef.current) {
        clearInterval(watchTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const loadVideo = async () => {
    const result = await apiService.getVideoById(videoId);
    if (result.success) {
      setVideo(result.video);
      
      const userId = apiService.getCurrentUserId();
      await apiService.startVideo(userId, videoId);
    }
    setLoading(false);
  };

  const startWatchTimer = () => {
    watchTimerRef.current = setInterval(() => {
      setWatchTime(prev => prev + 1);
    }, 1000);
  };

  const handleComplete = async () => {
    if (watchTimerRef.current) {
      clearInterval(watchTimerRef.current);
    }

    const userId = apiService.getCurrentUserId();
    const result = await apiService.completeVideo(userId, videoId, watchTime);

    if (result.success) {
      setCompleted(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFECF' }}>
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-400"></div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#FFFECF' }}>
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Видео просмотрено!
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            {video?.title}
          </p>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
            <div className="text-5xl font-bold text-pink-400 mb-2">
              <CheckCircle className="w-16 h-16 mx-auto" />
            </div>
            <div className="text-gray-700">
              Время просмотра: {Math.floor(watchTime / 60)} мин {watchTime % 60} сек
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-6 text-yellow-500">
            <span className="text-2xl">⭐</span>
            <span className="text-2xl font-bold">+{video?.xpReward} XP</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/videos')}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition"
            >
              К видео
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 bg-pink-400 text-white py-3 rounded-xl font-medium hover:bg-pink-500 transition"
            >
              Профиль
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFECF' }}>
        <div className="text-center">
          <p className="text-gray-700 mb-4">Видео не найдено</p>
          <button
            onClick={() => navigate('/videos')}
            className="bg-pink-400 text-white px-6 py-2 rounded-lg hover:bg-pink-500"
          >
            Назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFECF' }}>
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center" style={{ backgroundColor: '#FFFECF' }}>
        <button
          onClick={() => {
            if (watchTimerRef.current) {
              clearInterval(watchTimerRef.current);
            }
            navigate('/videos');
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Назад</span>
        </button>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            ⏱️ {Math.floor(watchTime / 60)}:{(watchTime % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Video Info */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {video.title}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{video.titleKk}</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full font-medium">
              {video.difficultyLevel === 'beginner' ? 'Начальный' : 
               video.difficultyLevel === 'intermediate' ? 'Средний' : 'Продвинутый'}
            </span>
            <span className="text-gray-600">⏱️ {video.durationMinutes} мин</span>
            <span className="text-orange-500 font-bold">⭐ +{video.xpReward} XP</span>
          </div>
        </div>

        {/* YouTube Player */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
          <div className="relative" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Description */}
        {video.description && (
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">📝 Описание</h3>
            <p className="text-gray-700 leading-relaxed">{video.description}</p>
          </div>
        )}

        {/* Complete Button */}
        <div className="flex justify-center">
          <button
            onClick={handleComplete}
            className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition"
          >
            ✓ Отметить как просмотренное
          </button>
        </div>

        {/* Watch Time Info */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>Время просмотра: {Math.floor(watchTime / 60)} мин {watchTime % 60} сек</p>
        </div>
      </div>
    </div>
  );
}