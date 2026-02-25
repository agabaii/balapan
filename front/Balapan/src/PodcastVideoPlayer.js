import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle } from 'lucide-react';
import { podcastsData } from './data/podcastsData';
import { getTranslation } from './translations';
import { useApp } from './context/AppContext';

export default function PodcastVideoPlayer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { interfaceLang } = useApp();
    const t = getTranslation(interfaceLang);
    const [video, setVideo] = useState(null);
    const [completed, setCompleted] = useState(false);
    const [watchTime, setWatchTime] = useState(0);
    const watchTimerRef = useRef(null);

    useEffect(() => {
        const podcastId = parseInt(id);
        const foundVideo = podcastsData.find(p => p.id === podcastId);

        if (foundVideo) {
            setVideo(foundVideo);
            startWatchTimer();
        }

        return () => {
            if (watchTimerRef.current) {
                clearInterval(watchTimerRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const startWatchTimer = () => {
        watchTimerRef.current = setInterval(() => {
            setWatchTime(prev => prev + 1);
        }, 1000);
    };

    const handleComplete = () => {
        if (watchTimerRef.current) {
            clearInterval(watchTimerRef.current);
        }
        setCompleted(true);
        // Optional: Save progress to localStorage if needed
    };

    if (completed) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#FFFECF' }}>
                <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-lg">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {interfaceLang === 'en' ? 'Podcast completed!' : interfaceLang === 'kk' ? 'Подкаст аяқталды!' : 'Подкаст прослушан!'}
                    </h2>
                    <p className="text-lg text-gray-600 mb-6">
                        {video?.title}
                    </p>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
                        <div className="text-5xl font-bold text-pink-400 mb-2">
                            <CheckCircle className="w-16 h-16 mx-auto" />
                        </div>
                        <div className="text-gray-700">
                            {interfaceLang === 'en' ? 'Time' : interfaceLang === 'kk' ? 'Уақыт' : 'Время'}: {Math.floor(watchTime / 60)} {t.minutes} {watchTime % 60} {interfaceLang === 'en' ? 'sec' : interfaceLang === 'kk' ? 'сек' : 'сек'}
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-6 text-yellow-500">
                        <span className="text-2xl">⭐</span>
                        <span className="text-2xl font-bold">+{video?.xpReward} XP</span>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/podcasts')}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition"
                        >
                            {t.backToList}
                        </button>
                        <button
                            onClick={() => navigate('/profile')}
                            className="flex-1 bg-pink-400 text-white py-3 rounded-xl font-medium hover:bg-pink-500 transition"
                        >
                            {t.profile}
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
                    <p className="text-gray-700 mb-4">{interfaceLang === 'en' ? 'Podcast not found' : interfaceLang === 'kk' ? 'Подкаст табылмады' : 'Подкаст не найден'}</p>
                    <button
                        onClick={() => navigate('/podcasts')}
                        className="bg-pink-400 text-white px-6 py-2 rounded-lg hover:bg-pink-500"
                    >
                        {t.back}
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
                        navigate('/podcasts');
                    }}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="font-medium">{t.back}</span>
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
                    <p className="text-lg text-gray-600 mb-4">
                        {localStorage.getItem('selectedLanguage') === 'kk' ? video.titleKk : video.title}
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm">
                        <span className="text-gray-600">⏱️ {video.duration}</span>
                        <span className="text-orange-500 font-bold">⭐ +{video.xpReward} XP</span>
                    </div>
                </div>

                {/* YouTube Player */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6 border-4 border-white">
                    <div className="relative" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-sm border border-white/50">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">📝 {t.descriptionLabel}</h3>
                    <p className="text-gray-700 leading-relaxed">{video.description}</p>
                </div>

                {/* Complete Button */}
                <div className="flex justify-center pb-8">
                    <button
                        onClick={handleComplete}
                        className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition active:scale-95"
                    >
                        {t.iListened}
                    </button>
                </div>
            </div>
        </div>
    );
}
