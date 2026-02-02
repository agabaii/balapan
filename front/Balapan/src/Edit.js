import { useState } from 'react';
import { ChevronDown, Save, X } from 'lucide-react';

export default function EditProfile() {
  const [name, setName] = useState('Пенелопа Хард');
  const [chickName, setChickName] = useState('Балапан');
  const [language, setLanguage] = useState('Русский язык');
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const languages = ['Русский язык', 'Қазақ тілі', 'English'];

  const handleSave = () => {
    // Save logic here
    window.location.href = '/profile';
  };

  const handleCancel = () => {
    window.location.href = '/profile';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFECF' }}>
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center">
        <a href="/">
          <img 
            src="/fav.png" 
            className="h-18 cursor-pointer hover:opacity-80 transition"
            alt="Balapan Logo"
          />
        </a>
        <div className="flex items-center gap-4">
          <a href="/lessons" className="text-base font-bold text-gray-700 hover:text-gray-900">
            Уроки
          </a>
          <img 
            src="/ava.jpg" 
            className="w-10 h-10 rounded-full object-cover cursor-pointer"
            alt="Avatar"
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-gray-900">Редактировать профиль</h1>
          <button 
            onClick={handleCancel}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Profile Picture */}
        <div className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
          <div className="flex items-center gap-6">
            <img 
              src="/ava.jpg" 
              className="w-24 h-24 rounded-full object-cover"
              alt="Avatar"
            />
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Фото профиля</h3>
              <button 
                className="px-6 py-2 rounded-xl font-bold text-sm transition hover:translate-y-[-2px]"
                style={{ 
                  backgroundColor: '#FFDAEC', 
                  color: '#000000',
                  boxShadow: '0 4px 0 0 #FF8EC4'
                }}
              >
                Загрузить фото
              </button>
            </div>
          </div>
        </div>

        {/* Name Field */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <label className="block text-sm font-bold text-gray-700 mb-3">
            Ваше имя
          </label>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-base font-medium text-gray-900 focus:outline-none focus:ring-2 transition"
            style={{ 
              backgroundColor: '#FFFECF', 
              border: '2px solid #E5E7EB',
              focusRing: '#FFDAEC'
            }}
            placeholder="Введите ваше имя"
          />
        </div>

        {/* Chick Name Field */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <label className="block text-sm font-bold text-gray-700 mb-3">
            Имя птенца
          </label>
          <input 
            type="text"
            value={chickName}
            onChange={(e) => setChickName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-base font-medium text-gray-900 focus:outline-none focus:ring-2 transition"
            style={{ 
              backgroundColor: '#FFFECF', 
              border: '2px solid #E5E7EB'
            }}
            placeholder="Введите имя птенца"
          />
          <p className="text-xs text-gray-500 mt-2">💡 Выберите милое имя для вашего птенца!</p>
        </div>

        {/* Language Selector */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <label className="block text-sm font-bold text-gray-700 mb-3">
            Язык обучения
          </label>
          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="w-full px-4 py-3 rounded-xl text-base font-medium text-gray-900 flex items-center justify-between focus:outline-none focus:ring-2 transition"
              style={{ 
                backgroundColor: '#FFFECF', 
                border: '2px solid #E5E7EB'
              }}
            >
              <span>{language}</span>
              <ChevronDown 
                size={20} 
                className={`text-gray-600 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`}
              />
            </button>
            
            {isLanguageOpen && (
              <div 
                className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-lg overflow-hidden z-10"
                style={{ backgroundColor: '#FFFFFF', border: '2px solid #E5E7EB' }}
              >
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setIsLanguageOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-base font-medium transition hover:bg-opacity-50 ${
                      language === lang ? 'font-bold' : ''
                    }`}
                    style={{ 
                      backgroundColor: language === lang ? '#FFDAEC' : 'transparent',
                      color: '#000000'
                    }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">🌍 Язык, который вы хотите изучать</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button 
            onClick={handleCancel}
            className="flex-1 py-4 rounded-xl font-black text-base transition hover:bg-gray-100"
            style={{ 
              backgroundColor: '#FFFFFF', 
              color: '#000000',
              border: '2px solid #E5E7EB'
            }}
          >
            Отмена
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 py-4 rounded-xl font-black text-base transition hover:translate-y-[-2px] flex items-center justify-center gap-2"
            style={{ 
              backgroundColor: '#FFDAEC', 
              color: '#000000',
              boxShadow: '0 4px 0 0 #FF8EC4'
            }}
          >
            <Save size={20} />
            Сохранить
          </button>
        </div>

        {/* Chick Illustration */}
        <div className="mt-8 flex justify-center">
          <img 
            src="/kni.png" 
            className="w-48 h-48 object-contain opacity-80"
            alt="Chick"
          />
        </div>
      </div>
    </div>
  );
}