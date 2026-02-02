import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiService from './services/api';
import { Home, Headphones, Play, Clock, Star, BookOpen } from 'lucide-react';
import { podcastsData } from './data/podcastsData';

export default function Podcasts() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    if (!apiService.isLoggedIn()) {
      navigate('/login');
      return;
    }

    const userResult = await apiService.getUserProfile();
    if (userResult.success) {
      setUserData(userResult.user);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFECF' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-400 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Загрузка...</p>
        </div>
      </div>
    );
  }

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
            style={{ backgroundColor: '#FFE0F0', color: '#F9ADD1' }}
          >
            <Headphones size={20} style={{ color: '#F9ADD1' }} />
            <span>ПОДКАСТЫ</span>
          </Link>
          <Link
            to="/videos"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition"
            style={{ color: '#A0A0FF' }}
          >
            <Play size={20} style={{ color: '#A0A0FF' }} />
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

        <div className="flex-1 px-6 py-6" style={{ backgroundColor: '#FFFECF' }}>
          <div className="rounded-2xl p-6 mb-8 bg-gradient-to-r from-pink-50 to-purple-50 shadow-sm border border-white">
            <div className="text-center">
              <h2 className="text-3xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                Подкасты
              </h2>
              <p className="text-base font-medium text-gray-500">
                Слушайте и учите казахский язык с удовольствием
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {podcastsData.map((podcast) => (
              <Link
                key={podcast.id}
                to={`/podcast-video/${podcast.id}`}
                className="group bg-white rounded-3xl p-4 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 border border-transparent hover:border-pink-200"
              >
                <div className="aspect-video rounded-2xl overflow-hidden mb-4 bg-gray-100 relative">
                  <img
                    src={`https://img.youtube.com/vi/${podcast.youtubeId}/maxresdefault.jpg`}
                    alt={podcast.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      e.target.src = `https://img.youtube.com/vi/${podcast.youtubeId}/mqdefault.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition duration-300">
                      <Play className="w-5 h-5 text-pink-500 ml-1" fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-lg">
                    {podcast.duration}
                  </div>
                </div>

                <div className="px-2">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1 group-hover:text-pink-500 transition">
                    {podcast.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{podcast.titleKk}</p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock size={14} />
                      <span>{parseInt(podcast.duration)} мин</span>
                    </div>
                    <div className="flex items-center gap-1 text-orange-400 font-bold bg-orange-50 px-2 py-1 rounded-lg">
                      <Star size={14} fill="currentColor" />
                      <span>+{podcast.xpReward} XP</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div >
  );
}