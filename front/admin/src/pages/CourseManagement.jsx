import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen,
    RefreshCw,
    Plus,
    Search,
    ChevronRight,
    FileJson,
    Edit2,
    Trash2,
    Layers
} from 'lucide-react';
import { courseApi } from '../api';

const CourseManagement = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isReseeding, setIsReseeding] = useState(false);
    const [error, setError] = useState(null);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await courseApi.getAll();
            setCourses(res.data);
        } catch (err) {
            console.error("Error fetching courses", err);
            setError("Не удалось загрузить курсы. Проверьте, запущен ли бэкенд на порту 8081.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleReseed = async (force = false) => {
        if (!force && !window.confirm("Это обновит курсы из JSON файлов. Продолжить?")) return;

        try {
            setIsReseeding(true);
            await courseApi.reseed(force);
            fetchCourses();
            alert("Курсы успешно обновлены из JSON!");
        } catch (error) {
            alert("Ошибка при обновлении");
        } finally {
            setIsReseeding(false);
        }
    };

    const handleAddCourse = async () => {
        alert("Для добавления нового курса требуется выбор целевого языка из базы данных. Пожалуйста, используйте инструмент 'Обновить из JSON' или дождитесь продвинутого редактора.");
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1>Управление курсами</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Управление языками, секциями и уроками</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        className="btn btn-ghost"
                        onClick={() => handleReseed(false)}
                        disabled={isReseeding}
                    >
                        <RefreshCw size={18} className={isReseeding ? 'spin' : ''} />
                        {isReseeding ? 'Обновление...' : 'Обновить из JSON'}
                    </button>
                    <button className="btn btn-primary" onClick={handleAddCourse}>
                        <Plus size={18} /> Добавить курс
                    </button>
                </div>
            </div>

            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '24px' }}>
                <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700 }}>{courses.length}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ВСЕГО КУРСОВ</div>
                </div>
                <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700 }}>{courses.reduce((acc, c) => acc + (c.levels?.length || 0), 0)}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ВСЕГО УРОВНЕЙ</div>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>Все курсы</h3>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input type="text" placeholder="Поиск курсов..." style={{ paddingLeft: '34px', fontSize: '14px' }} />
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>Загрузка курсов...</div>
                ) : error ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--danger)' }}>{error}</div>
                ) : courses.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>Курсы не найдены. Попробуйте "Обновить из JSON".</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                        {courses.map(course => (
                            <div key={course.id} className="course-card" style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border)',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                transition: 'all 0.3s'
                            }}>
                                <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', background: 'var(--bg-dark)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <BookOpen size={20} color="var(--primary)" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{course.name || `Курс #${course.id}`}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Источник: {course.sourceLanguageCode} | Цель: {course.targetLanguage?.code}</div>
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-ghost"
                                        style={{ padding: '6px' }}
                                        onClick={() => navigate(`/courses/${course.id}`)}
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                                <div style={{ padding: '16px', fontSize: '13px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Секции (Уровни):</span>
                                        <span style={{ fontWeight: 600 }}>{course.levels?.length || 0}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Всего уроков:</span>
                                        <span style={{ fontWeight: 600 }}>{course.levels?.reduce((acc, l) => acc + (l.lessons?.length || 0), 0)}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                        <button
                                            className="btn btn-ghost"
                                            style={{ flex: 1, fontSize: '12px', padding: '8px' }}
                                            onClick={() => navigate(`/courses/${course.id}`)}
                                        >
                                            <Edit2 size={14} style={{ marginRight: '6px' }} /> Изменить
                                        </button>
                                        <button
                                            className="btn btn-ghost"
                                            style={{ flex: 1, fontSize: '12px', padding: '8px' }}
                                            onClick={() => navigate(`/courses/${course.id}`)}
                                        >
                                            <Layers size={14} style={{ marginRight: '6px' }} /> Уровни
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .course-card:hover { transform: translateY(-4px); border-color: var(--primary); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
      `}</style>
        </div>
    );
};

export default CourseManagement;
