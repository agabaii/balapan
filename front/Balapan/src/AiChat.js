import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, ArrowLeft, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiService from './services/api';

export default function AiChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const language = localStorage.getItem('interfaceLanguage') || 'ru';

    useEffect(() => {
        const startNewSession = async () => {
            // In a real scenario, we call the API
            setMessages([
                {
                    id: 1,
                    sender: 'ai',
                    content: language === 'en' ? 'Hello! I am your AI assistant. Let\'s practice!' : 'Привет! Я твой ИИ-помощник. Давай попрактикуемся!',
                    createdAt: new Date()
                }
            ]);
        };
        startNewSession();
    }, [language]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const startNewSessionManual = () => {
        setMessages([
            {
                id: 1,
                sender: 'ai',
                content: language === 'en' ? 'Hello! I am your AI assistant. Let\'s practice!' : 'Привет! Я твой ИИ-помощник. Давай попрактикуемся!',
                createdAt: new Date()
            }
        ]);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = {
            id: Date.now(),
            sender: 'user',
            content: input,
            createdAt: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        // Simulation of AI Response
        setTimeout(() => {
            const aiMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                content: `You said: "${input}". That's great! Keep practicing!`,
                corrections: "Your grammar looks correct.",
                createdAt: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <ArrowLeft size={24} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">AI Tutor</h1>
                        <p className="text-sm text-green-500 font-medium">Online</p>
                    </div>
                </div>
                <button
                    onClick={startNewSessionManual}
                    className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500"
                    title="Reset Chat"
                >
                    <RotateCcw size={20} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
                            </div>
                            <div className="space-y-2">
                                <div className={`px-5 py-3 rounded-2xl shadow-sm ${msg.sender === 'user'
                                    ? 'bg-pink-500 text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                    }`}>
                                    <p className="leading-relaxed">{msg.content}</p>
                                </div>
                                {msg.corrections && (
                                    <div className="text-xs bg-yellow-50 border border-yellow-100 text-yellow-700 px-3 py-1.5 rounded-lg flex items-start gap-2 italic">
                                        <span>💡</span> {msg.corrections}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-100 px-5 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-2">
                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white border-t p-6">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={language === 'en' ? 'Type your message...' : 'Напишите сообщение...'}
                        className="flex-1 bg-gray-100 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-pink-400 transition"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-2xl transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={24} />
                    </button>
                </form>
            </div>
        </div>
    );
}
