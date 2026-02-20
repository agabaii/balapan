import React, { useState } from 'react';
import { Book, Plus, Play, Info, Check, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Vocabulary() {
    const [words] = useState([
        { id: 1, word: 'Сәлем', translate: 'Привет', srsLevel: 3, nextReview: 'Today' },
        { id: 2, word: 'Дос', translate: 'Друг', srsLevel: 1, nextReview: 'Today' },
        { id: 3, word: 'Кітап', translate: 'Книга', srsLevel: 5, nextReview: '2 days' },
    ]);
    const [isTesting, setIsTesting] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const navigate = useNavigate();

    const currentWord = words[currentIndex];

    const handleResult = (success) => {
        // Logic for SRS update would go here
        setShowAnswer(false);
        if (currentIndex < words.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setIsTesting(false);
            setCurrentIndex(0);
        }
    };

    if (isTesting) {
        return (
            <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-6">
                <div className="bg-white rounded-3xl shadow-xl p-10 max-w-sm w-full text-center space-y-8 animate-in fade-in zoom-in duration-300">
                    <div className="text-gray-400 font-medium uppercase tracking-widest text-sm">
                        Word {currentIndex + 1} of {words.length}
                    </div>

                    <div className="text-5xl font-bold text-gray-900">
                        {currentWord.word}
                    </div>

                    <div className="h-24 flex items-center justify-center">
                        {showAnswer ? (
                            <div className="text-3xl text-pink-500 font-semibold animate-in slide-in-from-bottom-4">
                                {currentWord.translate}
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAnswer(true)}
                                className="text-pink-400 hover:text-pink-500 font-medium flex items-center gap-2 transition"
                            >
                                <Info size={20} /> Show Translation
                            </button>
                        )}
                    </div>

                    {showAnswer ? (
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <button
                                onClick={() => handleResult(false)}
                                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 py-4 rounded-2xl font-bold transition"
                            >
                                <X size={20} /> Forget
                            </button>
                            <button
                                onClick={() => handleResult(true)}
                                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold transition shadow-lg"
                            >
                                <Check size={20} /> Remember
                            </button>
                        </div>
                    ) : (
                        <div className="h-16" />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition shadow-sm border border-gray-100">
                            <ArrowLeft size={24} className="text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900">My Vocabulary</h1>
                            <p className="text-gray-500">Track and master new words using SRS.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-bold hover:bg-gray-100 transition shadow-sm">
                            <Plus size={20} /> Add Word
                        </button>
                        <button
                            onClick={() => setIsTesting(true)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-pink-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-pink-600 transition shadow-lg shadow-pink-200"
                        >
                            <Play size={20} fill="currentColor" /> Practice Now
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-1">
                        <div className="text-3xl font-bold text-gray-900">124</div>
                        <div className="text-sm text-gray-500 font-medium">Total Words</div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-1">
                        <div className="text-3xl font-bold text-pink-500">12</div>
                        <div className="text-sm text-gray-500 font-medium">Due for Review</div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-1">
                        <div className="text-3xl font-bold text-green-500">85</div>
                        <div className="text-sm text-gray-500 font-medium">Mastered</div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                        <h2 className="font-bold text-gray-700 flex items-center gap-2">
                            <Book size={18} /> Word List
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {words.map(w => (
                            <div key={w.id} className="px-8 py-5 flex items-center justify-between hover:bg-gray-50 transition cursor-default">
                                <div className="space-y-1">
                                    <div className="text-lg font-bold text-gray-900">{w.word}</div>
                                    <div className="text-sm text-gray-500">{w.translate}</div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Level</div>
                                        <div className="flex gap-1 mt-1">
                                            {[1, 2, 3, 4, 5].map(lv => (
                                                <div key={lv} className={`w-2 h-2 rounded-full ${lv <= w.srsLevel ? 'bg-pink-400' : 'bg-gray-200'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right hidden md:block">
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Review In</div>
                                        <div className="text-sm font-medium text-gray-700">{w.nextReview}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
