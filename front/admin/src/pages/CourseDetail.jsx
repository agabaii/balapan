import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Save,
    Plus,
    Trash2,
    Edit3,
    ChevronDown,
    ChevronUp,
    BookOpen,
    Video,
    FileText,
    Layers,
    Check
} from 'lucide-react';
import { courseApi } from '../api';

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedLevels, setExpandedLevels] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const fetchCourse = async () => {
        try {
            setLoading(true);
            const res = await courseApi.getById(id);
            setCourse(res.data);
        } catch (err) {
            setError("Не удалось загрузить данные курса. Бэкенд может быть отключен или ID неверен.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, [id]);

    const toggleLevel = (levelId) => {
        setExpandedLevels(prev => ({
            ...prev,
            [levelId]: !prev[levelId]
        }));
    };

    const handleSaveCourse = async () => {
        try {
            setIsSaving(true);
            await courseApi.update(id, {
                name: course.name,
                languageCode: course.languageCode,
                sourceLanguageCode: course.sourceLanguageCode
            });
            alert("Свойства курса успешно сохранены!");
        } catch (err) {
            alert("Не удалось сохранить свойства курса.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddLevel = async () => {
        const title = prompt("Введите название новой секции:");
        if (!title) return;

        try {
            const nextNum = (course.levels?.length || 0) + 1;
            await courseApi.addLevel(id, {
                title,
                levelNumber: nextNum
            });
            fetchCourse();
        } catch (err) {
            alert("Не удалось добавить секцию.");
        }
    };

    const handleEditLevel = async (level) => {
        const title = prompt("Редактировать название секции:", level.title);
        if (title === null) return;

        try {
            await courseApi.updateLevel(level.id, {
                title,
                levelNumber: level.levelNumber
            });
            fetchCourse();
        } catch (err) {
            alert("Не удалось обновить секцию.");
        }
    };

    const handleDeleteLevel = async (levelId) => {
        if (!window.confirm("Удалить эту секцию и все её уроки?")) return;
        try {
            await courseApi.deleteLevel(levelId);
            fetchCourse();
        } catch (err) {
            alert("Не удалось удалить.");
        }
    };

    const handleAddLesson = async (levelId) => {
        const title = prompt("Введите название урока:");
        if (!title) return;
        const type = confirm("Это видео-урок? (Отмена для истории)") ? "VIDEO" : "STORY";

        try {
            const res = await courseApi.getById(id);
            const level = res.data.levels.find(l => l.id === levelId);
            const nextNum = (level.lessons?.length || 0) + 1;

            await courseApi.addLesson(levelId, {
                title,
                lessonType: type,
                lessonNumber: nextNum
            });
            fetchCourse();
        } catch (err) {
            alert("Не удалось добавить урок.");
        }
    };

    const handleEditLesson = async (e, lesson) => {
        e.stopPropagation();
        const title = prompt("Редактировать название урока:", lesson.title);
        if (title === null) return;

        try {
            await courseApi.updateLesson(lesson.id, {
                title,
                lessonType: lesson.lessonType
            });
            fetchCourse();
        } catch (err) {
            alert("Не удалось обновить урок.");
        }
    };

    const handleDeleteLesson = async (e, lessonId) => {
        e.stopPropagation();
        if (!window.confirm("Удалить этот урок?")) return;
        try {
            await courseApi.deleteLesson(lessonId);
            fetchCourse();
        } catch (err) {
            alert("Не удалось удалить.");
        }
    };

    const handleDeleteCourse = async () => {
        if (!window.confirm("КРИТИЧЕСКИЙ ШАГ: Удалить весь курс целиком? Это действие необратимо.")) return;
        try {
            await courseApi.delete(id);
            navigate('/courses');
        } catch (err) {
            alert("Не удалось удалить курс.");
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Загрузка структуры курса...</div>;
    if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--danger)' }}>{error}</div>;
    if (!course) return <div style={{ padding: '40px', textAlign: 'center' }}>Курс не найден</div>;

    return (
        <div style={{ paddingBottom: '100px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                <button className="btn btn-ghost" onClick={() => navigate('/courses')} style={{ padding: '8px' }}>
                    <ArrowLeft size={24} />
                </button>
                <div style={{ flex: 1 }}>
                    <h1 style={{ marginBottom: '4px' }}>{course.name}</h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Источник: <span style={{ color: 'var(--primary)' }}>{course.sourceLanguageCode}</span> |
                        Цель: <span style={{ color: 'var(--primary)' }}>{course.targetLanguage?.name} ({course.targetLanguage?.code})</span>
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-ghost" onClick={handleDeleteCourse} style={{ color: 'var(--danger)' }}>
                        <Trash2 size={18} /> Удалить курс
                    </button>
                    <button className="btn btn-primary" onClick={handleSaveCourse} disabled={isSaving}>
                        <Save size={18} /> {isSaving ? 'Сохранение...' : 'Сохранить свойства'}
                    </button>
                </div>
            </div>

            {/* Course Settings */}
            <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <BookOpen size={20} color="var(--primary)" /> Свойства курса
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 600 }}>Название курса</label>
                        <input
                            type="text"
                            value={course.name}
                            onChange={(e) => setCourse({ ...course, name: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 600 }}>Код языка</label>
                        <input
                            type="text"
                            disabled
                            value={course.languageCode}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 600 }}>Язык обучения (Источник)</label>
                        <input
                            type="text"
                            value={course.sourceLanguageCode}
                            onChange={(e) => setCourse({ ...course, sourceLanguageCode: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Levels / Sections */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Layers size={24} color="var(--primary)" /> Секции и Уровни
                </h2>
                <button className="btn btn-ghost" style={{ background: 'rgba(255,255,255,0.05)' }} onClick={handleAddLevel}>
                    <Plus size={18} /> Добавить секцию
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {course.levels?.sort((a, b) => a.levelNumber - b.levelNumber).map((level) => (
                    <div key={level.id || level.tempId} className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                        {/* Level Header */}
                        <div
                            style={{
                                padding: '20px 24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                cursor: 'pointer',
                                background: expandedLevels[level.id] ? 'rgba(255,255,255,0.03)' : 'transparent'
                            }}
                            onClick={() => toggleLevel(level.id)}
                        >
                            <div style={{
                                width: '36px',
                                height: '36px',
                                background: 'var(--primary)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold'
                            }}>
                                {level.levelNumber}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600 }}>{level.title}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Уроков: {level.lessons?.length || 0}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={(e) => { e.stopPropagation(); handleEditLevel(level); }}>
                                    <Edit3 size={18} />
                                </button>
                                <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={(e) => { e.stopPropagation(); handleDeleteLevel(level.id); }}>
                                    <Trash2 size={18} color="var(--danger)" />
                                </button>
                                {expandedLevels[level.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                        </div>

                        {/* Lessons List (Expanded) */}
                        {expandedLevels[level.id] && (
                            <div style={{ padding: '0 24px 20px 24px', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0 12px' }}>
                                    <h4 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Уроки этой секции</h4>
                                    <button className="btn btn-ghost" style={{ fontSize: '12px', padding: '4px 8px' }} onClick={() => handleAddLesson(level.id)}>
                                        <Plus size={14} /> Добавить урок
                                    </button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {level.lessons?.sort((a, b) => a.lessonNumber - b.lessonNumber).map((lesson, idx) => (
                                        <div
                                            key={lesson.id}
                                            className="glass-card"
                                            style={{
                                                padding: '12px 16px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                background: 'rgba(255,255,255,0.02)',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => navigate(`/lessons/${lesson.id}`)}
                                        >
                                            <div style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: 'bold', width: '20px' }}>{lesson.lessonNumber || idx + 1}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                                {lesson.lessonType === 'VIDEO' ? <Video size={16} color="#ef4444" /> : <FileText size={16} color="#3b82f6" />}
                                                <span style={{ fontSize: '14px' }}>{lesson.title}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className="btn btn-ghost" style={{ padding: '4px' }} onClick={(e) => handleEditLesson(e, lesson)}><Edit3 size={14} /></button>
                                                <button className="btn btn-ghost" style={{ padding: '4px' }} onClick={(e) => handleDeleteLesson(e, lesson.id)}><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    ))}
                                    {(!level.lessons || level.lessons.length === 0) && (
                                        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                                            Уроки не найдены
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div style={{ position: 'fixed', bottom: '2rem', right: '2rem' }}>
                <button className="btn btn-primary" style={{ padding: '16px 32px', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)' }} onClick={handleSaveCourse}>
                    <Check size={20} style={{ marginRight: '8px' }} /> Сохранить изменения
                </button>
            </div>
        </div>
    );
};

export default CourseDetail;
