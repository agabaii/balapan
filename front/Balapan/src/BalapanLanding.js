import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTranslation } from './translations';

export default function BalapanLanding() {
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedInterfaceLanguage, setSelectedInterfaceLanguage] = useState('ru');

  useEffect(() => {
    const savedLang = localStorage.getItem('interfaceLanguage') || 'ru';
    setSelectedInterfaceLanguage(savedLang);
  }, []);

  const interfaceLanguages = {
    ru: 'Язык сайта: русский',
    kk: 'Сайт тілі: қазақша',
    en: 'Site language: English'
  };

  const t = getTranslation();

  const handleLanguageChange = (langCode) => {
    setSelectedInterfaceLanguage(langCode);
    localStorage.setItem('interfaceLanguage', langCode);
    setIsLanguageDropdownOpen(false);
  };

  const languages = [
    'ИСПАНСКИЙ', 'ФРАНЦУЗСКИЙ', 'НЕМЕЦКИЙ', 'ИТАЛЬЯНСКИЙ',
    'ПОРТУГАЛЬСКИЙ', 'КАЗАХСКИЙ', 'РУССКИЙ'
  ];

  const footerLanguages = [
    'العربية', 'বাংলা', 'Čeština', 'Deutsch', 'Ελληνικά', 'English',
    'Español', 'Français', 'हिंदी', 'Magyar', 'Bahasa Indonesia', 'Italiano',
    '日本語', '한국어', 'Nederlands', 'Polski', 'Português', 'Română',
    'Русский', 'ภาษาไทย', 'Tagalog', 'Türkçe', 'Українською', 'Tiếng Việt',
    '中文'
  ];

  const scrollLanguages = (direction) => {
    if (direction === 'left' && currentLanguageIndex > 0) {
      setCurrentLanguageIndex(currentLanguageIndex - 1);
    } else if (direction === 'right' && currentLanguageIndex < languages.length - 4) {
      setCurrentLanguageIndex(currentLanguageIndex + 1);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFECF' }}>
      <header className="px-6 py-4 flex justify-between items-center">
        <Link to="/">
          <img
            src="/fav.png"
            className="h-18 cursor-pointer hover:opacity-80 transition"
            alt="Balapan Logo"
          />
        </Link>
        <div className="relative">
          <button
            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            className="flex items-center gap-2 mr-8 hover:opacity-80 transition"
          >
            <span className="text-base font-semibold">{interfaceLanguages[selectedInterfaceLanguage]}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isLanguageDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 mr-8 bg-white rounded-lg shadow-lg border-2 border-pink-200 overflow-hidden z-10">
              <button
                onClick={() => handleLanguageChange('ru')}
                className={`w-full px-6 py-3 text-left hover:bg-pink-50 transition font-medium border-b border-pink-100 ${selectedInterfaceLanguage === 'ru' ? 'bg-pink-100 text-pink-600' : 'text-gray-800'
                  }`}
              >
                Русский
              </button>
              <button
                onClick={() => handleLanguageChange('kk')}
                className={`w-full px-6 py-3 text-left hover:bg-pink-50 transition font-medium border-b border-pink-100 ${selectedInterfaceLanguage === 'kk' ? 'bg-pink-100 text-pink-600' : 'text-gray-800'
                  }`}
              >
                Қазақ тілі
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`w-full px-6 py-3 text-left hover:bg-pink-50 transition font-medium ${selectedInterfaceLanguage === 'en' ? 'bg-pink-100 text-pink-600' : 'text-gray-800'
                  }`}
              >
                English language
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-center px-8 py-16 gap-12">
        <div className="w-196 h-196 relative">
          <img
            src="/balapan.png"
            alt="Цыпленок в яйце"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex flex-col items-center gap-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
            {t.hero}
          </h2>
          <div className="flex flex-col gap-4 w-full max-w-md">
            <Link to="/register" className="bg-pink-300 hover:bg-pink-400 text-white font-bold py-3 px-8 rounded-2xl transition shadow-[0_4px_0_0_#C54554] text-center">
              {t.startLearning}
            </Link>
            <Link to="/login" className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-2xl transition shadow-[0_4px_0_0_#042C60] text-center">
              {t.haveAccount}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-6 px-4 border-y border-gray-200">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-8">
          <button
            onClick={() => scrollLanguages('left')}
            className="p-2 hover:bg-gray-100 rounded-full transition flex-shrink-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex gap-6 overflow-hidden w-[700px] justify-center transition-all duration-300">
            {[0, 1, 2, 3, 4].map((offset) => {
              const index = (currentLanguageIndex + offset) % languages.length;
              const lang = languages[index];
              return (
                <button
                  key={`${lang}-${offset}`}
                  className={`text-base font-bold whitespace-nowrap px-5 py-2 rounded hover:bg-gray-100 transition-all duration-300 ${lang === 'КАЗАХСКИЙ' ? 'text-pink-500' : 'text-gray-700'
                    }`}
                >
                  {lang}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => scrollLanguages('right')}
            className="p-2 hover:bg-gray-100 rounded-full transition flex-shrink-0"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-80 h-80">
              <img
                src="/ptenez.png"
                alt="Цыпленок"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                {t.aboutTitle}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t.aboutText}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-8 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-12">
            {t.howTitle}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-lg transition">
              <div className="w-32 h-32 mb-6">
                <img
                  src="/yzo.png"
                  alt="Яйцо"
                  className="w-full h-full object-contain"
                />
              </div>
              <h4 className="text-lg font-semibold text-gray-800">{t.step1}</h4>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-lg transition">
              <div className="w-32 h-32 mb-6">
                <img
                  src="/kniga.png"
                  alt="Цыпленок с книгой"
                  className="w-full h-full object-contain"
                />
              </div>
              <h4 className="text-lg font-semibold text-gray-800">{t.step2}</h4>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-lg transition">
              <div className="w-32 h-32 mb-6">
                <img
                  src="/pusk (2).png"
                  alt="Цыпленок в шапочке"
                  className="w-full h-full object-contain"
                />
              </div>
              <h4 className="text-lg font-semibold text-gray-800">{t.step3}</h4>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-yellow-100 py-12">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-8">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
            {t.ctaTitle}
          </h3>
          <a href="/register">
            <button className="bg-pink-300 hover:bg-pink-400 text-white font-bold py-3 px-8 rounded-2xl transition shadow-[0_4px_0_0_#C54554]">
              {t.ctaButton}
            </button>
          </a>
        </div>
      </section>

      <footer className="bg-yellow-100 px-8 py-12 border-t border-yellow-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold text-gray-800 mb-4">{t.footerAbout}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-700 hover:text-gray-900">{t.footerCourses}</a></li>
                <li><a href="#" className="text-gray-700 hover:text-gray-900">{t.footerSupport}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-4">{t.footerProducts}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-700 hover:text-gray-900">{t.footerPodcasts}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-4">{t.footerHelp}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-700 hover:text-gray-900">{t.footerFaq}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-4">{t.footerPrivacy}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-700 hover:text-gray-900">{t.footerPrivacy}</a></li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-4">{t.footerLanguages}</h4>
            <div className="flex flex-wrap gap-3">
              {footerLanguages.map((lang, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-sm text-gray-700 hover:text-gray-900 hover:underline"
                >
                  {lang}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}