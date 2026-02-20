// src/TopBar.js — глобальная шапка с переключением языка интерфейса и курсов
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { getTranslation } from './translations';

export default function TopBar({ userData }) {
    const { interfaceLang, setInterfaceLang, INTERFACE_LANGS, activeCourses, currentCourse, switchCourse, setCurrentCourseId } = useApp();
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [showCourseMenu, setShowCourseMenu] = useState(false);
    const langRef = useRef(null);
    const courseRef = useRef(null);
    const navigate = useNavigate();
    const t = getTranslation();

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (langRef.current && !langRef.current.contains(e.target)) setShowLangMenu(false);
            if (courseRef.current && !courseRef.current.contains(e.target)) setShowCourseMenu(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const COURSE_FLAGS = { kk: '🇰🇿', ru: '🇷🇺', en: '🇺🇸' };
    const COURSE_NAMES = {
        kk: { ru: 'Казахский', kk: 'Қазақша', en: 'Kazakh' },
        ru: { ru: 'Русский', kk: 'Орысша', en: 'Russian' },
        en: { ru: 'Английский', kk: 'Ағылшынша', en: 'English' },
    };

    const currentLang = INTERFACE_LANGS.find(l => l.code === interfaceLang) || INTERFACE_LANGS[0];

    return (
        <header className="sticky top-0 z-50" style={{ backgroundColor: 'transparent' }}>
            <div className="px-4 py-2 flex items-center justify-between">
                {/* Logo */}
                <Link to="/lesson">
                    <img src="/fav.png" style={{ height: '80px' }} className="object-contain cursor-pointer hover:opacity-80 transition" alt="Balapan" />
                </Link>

                <div className="flex items-center gap-3">
                    {/* Streak */}
                    {userData && (
                        <div className="flex items-center gap-1 bg-orange-50 rounded-full px-3 py-1.5 border border-orange-200">
                            <span className="text-lg">🔥</span>
                            <span className="font-bold text-orange-500 text-sm">{userData.currentStreak || 0}</span>
                        </div>
                    )}

                    {/* ── Course switcher ─────────────────────── */}
                    {activeCourses.length > 0 && (
                        <div className="relative" ref={courseRef}>
                            <button
                                onClick={() => setShowCourseMenu(v => !v)}
                                className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 rounded-full px-3 py-1.5 transition"
                                title="Переключить курс"
                            >
                                <span className="text-lg">{currentCourse ? COURSE_FLAGS[currentCourse.languageCode] : '📚'}</span>
                                <span className="text-xs font-bold text-gray-700 hidden sm:block">
                                    {currentCourse ? (COURSE_NAMES[currentCourse.languageCode]?.[interfaceLang] || currentCourse.languageCode) : '—'}
                                </span>
                                <svg className={`w-3 h-3 text-gray-500 transition-transform ${showCourseMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showCourseMenu && (
                                <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 min-w-[200px] z-50">
                                    <p className="text-xs text-gray-400 font-semibold px-4 py-1 uppercase tracking-wide">
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
                                            className={`w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition ${String(currentCourse?.id) === String(course.id) ? 'bg-yellow-50' : ''}`}
                                        >
                                            <span className="text-xl">{COURSE_FLAGS[course.languageCode] || '📚'}</span>
                                            <span className="text-sm font-medium text-gray-800">
                                                {COURSE_NAMES[course.languageCode]?.[interfaceLang] || course.languageCode}
                                            </span>
                                            {String(currentCourse?.id) === String(course.id) && (
                                                <span className="ml-auto text-yellow-500 font-bold">✓</span>
                                            )}
                                        </button>
                                    ))}
                                    <div className="border-t border-gray-100 mt-1 pt-1">
                                        <button
                                            onClick={() => { setShowCourseMenu(false); navigate('/language'); }}
                                            className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-pink-50 text-pink-400 font-medium text-sm transition"
                                        >
                                            <span>➕</span>
                                            <span>{interfaceLang === 'ru' ? 'Добавить курс' : interfaceLang === 'kk' ? 'Курс қосу' : 'Add course'}</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Interface language switcher ──────────── */}
                    <div className="relative" ref={langRef}>
                        <button
                            onClick={() => setShowLangMenu(v => !v)}
                            className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-full px-3 py-1.5 transition"
                            title="Язык интерфейса"
                        >
                            <span className="text-base">{currentLang.flag}</span>
                            <span className="text-xs font-bold text-gray-600">{currentLang.label}</span>
                            <svg className={`w-3 h-3 text-gray-400 transition-transform ${showLangMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showLangMenu && (
                            <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 min-w-[140px] z-50">
                                <p className="text-xs text-gray-400 font-semibold px-4 py-1 uppercase tracking-wide">
                                    {interfaceLang === 'ru' ? 'Интерфейс' : interfaceLang === 'kk' ? 'Интерфейс' : 'Interface'}
                                </p>
                                {INTERFACE_LANGS.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => { setInterfaceLang(lang.code); setShowLangMenu(false); }}
                                        className={`w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition ${interfaceLang === lang.code ? 'bg-blue-50' : ''}`}
                                    >
                                        <span className="text-xl">{lang.flag}</span>
                                        <span className="text-sm font-medium text-gray-800">{lang.label}</span>
                                        {interfaceLang === lang.code && <span className="ml-auto text-blue-500 font-bold">✓</span>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Avatar */}
                    <Link to="/profile">
                        <img
                            src="/ava.jpg"
                            className="w-9 h-9 rounded-full object-cover border-2 border-pink-200 hover:border-pink-400 transition cursor-pointer"
                            alt="Avatar"
                        />
                    </Link>
                </div>
            </div>
        </header>
    );
}
