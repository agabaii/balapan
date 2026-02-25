// src/TopBar.js — глобальная шапка с переключением языка интерфейса и курсов
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { getTranslation } from './translations';
import Avatar from './components/Avatar';

export default function TopBar({ userData }) {
    const { interfaceLang, setInterfaceLang, INTERFACE_LANGS, activeCourses, currentCourse, switchCourse } = useApp();
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [showCourseMenu, setShowCourseMenu] = useState(false);
    const langRef = useRef(null);
    const courseRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (langRef.current && !langRef.current.contains(e.target)) setShowLangMenu(false);
            if (courseRef.current && !courseRef.current.contains(e.target)) setShowCourseMenu(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const COURSE_FLAGS = { kk: '/kt.jpg', ru: '/rf.jpg', en: '/usa.png' };
    const COURSE_NAMES = {
        kk: { ru: 'Казахский', kk: 'Қазақша', en: 'Kazakh' },
        ru: { ru: 'Русский', kk: 'Орысша', en: 'Russian' },
        en: { ru: 'Английский', kk: 'Ағылшынша', en: 'English' },
    };

    const currentLang = INTERFACE_LANGS.find(l => l.code === interfaceLang) || INTERFACE_LANGS[0];

    // Determine bg color based on location
    const getBgColor = () => {
        const path = location.pathname;
        const yellowPages = ['/shop', '/lesson', '/language', '/profile', '/edit', '/podcasts', '/videos', '/stories', '/vocabulary'];
        if (yellowPages.includes(path) || path.startsWith('/podcast-video/') || path.startsWith('/video/') || path.startsWith('/story/')) {
            return '#FFFECF';
        }
        return 'white';
    };

    return (
        <header className="sticky top-0 z-50 transition-colors duration-300" style={{ backgroundColor: getBgColor() }}>
            <div className="px-6 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link to="/lesson">
                    <img
                        src="/fav.png"
                        style={{ height: '80px' }}
                        className="object-contain cursor-pointer hover:scale-105 active:scale-95 transition transform duration-200"
                        alt="Balapan"
                    />
                </Link>

                <div className="flex items-center gap-4">
                    {/* Streaks & Gems */}
                    {userData && (
                        <div className="flex items-center gap-4 px-5 py-2.5 bg-white rounded-2xl border-2 border-gray-100 shadow-sm">
                            {/* Streak */}
                            <div className="flex items-center gap-2 group cursor-help" title="Ударный режим">
                                <span className="text-xl animate-bounce-slow">🔥</span>
                                <span className="font-black text-orange-500 text-lg">{userData.currentStreak || 0}</span>
                            </div>

                            {/* Gems */}
                            <Link to="/shop" className="flex items-center gap-2 border-l-2 pl-4 border-gray-50 group cursor-pointer hover:scale-105 transition" title="В магазин за покупками! 💎">
                                <span className="text-xl">💎</span>
                                <span className="font-black text-blue-400 text-lg">{userData.gems || 0}</span>
                            </Link>

                            {/* XP - optional small display */}
                            <div className="hidden sm:flex items-center gap-2 border-l-2 pl-4 border-gray-50 group cursor-help" title="Опыт">
                                <span className="text-lg">⭐</span>
                                <span className="font-black text-yellow-500 text-lg">{userData.totalXp || 0}</span>
                            </div>
                        </div>
                    )}

                    {/* Course switcher */}
                    {activeCourses.length > 0 && (
                        <div className="relative" ref={courseRef}>
                            <button
                                onClick={() => setShowCourseMenu(v => !v)}
                                className="flex items-center gap-2.5 bg-white border-2 border-yellow-200 hover:border-yellow-400 rounded-2xl px-4 py-2.5 transition shadow-sm group"
                            >
                                <div className="w-8 h-8 overflow-hidden rounded-lg flex-shrink-0">
                                    <img src={currentCourse ? COURSE_FLAGS[currentCourse.languageCode] : '/fav.png'} alt="flag" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-sm font-black text-gray-700 uppercase tracking-tight">
                                    {currentCourse ? (COURSE_NAMES[currentCourse.languageCode]?.[interfaceLang] || currentCourse.languageCode) : '—'}
                                </span>
                                <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${showCourseMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showCourseMenu && (
                                <div className="absolute right-0 top-full mt-3 bg-white rounded-3xl shadow-2xl border-2 border-gray-50 py-3 min-w-[240px] z-[100] animate-pop">
                                    <p className="text-[10px] text-gray-400 font-black px-5 py-2 uppercase tracking-widest">
                                        {interfaceLang === 'ru' ? 'Активные курсы' : interfaceLang === 'kk' ? 'Белсенді курстар' : 'Active courses'}
                                    </p>
                                    {activeCourses.map(course => (
                                        <button
                                            key={course.id}
                                            onClick={() => {
                                                switchCourse(course.id);
                                                setShowCourseMenu(false);
                                                navigate('/lesson');
                                            }}
                                            className={`w-full text-left px-5 py-3 flex items-center gap-4 hover:bg-yellow-50 transition ${String(currentCourse?.id) === String(course.id) ? 'bg-yellow-50/50' : ''}`}
                                        >
                                            <div className="relative">
                                                <div className="w-8 h-8 overflow-hidden rounded-lg flex-shrink-0">
                                                    <img src={COURSE_FLAGS[course.languageCode]} alt="flag" className="w-full h-full object-cover" />
                                                </div>
                                                {String(currentCourse?.id) === String(course.id) && (
                                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                                                )}
                                            </div>
                                            <span className="text-sm font-black text-gray-800 uppercase tracking-tight">
                                                {COURSE_NAMES[course.languageCode]?.[interfaceLang] || course.languageCode}
                                            </span>
                                        </button>
                                    ))}
                                    <div className="border-t border-gray-50 mt-2 pt-2">
                                        <button
                                            onClick={() => { setShowCourseMenu(false); navigate('/language'); }}
                                            className="w-full text-left px-5 py-3 flex items-center gap-4 hover:bg-pink-50 text-pink-400 font-black text-xs uppercase transition"
                                        >
                                            <span className="text-xl">➕</span>
                                            <span>{interfaceLang === 'ru' ? 'Добавить курс' : interfaceLang === 'kk' ? 'Курс қосу' : 'Add course'}</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Interface Language */}
                    <div className="relative" ref={langRef}>
                        <button
                            onClick={() => setShowLangMenu(v => !v)}
                            className="flex items-center gap-2 bg-white border-2 border-gray-100 hover:border-blue-200 rounded-2xl px-4 py-2.5 transition shadow-sm"
                        >
                            <div className="w-8 h-8 overflow-hidden rounded-lg flex-shrink-0">
                                <img src={currentLang.flag} alt="flag" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-sm font-black text-gray-600 uppercase tracking-tighter">{currentLang.code}</span>
                        </button>

                        {showLangMenu && (
                            <div className="absolute right-0 top-full mt-3 bg-white rounded-3xl shadow-2xl border-2 border-gray-50 py-3 min-w-[180px] z-[100] animate-pop">
                                {INTERFACE_LANGS.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => { setInterfaceLang(lang.code); setShowLangMenu(false); }}
                                        className={`w-full text-left px-6 py-3.5 flex items-center gap-4 hover:bg-blue-50 transition ${interfaceLang === lang.code ? 'bg-blue-50/50' : ''}`}
                                    >
                                        <div className="w-8 h-8 overflow-hidden rounded-lg flex-shrink-0">
                                            <img src={lang.flag} alt="flag" className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-sm font-black text-gray-800 uppercase">{lang.label}</span>
                                        {interfaceLang === lang.code && <span className="ml-auto text-blue-500 font-black">✓</span>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Profile Avatar */}
                    <Link to="/profile">
                        <div className="w-12 h-12 rounded-2xl border-2 border-white bg-[#FFFECF] shadow-md overflow-hidden hover:scale-110 active:scale-90 transition transform flex items-center justify-center p-1">
                            {userData?.avatarData ? (
                                <Avatar size={40} {...JSON.parse(userData.avatarData)} />
                            ) : (
                                <img
                                    src="/ava.jpg"
                                    className="w-full h-full object-cover"
                                    alt="Avatar"
                                />
                            )}
                        </div>
                    </Link>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
              @keyframes pop {
                0% { transform: scale(0.9) translateY(10px); opacity: 0; }
                100% { transform: scale(1) translateY(0); opacity: 1; }
              }
              .animate-pop { animation: pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
            `}} />
        </header>
    );
}
