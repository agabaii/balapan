// src/context/AppContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    // ── Interface Language ──────────────────────────────────────────
    const [interfaceLang, setInterfaceLangState] = useState(
        () => localStorage.getItem('interfaceLanguage') || 'ru'
    );

    const setInterfaceLang = (lang) => {
        localStorage.setItem('interfaceLanguage', lang);
        setInterfaceLangState(lang);
    };

    // ── Active Courses (multi-course support) ───────────────────────
    // activeCourses: array of { id, languageCode, title, flag }
    const [activeCourses, setActiveCourses] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('activeCourses') || '[]');
        } catch { return []; }
    });

    // currentCourseId: which course is currently "focused"
    const [currentCourseId, setCurrentCourseIdState] = useState(
        () => localStorage.getItem('selectedCourseId') || null
    );

    const setCurrentCourseId = (id) => {
        localStorage.setItem('selectedCourseId', id);
        setCurrentCourseIdState(id);
    };

    const currentCourse = activeCourses.find(c => String(c.id) === String(currentCourseId)) || activeCourses[0] || null;

    // Add a course to the active list and switch to it
    const addCourse = useCallback((course) => {
        setActiveCourses(prev => {
            const exists = prev.find(c => c.id === course.id);
            const updated = exists ? prev : [...prev, course];
            localStorage.setItem('activeCourses', JSON.stringify(updated));
            return updated;
        });
        setCurrentCourseId(course.id);
    }, []);

    // Remove a course from active list
    const removeCourse = useCallback((courseId) => {
        setActiveCourses(prev => {
            const updated = prev.filter(c => c.id !== courseId);
            localStorage.setItem('activeCourses', JSON.stringify(updated));
            // If we removed the active course, switch to first remaining
            if (String(currentCourseId) === String(courseId) && updated.length > 0) {
                setCurrentCourseId(updated[0].id);
            }
            return updated;
        });
    }, [currentCourseId]);

    // Switch to a course that is already active
    const switchCourse = useCallback((courseId) => {
        setCurrentCourseId(courseId);
    }, []);

    // ── Language flag/name map ──────────────────────────────────────
    const LANG_META = {
        kk: { flag: '🇰🇿', name: { ru: 'Казахский', kk: 'Қазақша', en: 'Kazakh' } },
        ru: { flag: '🇷🇺', name: { ru: 'Русский', kk: 'Орысша', en: 'Russian' } },
        en: { flag: '🇺🇸', name: { ru: 'Английский', kk: 'Ағылшынша', en: 'English' } },
    };

    const INTERFACE_LANGS = [
        { code: 'ru', label: 'RU', flag: '🇷🇺' },
        { code: 'kk', label: 'ҚАЗ', flag: '🇰🇿' },
        { code: 'en', label: 'EN', flag: '🇺🇸' },
    ];

    return (
        <AppContext.Provider value={{
            // Interface language
            interfaceLang,
            setInterfaceLang,
            INTERFACE_LANGS,

            // Courses
            activeCourses,
            currentCourseId,
            currentCourse,
            addCourse,
            removeCourse,
            switchCourse,
            LANG_META,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
};
