import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiService from './services/api';
import { Headphones, Play, Clock, Star, Home } from 'lucide-react';
import { podcastsData } from './data/podcastsData';
import { getTranslation } from './translations';
import { useApp } from './context/AppContext';
import TopBar from './TopBar';

export default function Podcasts() {
  const navigate = useNavigate();
  const { interfaceLang, currentCourse } = useApp();
  const t = getTranslation(interfaceLang);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="min-h-screen flex items-center justify-center bg-[#FFFECF]">
        <div className="text-center group">
          <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4 box-content"></div>
          <p className="text-gray-700 font-bold text-lg animate-pulse">{t.loading}</p>
        </div>
      </div>
    );
  }

  const selectedLanguage = currentCourse?.languageCode || localStorage.getItem('selectedLanguage') || 'kk';

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFECF]">
      <TopBar userData={userData} />

      <div className="flex flex-1 max-w-6xl mx-auto w-full">
        {/* Sidebar Nav */}
        <aside className="w-64 fixed left-0 top-[80px] bottom-0 p-6 hidden lg:flex flex-col gap-3">
          <Link
            to="/lesson"
            className="flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-lg transition duration-200 text-gray-400 hover:bg-white/50 uppercase italic"
          >
            <Home size={24} strokeWidth={3} />
            <span>{t.navHome}</span>
          </Link>
          <Link
            to="/podcasts"
            className="flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-lg transition duration-200 bg-[#FFE0F0] text-[#F9ADD1] shadow-[0_4px_0_0_#F9ADD1] uppercase italic"
          >
            <Headphones size={24} strokeWidth={3} />
            <span>{t.navPodcasts}</span>
          </Link>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 px-4 py-8 flex flex-col items-center">
          <div className="w-full max-w-[800px]">
            <div className="rounded-3xl p-8 mb-12 bg-white border-4 border-pink-100 shadow-xl relative overflow-hidden group">
              <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition duration-700">
                <Star size={150} fill="#F9ADD1" opacity={0.2} />
              </div>
              <div className="relative z-10 text-center">
                <h2 className="text-4xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                  {t.podcastsTitle}
                </h2>
                <p className="text-lg font-bold text-[#A0A0FF]">
                  {t.podcastsDesc}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
              {podcastsData
                .filter(podcast => podcast.language === selectedLanguage)
                .map((podcast) => (
                  <Link
                    key={podcast.id}
                    to={`/podcast-video/${podcast.id}`}
                    className="group bg-white rounded-[2rem] p-5 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border-4 border-transparent hover:border-pink-200"
                  >
                    <div className="aspect-video rounded-2xl overflow-hidden mb-5 bg-gray-100 relative shadow-inner">
                      <img
                        src={`https://img.youtube.com/vi/${podcast.youtubeId}/maxresdefault.jpg`}
                        alt={podcast.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                        onError={(e) => {
                          e.target.src = `https://img.youtube.com/vi/${podcast.youtubeId}/mqdefault.jpg`;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-2xl transform scale-0 group-hover:scale-100 transition duration-300">
                          <Play className="w-7 h-7 text-pink-500 ml-1" fill="currentColor" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-black px-3 py-1.5 rounded-xl border border-white/20">
                        {podcast.duration}
                      </div>
                    </div>

                    <div className="px-1">
                      <h3 className="font-black text-gray-900 text-xl mb-2 line-clamp-1 group-hover:text-pink-500 transition">
                        {podcast.title}
                      </h3>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-[#A0A0FF] rounded-xl font-bold text-sm">
                          <Clock size={16} strokeWidth={3} />
                          <span>{parseInt(podcast.duration)} {t.minutes}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-400 rounded-xl font-black text-sm border-2 border-orange-100/50">
                          <Star size={16} fill="currentColor" />
                          <span>+{podcast.xpReward} XP</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>

            {podcastsData.filter(p => p.language === selectedLanguage).length === 0 && (
              <div className="text-center py-20 bg-white/50 rounded-[3rem] border-4 border-dashed border-pink-200">
                <div className="text-8xl mb-6 grayscale opacity-30">🎵</div>
                <h3 className="text-2xl font-black text-gray-400 uppercase tracking-widest px-6">
                  {interfaceLang === 'kk' ? 'Бұл тілде подкасттар әлі жоқ' : interfaceLang === 'en' ? 'No podcasts for this language yet' : 'Для этого языка пока нет подкастов'}
                </h3>
              </div>
            )}
          </div>
        </main>

        {/* Sidebar Info (Right Side) */}
        <aside className="w-80 p-6 hidden xl:flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 border-2 border-pink-200 shadow-sm sticky top-[100px]">
            <div className="flex items-center gap-4 mb-4">
              <img src="/kni.png" className="w-16 h-16 object-contain" alt="Character" />
              <div>
                <h3 className="font-black text-gray-800 leading-tight">Слушай везде!</h3>
                <p className="text-sm text-gray-500 font-bold">Подкасты помогают учить быстрее.</p>
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-100">
              <p className="text-xs font-bold text-yellow-600 leading-relaxed text-center">
                Слушайте носителей языка, чтобы привыкнуть к правильному произношению и интонации.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        main, .grid > a { animation: fadeIn 0.4s ease-out forwards; }
      `}} />
    </div>
  );
}
