// src/PodcastPlayer.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from './services/api';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ChevronLeft } from 'lucide-react';

export default function PodcastPlayer() {
  const { podcastId } = useParams();
  const navigate = useNavigate();
  const audioRef = useRef(null);
  
  const [podcast, setPodcast] = useState(null);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [showTranscript, setShowTranscript] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    loadPodcast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podcastId]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  const loadPodcast = async () => {
    const result = await apiService.getStoryById(podcastId);
    if (result.success) {
      setPodcast(result.story);
      
      const userId = apiService.getCurrentUserId();
      await apiService.startStory(userId, podcastId);
    }
    setLoading(false);
  };

  const currentEpisode = podcast?.chapters?.[currentEpisodeIndex];
  const hasQuestion = currentEpisode?.questions?.length > 0;
  const currentQuestion = currentEpisode?.questions?.[0];

  // Audio controls
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log('Play prevented:', error);
            setIsPlaying(false);
          });
      }
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const seekTime = (e.target.value / 100) * duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = e.target.value / 100;
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume > 0 ? volume : 0.5;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const skipTime = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer.isCorrect;
    setShowResult(true);
    
    if (isCorrect) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setScore(prev => ({ ...prev, total: prev.total + 1 }));
    }
  };

  const handleNextEpisode = () => {
    // Pause current audio before moving
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
    setIsPlaying(false);

    if (currentEpisodeIndex < podcast.chapters.length - 1) {
      setCurrentEpisodeIndex(prev => prev + 1);
      setShowTranscript(true);
      setSelectedAnswer(null);
      setShowResult(false);
      setCurrentTime(0);
    } else {
      completePodcast();
    }
  };

  const completePodcast = async () => {
    // Pause audio before completing
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }

    const userId = apiService.getCurrentUserId();
    const result = await apiService.completeStory(
      userId,
      podcastId,
      score.correct,
      score.total
    );

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
    const percentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#FFFECF' }}>
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Подкаст прослушан!
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            {podcast?.title}
          </p>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
            <div className="text-5xl font-bold text-pink-400 mb-2">
              {percentage}%
            </div>
            <div className="text-gray-700">
              {score.correct} из {score.total} правильных ответов
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-6 text-yellow-500">
            <span className="text-2xl">⭐</span>
            <span className="text-2xl font-bold">+{podcast?.xpReward} XP</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/podcasts')}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition"
            >
              К подкастам
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

  if (!podcast) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFECF' }}>
        <div className="text-center">
          <p className="text-gray-700 mb-4">Подкаст не найден</p>
          <button
            onClick={() => navigate('/podcasts')}
            className="bg-pink-400 text-white px-6 py-2 rounded-lg hover:bg-pink-500"
          >
            Назад
          </button>
        </div>
      </div>
    );
  }

  // Audio URL
  const audioUrl = currentEpisode?.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFECF' }}>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center" style={{ backgroundColor: '#FFFECF' }}>
        <button
          onClick={() => {
            const audio = audioRef.current;
            if (audio) audio.pause();
            navigate('/podcasts');
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Назад</span>
        </button>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Эпизод {currentEpisodeIndex + 1} / {podcast.chapters.length}
          </span>
          <span className="text-sm font-medium text-pink-400">
            {score.correct}/{score.total} ✓
          </span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Podcast Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {podcast.title}
          </h1>
          <p className="text-lg text-gray-600">{podcast.titleKk}</p>
        </div>

        {/* Audio Player Card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mb-6">
          {/* Cover Art */}
          <div className="flex justify-center mb-8">
            <div className="w-64 h-64 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 rounded-3xl shadow-2xl flex items-center justify-center">
              <span className="text-9xl">🎧</span>
            </div>
          </div>

          {/* Episode Title */}
          {currentEpisode?.characterName && (
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Эпизод {currentEpisodeIndex + 1}
              </h3>
              <p className="text-gray-600">
                Ведущий: {currentEpisode.characterName}
              </p>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-6">
            <input
              type="range"
              min="0"
              max="100"
              value={duration > 0 ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-400"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <button
              onClick={() => skipTime(-10)}
              className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition"
            >
              <SkipBack className="w-5 h-5 text-gray-700" />
            </button>

            <button
              onClick={togglePlayPause}
              className="w-16 h-16 bg-pink-400 hover:bg-pink-500 rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-105"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 text-white" fill="currentColor" />
              ) : (
                <Play className="w-7 h-7 text-white ml-1" fill="currentColor" />
              )}
            </button>

            <button
              onClick={() => skipTime(10)}
              className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition"
            >
              <SkipForward className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-4 justify-center mb-8">
            <button
              onClick={toggleMute}
              className="text-gray-600 hover:text-gray-900 transition"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume * 100}
              onChange={handleVolumeChange}
              className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-400"
            />
          </div>

          {/* Transcript Toggle */}
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="w-full bg-gray-100 hover:bg-gray-200 py-3 rounded-xl font-medium text-gray-700 transition mb-4"
          >
            {showTranscript ? '🙈 Скрыть транскрипт' : '📝 Показать транскрипт'}
          </button>

          {/* Transcript */}
          {showTranscript && (
            <div className="space-y-4 mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🇰🇿</span>
                  <span className="text-sm font-bold text-purple-600">КАЗАХСКИЙ</span>
                </div>
                <p className="text-lg leading-relaxed text-gray-900">
                  {currentEpisode?.textKk}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🇷🇺</span>
                  <span className="text-sm font-bold text-gray-600">РУССКИЙ</span>
                </div>
                <p className="text-base text-gray-700 italic">
                  {currentEpisode?.textRu}
                </p>
              </div>
            </div>
          )}

          {/* Question */}
          {hasQuestion && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                ❓ {currentQuestion?.questionText}
              </h3>

              <div className="space-y-3">
                {currentQuestion?.answers?.map((answer) => {
                  const isSelected = selectedAnswer?.id === answer.id;
                  const showCorrect = showResult && answer.isCorrect;
                  const showWrong = showResult && isSelected && !answer.isCorrect;

                  return (
                    <button
                      key={answer.id}
                      onClick={() => !showResult && handleAnswerSelect(answer)}
                      disabled={showResult}
                      className={`
                        w-full text-left p-4 rounded-xl border-2 transition
                        ${showCorrect ? 'bg-green-100 border-green-500' : ''}
                        ${showWrong ? 'bg-red-100 border-red-500' : ''}
                        ${isSelected && !showResult ? 'bg-pink-100 border-pink-400' : ''}
                        ${!isSelected && !showResult && !showCorrect ? 'bg-white border-gray-200 hover:border-pink-300' : ''}
                        ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{answer.answerText}</span>
                        {showCorrect && <span className="text-green-600 text-xl">✓</span>}
                        {showWrong && <span className="text-red-600 text-xl">✗</span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {!showResult && (
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selectedAnswer}
                  className={`
                    w-full mt-4 py-4 rounded-xl font-bold text-lg transition
                    ${selectedAnswer
                      ? 'bg-pink-400 text-white hover:bg-pink-500'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  Проверить
                </button>
              )}

              {showResult && (
                <button
                  onClick={handleNextEpisode}
                  className="w-full mt-4 bg-pink-400 text-white py-4 rounded-xl font-bold text-lg hover:bg-pink-500 transition"
                >
                  {currentEpisodeIndex < podcast.chapters.length - 1 ? 'Следующий эпизод →' : 'Завершить'}
                </button>
              )}
            </div>
          )}

          {!hasQuestion && (
            <button
              onClick={handleNextEpisode}
              className="w-full mt-6 bg-pink-400 text-white py-4 rounded-xl font-bold text-lg hover:bg-pink-500 transition"
            >
              {currentEpisodeIndex < podcast.chapters.length - 1 ? 'Следующий эпизод →' : 'Завершить'}
            </button>
          )}
        </div>

        {/* Overall Progress */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
            <span>Прогресс подкаста</span>
            <span>{Math.round(((currentEpisodeIndex + 1) / podcast.chapters.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500"
              style={{ width: `${((currentEpisodeIndex + 1) / podcast.chapters.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}