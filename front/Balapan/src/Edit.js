import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, Save, X, User, Sparkles,
  Palette, Scissors, Eye, Smile, Shirt
} from 'lucide-react';
import apiService from './services/api';
import Avatar from './components/Avatar';
import TopBar from './TopBar';

export default function EditProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'avatar'

  // Profile state
  const [username, setUsername] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState('ru');

  // Avatar state
  const [avatar, setAvatar] = useState({
    skinColor: '#FFDBAC',
    hairStyle: 'short',
    hairColor: '#4B2C20',
    eyeStyle: 'normal',
    mouthStyle: 'smile',
    clothingColor: '#FF8EC4',
    accessory: 'none'
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const result = await apiService.getUserProfile();
    if (result.success) {
      setUserData(result.user);
      setUsername(result.user.username);
      setNativeLanguage(result.user.nativeLanguage || 'ru');

      if (result.user.avatarData) {
        try {
          setAvatar(JSON.parse(result.user.avatarData));
        } catch (e) {
          console.error("Failed to parse avatar data");
        }
      }
    }
    setLoading(false);
  };

  const handleSave = async () => {
    const result = await apiService.updateProfile({
      username,
      nativeLanguage,
      avatarData: JSON.stringify(avatar)
    });

    if (result.success) {
      window.location.href = '/profile';
    } else {
      alert("Ошибка при сохранении");
    }
  };

  if (loading) return null;

  const skinColors = ['#FFDBAC', '#F1C27D', '#E0AC69', '#8D5524', '#C68642'];
  const hairColors = ['#4B2C20', '#2B1608', '#8B4513', '#D2B48C', '#E6BE8A', '#FFB7C1'];
  const clothingColors = ['#FF8EC4', '#A0A0FF', '#FFFECF', '#C14D7D', '#7A7AFF', '#58CC02'];
  const hairStyles = ['short', 'long', 'spiky', 'buzz'];
  const eyeStyles = ['normal', 'blink', 'cool'];
  const mouthStyles = ['smile', 'flat', 'surprised'];

  return (
    <div className="min-h-screen bg-[#FFFECF]">
      <TopBar userData={userData} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => window.location.href = '/profile'}
            className="flex items-center gap-2 text-[#C14D7D] font-black uppercase tracking-widest text-xs hover:opacity-70 transition"
          >
            <ChevronLeft size={20} /> назад
          </button>
          <h1 className="text-3xl font-black text-[#C14D7D] uppercase tracking-tight">Редактор</h1>
          <button
            onClick={handleSave}
            className="bg-[#A0A0FF] text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_4px_0_0_#7A7AFF] hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
          >
            <Save size={18} /> Сохранить
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Avatar Preview */}
          <div className="bg-white rounded-[2.5rem] p-8 border-2 border-[#F9ADD1] shadow-[0_8px_0_0_#F9ADD1] flex flex-col items-center justify-center">
            <div className="bg-[#FFF4F9] rounded-full p-4 mb-6 relative border-4 border-[#FFDAEC]">
              <Avatar size={200} {...avatar} />
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white p-3 rounded-full shadow-lg animate-bounce-slow">
                <Sparkles size={24} fill="white" />
              </div>
            </div>
            <p className="text-[#F9ADD1] font-black uppercase tracking-widest text-xs">Ваш персонаж</p>
          </div>

          {/* Tabs and Controls */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex bg-white rounded-2xl p-1 border-2 border-gray-100 shadow-sm">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-[#FFDAEC] text-[#C14D7D]' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <User size={16} className="inline mr-2" /> Профиль
              </button>
              <button
                onClick={() => setActiveTab('avatar')}
                className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'avatar' ? 'bg-[#FFDAEC] text-[#C14D7D]' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Palette size={16} className="inline mr-2" /> Персонаж
              </button>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border-2 border-gray-100 shadow-sm">
              {activeTab === 'profile' ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Имя пользователя</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-700 focus:border-[#A0A0FF] focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Язык интерфейса</label>
                    <select
                      value={nativeLanguage}
                      onChange={(e) => setNativeLanguage(e.target.value)}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-700 focus:border-[#A0A0FF] focus:outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="ru">Русский</option>
                      <option value="kk">Қазақша</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {/* Skin Color */}
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4"><Palette size={14} /> Цвет кожи</label>
                    <div className="flex flex-wrap gap-3">
                      {skinColors.map(color => (
                        <button
                          key={color}
                          onClick={() => setAvatar({ ...avatar, skinColor: color })}
                          className={`w-10 h-10 rounded-full border-2 transition-transform active:scale-95 ${avatar.skinColor === color ? 'border-[#C14D7D] scale-110 shadow-md' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Hair Style */}
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4"><Scissors size={14} /> Прическа</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {hairStyles.map(style => (
                        <button
                          key={style}
                          onClick={() => setAvatar({ ...avatar, hairStyle: style })}
                          className={`py-3 px-4 rounded-xl border-2 font-black text-[10px] uppercase tracking-tighter transition-all ${avatar.hairStyle === style ? 'border-[#F9ADD1] bg-[#FFE0F0] text-[#C14D7D]' : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'}`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hair Color */}
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4"><Palette size={14} /> Цвет волос</label>
                    <div className="flex flex-wrap gap-3">
                      {hairColors.map(color => (
                        <button
                          key={color}
                          onClick={() => setAvatar({ ...avatar, hairColor: color })}
                          className={`w-10 h-10 rounded-full border-2 transition-transform active:scale-95 ${avatar.hairColor === color ? 'border-[#C14D7D] scale-110 shadow-md' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Eye Style */}
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4"><Eye size={14} /> Глаза</label>
                    <div className="grid grid-cols-3 gap-3">
                      {eyeStyles.map(style => (
                        <button
                          key={style}
                          onClick={() => setAvatar({ ...avatar, eyeStyle: style })}
                          className={`py-3 px-4 rounded-xl border-2 font-black text-[10px] uppercase tracking-tighter transition-all ${avatar.eyeStyle === style ? 'border-[#A0A0FF] bg-blue-50 text-[#7A7AFF]' : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'}`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clothing Color */}
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4"><Shirt size={14} /> Цвет одежды</label>
                    <div className="flex flex-wrap gap-3">
                      {clothingColors.map(color => (
                        <button
                          key={color}
                          onClick={() => setAvatar({ ...avatar, clothingColor: color })}
                          className={`w-10 h-10 rounded-xl border-2 transition-transform active:scale-95 ${avatar.clothingColor === color ? 'border-[#C14D7D] scale-110 shadow-md' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Accessories */}
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4"><Sparkles size={14} /> Аксессуары</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <button
                        onClick={() => setAvatar({ ...avatar, accessory: 'none' })}
                        className={`py-3 px-4 rounded-xl border-2 font-black text-[10px] uppercase tracking-tighter transition-all ${avatar.accessory === 'none' ? 'border-gray-300 bg-gray-100 text-gray-600' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
                      >
                        Нет
                      </button>
                      <button
                        onClick={() => setAvatar({ ...avatar, accessory: 'glasses' })}
                        className={`py-3 px-4 rounded-xl border-2 font-black text-[10px] uppercase tracking-tighter transition-all ${avatar.accessory === 'glasses' ? 'border-[#A0A0FF] bg-blue-50 text-[#7A7AFF]' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
                      >
                        Очки
                      </button>

                      {userData?.unlockedItems?.includes('legendary_crown') && (
                        <button
                          onClick={() => setAvatar({ ...avatar, accessory: 'crown' })}
                          className={`py-3 px-4 rounded-xl border-2 font-black text-[10px] uppercase tracking-tighter transition-all ${avatar.accessory === 'crown' ? 'border-yellow-400 bg-yellow-50 text-yellow-600 shadow-sm outline outline-1 outline-yellow-400' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
                        >
                          👑 Корона
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f9f9f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #FFDAEC; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #F9ADD1; }
      `}} />
    </div>
  );
}