import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Save,
    Plus,
    Trash2,
    Type,
    AlignLeft,
    HelpCircle,
    Mic,
    Image as ImageIcon,
    Layout,
    PlusCircle,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { courseApi } from '../api';

const LessonEditor = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('theory'); // 'theory' | 'exercises'

    const fetchLesson = async () => {
        try {
            setLoading(true);
            const res = await courseApi.getLessonById(lessonId);
            let lessonData = res.data;

            // Normalize exercise types from backend to frontend format
            const typeMap = {
                'WORD_MATCH': 'MATCHING',
                'TRANSLATE_SENTENCE': 'TRANSLATION',
                'WORD_TRANSLATE': 'CHOOSE_SENTENCE',
                'LISTEN_BUILD': 'BUILD_SENTENCE',
                'LISTEN_CHOOSE': 'CHOOSE_SENTENCE',
                'LISTEN_SIMILAR': 'CHOOSE_SENTENCE',
                'REPEAT_PHRASE': 'LISTENING'
            };

            if (lessonData.exercises) {
                lessonData.exercises = lessonData.exercises.map(ex => {
                    const normalizedType = typeMap[ex.exerciseType] || ex.exerciseType;

                    // Pre-fill fields from contentJson if they are missing
                    let qText = ex.questionText;
                    let cAns = ex.correctAnswer;
                    let maps = ex.mappings;
                    let opts = ex.options || [];

                    const technicalTs = ['WORD_MATCH', 'TRANSLATE_SENTENCE', 'WORD_TRANSLATE', 'LISTEN_BUILD', 'LISTEN_CHOOSE', 'LISTEN_SIMILAR', 'REPEAT_PHRASE', 'MATCHING', 'TRANSLATION', 'BUILD_SENTENCE', 'CHOOSE_SENTENCE', 'LISTENING'];

                    if (ex.contentJson) {
                        try {
                            const content = JSON.parse(ex.contentJson);

                            if (!qText || qText === "" || technicalTs.includes(qText)) {
                                qText = content.question || content.text || content.translations?.ru?.question || content.translations?.en?.question || qText;
                                if (technicalTs.includes(qText)) qText = "";
                            }

                            if (!cAns || cAns === "") {
                                cAns = content.target || content.answer || content.translations?.ru?.answer || content.translations?.en?.answer || cAns;
                            }

                            if ((!maps || maps === "{}" || maps === "") && (normalizedType === 'MATCHING')) {
                                const pairs = content.translations?.ru?.pairs || content.translations?.en?.pairs || content.pairs;
                                if (pairs) maps = JSON.stringify(pairs);
                            }

                            if ((!opts || opts.length === 0) && normalizedType === 'CHOOSE_SENTENCE') {
                                const legacyOptions = content.translations?.ru?.options || content.translations?.en?.options || content.options;
                                const legacyAnswer = content.translations?.ru?.answer || content.translations?.en?.answer || content.answer;
                                if (Array.isArray(legacyOptions)) {
                                    opts = legacyOptions.map((opt, i) => ({
                                        optionText: opt,
                                        isCorrect: opt === legacyAnswer,
                                        optionOrder: i + 1
                                    }));
                                }
                            }
                        } catch (e) { }
                    }

                    return {
                        ...ex,
                        exerciseType: normalizedType,
                        questionText: qText,
                        correctAnswer: cAns,
                        mappings: maps,
                        options: opts
                    };
                });
            }

            if (!lessonData.content) {
                lessonData.content = {
                    theoryTitle: '',
                    theoryText: '',
                    grammarRules: '',
                    examples: '',
                    tips: '',
                    pronunciationGuide: ''
                };
            }
            if (!lessonData.exercises) lessonData.exercises = [];
            setLesson(lessonData);
        } catch (err) {
            console.error("Не удалось загрузить урок:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLesson();
    }, [lessonId]);

    const handleSaveTheory = async () => {
        try {
            await courseApi.saveLessonContent(lessonId, lesson.content);
            alert("Теория сохранена!");
        } catch (err) {
            alert("Ошибка при сохранении теории.");
        }
    };

    const handleAddExercise = async () => {
        const type = prompt("Выберите тип упражнения (MATCHING, TRANSLATION, BUILD_SENTENCE, CHOOSE_SENTENCE):", "TRANSLATION");
        if (!type) return;

        try {
            await courseApi.addExercise(lessonId, {
                exerciseType: type,
                questionText: "Новый вопрос",
                correctAnswer: "Ответ",
                exerciseNumber: (lesson.exercises?.length || 0) + 1,
                options: [],
                mappings: "{}"
            });
            fetchLesson();
        } catch (err) {
            alert("Ошибка при добавлении упражнения.");
        }
    };

    const handleDeleteExercise = async (id) => {
        if (!confirm("Удалить это упражнение?")) return;
        try {
            await courseApi.deleteExercise(id);
            fetchLesson();
        } catch (err) {
            alert("Ошибка при удалении.");
        }
    };

    const handleUpdateExercise = async (ex) => {
        // Reverse mapping to backend format
        const reverseTypeMap = {
            'MATCHING': 'WORD_MATCH',
            'TRANSLATION': 'TRANSLATE_SENTENCE',
            'BUILD_SENTENCE': 'LISTEN_BUILD',
            'CHOOSE_SENTENCE': 'WORD_TRANSLATE',
            'LISTENING': 'REPEAT_PHRASE'
        };

        const payload = {
            ...ex,
            exerciseType: reverseTypeMap[ex.exerciseType] || ex.exerciseType
        };

        try {
            await courseApi.updateExercise(ex.id, payload);
            alert("Упражнение сохранено!");
            fetchLesson();
        } catch (err) {
            alert("Ошибка при сохранении.");
        }
    };

    // Helper for question text
    const getQuestionText = (ex) => {
        const technicalTs = ['WORD_MATCH', 'TRANSLATE_SENTENCE', 'WORD_TRANSLATE', 'LISTEN_BUILD', 'LISTEN_CHOOSE', 'LISTEN_SIMILAR', 'REPEAT_PHRASE', 'MATCHING', 'TRANSLATION', 'BUILD_SENTENCE', 'CHOOSE_SENTENCE', 'LISTENING'];

        if (ex.contentJson) {
            try {
                const content = JSON.parse(ex.contentJson);
                const val = content.question ||
                    content.text ||
                    content.translations?.ru?.question ||
                    content.translations?.en?.question;
                if (val && !technicalTs.includes(val)) return val;
            } catch (e) { }
        }

        if (ex.questionText && !technicalTs.includes(ex.questionText)) return ex.questionText;
        return "";
    };

    const getCorrectAnswer = (ex) => {
        if (ex.contentJson) {
            try {
                const content = JSON.parse(ex.contentJson);
                const val = content.target ||
                    content.answer ||
                    content.translations?.ru?.answer ||
                    content.translations?.en?.answer;
                if (val) return val;
            } catch (e) { }
        }
        return ex.correctAnswer || "";
    };

    // Helper for matching pairs
    const getPairs = (ex) => {
        if (ex.mappings && ex.mappings !== '{}') {
            try {
                const obj = JSON.parse(ex.mappings);
                return Object.entries(obj);
            } catch (e) { }
        }
        return [];
    };

    const updatePairs = (exIdx, pairs) => {
        const obj = Object.fromEntries(pairs);
        const newList = [...lesson.exercises];
        newList[exIdx].mappings = JSON.stringify(obj);
        setLesson({ ...lesson, exercises: newList });
    };

    // Helper for options
    const getOptions = (ex) => {
        return ex.options || [];
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Загрузка контента урока...</div>;
    if (!lesson) return <div style={{ padding: '40px', textAlign: 'center' }}>Урок не найден</div>;

    return (
        <div style={{ paddingBottom: '100px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ padding: '8px' }}>
                    <ArrowLeft size={24} />
                </button>
                <div style={{ flex: 1 }}>
                    <h1 style={{ marginBottom: '4px' }}>Редактор урока: {lesson.title}</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Тип: <span style={{ color: 'var(--primary)' }}>{lesson.lessonType === 'VIDEO' ? 'Видео' : 'История'}</span></p>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '2px', marginBottom: '32px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
                <button
                    className={`btn ${activeTab === 'theory' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setActiveTab('theory')}
                    style={{ borderRadius: '8px' }}
                >
                    Теория и Контент
                </button>
                <button
                    className={`btn ${activeTab === 'exercises' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setActiveTab('exercises')}
                    style={{ borderRadius: '8px' }}
                >
                    Упражнения ({lesson.exercises?.length || 0})
                </button>
            </div>

            {activeTab === 'theory' && (
                <div className="glass-card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <AlignLeft color="var(--primary)" /> Теория урока
                        </h2>
                        <button className="btn btn-primary" onClick={handleSaveTheory}>
                            <Save size={18} /> Сохранить теорию
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontWeight: 600, fontSize: '14px' }}>Заголовок теории</label>
                            <input
                                type="text"
                                placeholder="Например: Основы настоящего времени"
                                value={lesson.content?.theoryTitle || ''}
                                onChange={(e) => setLesson({ ...lesson, content: { ...lesson.content, theoryTitle: e.target.value } })}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: 600, fontSize: '14px' }}>Текст теории (Основное объяснение)</label>
                                <textarea
                                    rows={10}
                                    value={lesson.content?.theoryText || ''}
                                    onChange={(e) => setLesson({ ...lesson, content: { ...lesson.content, theoryText: e.target.value } })}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: 600, fontSize: '14px' }}>Грамматические правила</label>
                                <textarea
                                    rows={10}
                                    value={lesson.content?.grammarRules || ''}
                                    onChange={(e) => setLesson({ ...lesson, content: { ...lesson.content, grammarRules: e.target.value } })}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: 600, fontSize: '14px' }}>Примеры</label>
                                <textarea
                                    rows={5}
                                    value={lesson.content?.examples || ''}
                                    onChange={(e) => setLesson({ ...lesson, content: { ...lesson.content, examples: e.target.value } })}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: 600, fontSize: '14px' }}>Советы</label>
                                <textarea
                                    rows={5}
                                    value={lesson.content?.tips || ''}
                                    onChange={(e) => setLesson({ ...lesson, content: { ...lesson.content, tips: e.target.value } })}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: 600, fontSize: '14px' }}>Гид по произношению</label>
                                <textarea
                                    rows={5}
                                    value={lesson.content?.pronunciationGuide || ''}
                                    onChange={(e) => setLesson({ ...lesson, content: { ...lesson.content, pronunciationGuide: e.target.value } })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'exercises' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Layout color="var(--primary)" /> Упражнения
                        </h2>
                        <button className="btn btn-ghost" onClick={handleAddExercise} style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <PlusCircle size={18} /> Добавить упражнение
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {lesson.exercises?.sort((a, b) => a.exerciseNumber - b.exerciseNumber).map((ex, exIdx) => (
                            <div key={ex.id} className="glass-card" style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                            {ex.exerciseNumber || exIdx + 1}
                                        </div>
                                        <select
                                            value={ex.exerciseType}
                                            onChange={(e) => {
                                                const newList = [...lesson.exercises];
                                                newList[exIdx].exerciseType = e.target.value;
                                                setLesson({ ...lesson, exercises: newList });
                                            }}
                                            style={{ width: 'auto', padding: '4px 12px' }}
                                        >
                                            <option value="TRANSLATION">Перевод</option>
                                            <option value="MATCHING">Сопоставление</option>
                                            <option value="BUILD_SENTENCE">Собрать предложение</option>
                                            <option value="CHOOSE_SENTENCE">Выбрать вариант</option>
                                            <option value="LISTENING">Аудирование</option>
                                        </select>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={() => handleDeleteExercise(ex.id)}>
                                            <Trash2 size={18} color="var(--danger)" />
                                        </button>
                                        <button className="btn btn-primary" style={{ padding: '6px 16px' }} onClick={() => handleUpdateExercise(ex)}>
                                            <Save size={16} /> Сохранить
                                        </button>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Текст вопроса / Задание</label>
                                            <input
                                                type="text"
                                                value={ex.questionText || ""}
                                                onChange={(e) => {
                                                    const newList = [...lesson.exercises];
                                                    newList[exIdx].questionText = e.target.value;
                                                    setLesson({ ...lesson, exercises: newList });
                                                }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Правильный ответ</label>
                                            <input
                                                type="text"
                                                value={ex.correctAnswer || ""}
                                                onChange={(e) => {
                                                    const newList = [...lesson.exercises];
                                                    newList[exIdx].correctAnswer = e.target.value;
                                                    setLesson({ ...lesson, exercises: newList });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Сложность (1-5)</label>
                                            <input
                                                type="number"
                                                min="1" max="5"
                                                value={ex.difficulty}
                                                onChange={(e) => {
                                                    const newList = [...lesson.exercises];
                                                    newList[exIdx].difficulty = parseInt(e.target.value);
                                                    setLesson({ ...lesson, exercises: newList });
                                                }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Аудио URL (необязательно)</label>
                                            <input
                                                type="text"
                                                value={ex.questionAudioUrl || ''}
                                                onChange={(e) => {
                                                    const newList = [...lesson.exercises];
                                                    newList[exIdx].questionAudioUrl = e.target.value;
                                                    setLesson({ ...lesson, exercises: newList });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Специальный редактор для СОПОСТАВЛЕНИЯ */}
                                {ex.exerciseType === 'MATCHING' && (
                                    <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                        <h4 style={{ fontSize: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Type size={16} color="var(--primary)" /> Пары слов для сопоставления
                                        </h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {getPairs(ex).map(([k, v], pIdx) => (
                                                <div key={pIdx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                    <input
                                                        style={{ flex: 1 }}
                                                        placeholder="Слово"
                                                        value={k}
                                                        onChange={(e) => {
                                                            const pairs = getPairs(ex);
                                                            pairs[pIdx][0] = e.target.value;
                                                            updatePairs(exIdx, pairs);
                                                        }}
                                                    />
                                                    <span style={{ color: 'var(--text-muted)' }}>=</span>
                                                    <input
                                                        style={{ flex: 1 }}
                                                        placeholder="Перевод"
                                                        value={v}
                                                        onChange={(e) => {
                                                            const pairs = getPairs(ex);
                                                            pairs[pIdx][1] = e.target.value;
                                                            updatePairs(exIdx, pairs);
                                                        }}
                                                    />
                                                    <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={() => {
                                                        const pairs = getPairs(ex);
                                                        pairs.splice(pIdx, 1);
                                                        updatePairs(exIdx, pairs);
                                                    }}>
                                                        <Trash2 size={14} color="var(--danger)" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                className="btn btn-ghost"
                                                style={{ marginTop: '10px', border: '1px dashed rgba(255,255,255,0.1)', fontSize: '13px' }}
                                                onClick={() => {
                                                    const pairs = getPairs(ex);
                                                    pairs.push(["", ""]);
                                                    updatePairs(exIdx, pairs);
                                                }}
                                            >
                                                <Plus size={14} /> Добавить пару
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Специальный редактор для ВАРИАНТОВ ОТВЕТА / СЛОВ */}
                                {(ex.exerciseType === 'CHOOSE_SENTENCE' || ex.exerciseType === 'TRANSLATION' || ex.exerciseType === 'BUILD_SENTENCE') && (
                                    <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                        <h4 style={{ fontSize: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <CheckCircle2 size={16} color="var(--primary)" /> Варианты ответов
                                        </h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {getOptions(ex).map((opt, oIdx) => (
                                                <div key={oIdx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                    <button
                                                        className="btn btn-ghost"
                                                        style={{ padding: '6px', color: opt.isCorrect ? '#22c55e' : 'var(--text-muted)' }}
                                                        onClick={() => {
                                                            const newList = [...lesson.exercises];
                                                            // Ensure options exist
                                                            if (!newList[exIdx].options) newList[exIdx].options = getOptions(ex);
                                                            newList[exIdx].options = newList[exIdx].options.map((o, idx) => ({ ...o, isCorrect: idx === oIdx }));
                                                            setLesson({ ...lesson, exercises: newList });
                                                        }}
                                                    >
                                                        {opt.isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                                                    </button>
                                                    <input
                                                        style={{ flex: 1 }}
                                                        placeholder="Текст варианта"
                                                        value={opt.optionText}
                                                        onChange={(e) => {
                                                            const newList = [...lesson.exercises];
                                                            if (!newList[exIdx].options) newList[exIdx].options = getOptions(ex);
                                                            newList[exIdx].options[oIdx].optionText = e.target.value;
                                                            setLesson({ ...lesson, exercises: newList });
                                                        }}
                                                    />
                                                    <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={() => {
                                                        const newList = [...lesson.exercises];
                                                        if (!newList[exIdx].options) newList[exIdx].options = getOptions(ex);
                                                        newList[exIdx].options.splice(oIdx, 1);
                                                        setLesson({ ...lesson, exercises: newList });
                                                    }}>
                                                        <Trash2 size={14} color="var(--danger)" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                className="btn btn-ghost"
                                                style={{ marginTop: '10px', border: '1px dashed rgba(255,255,255,0.1)', fontSize: '13px' }}
                                                onClick={() => {
                                                    const newList = [...lesson.exercises];
                                                    if (!newList[exIdx].options) newList[exIdx].options = getOptions(ex);
                                                    newList[exIdx].options.push({ optionText: "", isCorrect: false, optionOrder: newList[exIdx].options.length + 1 });
                                                    setLesson({ ...lesson, exercises: newList });
                                                }}
                                            >
                                                <Plus size={14} /> Добавить вариант
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LessonEditor;
