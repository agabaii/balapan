import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    Gem, Flame, Sparkles, Shield, Zap,
    ChevronLeft, ShoppingBag, CheckCircle2, AlertCircle
} from 'lucide-react';
import apiService from './services/api';
import { getTranslation } from './translations';
import { useApp } from './context/AppContext';
import TopBar from './TopBar';

export default function Shop() {
    const navigate = useNavigate();
    const { interfaceLang } = useApp();
    const t = getTranslation(interfaceLang);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [purchaseStatus, setPurchaseStatus] = useState({ show: false, success: false, message: '' });

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const result = await apiService.getUserProfile();
        if (result.success) {
            setUserData(result.user);
        }
        setLoading(false);
    };

    const handleBuy = async (itemType, cost) => {
        if (!userData || userData.gems < cost) {
            setPurchaseStatus({
                show: true,
                success: false,
                message: 'Недостаточно алмазов! Учись больше, чтобы заработать их. 💎'
            });
            return;
        }

        const result = await apiService.buyItem(itemType, cost);
        if (result.id) {
            setUserData(result);
            setPurchaseStatus({
                show: true,
                success: true,
                message: 'Покупка успешно завершена! 🎉'
            });
        } else {
            setPurchaseStatus({
                show: true,
                success: false,
                message: 'Что-то пошло не так. Попробуйте позже.'
            });
        }

        setTimeout(() => setPurchaseStatus({ show: false, success: false, message: '' }), 3000);
    };

    const shopItems = [
        {
            id: 'streak_freeze',
            name: 'Заморозка',
            desc: 'Сохранит твой ударный режим, если ты пропустишь один день.',
            cost: 200,
            icon: <Flame className="text-orange-500" size={32} fill="currentColor" />,
            color: 'from-orange-400 to-red-500'
        },
        {
            id: 'xp_boost',
            name: 'Удвоение опыта',
            desc: 'Следующие 15 минут ты будешь получать в 2 раза больше опыта!',
            cost: 100,
            icon: <Zap className="text-yellow-400" size={32} fill="currentColor" />,
            color: 'from-yellow-300 to-orange-400'
        },
        {
            id: 'legendary_crown',
            name: 'Легендарная корона',
            desc: 'Эксклюзивный аксессуар для твоего аватара. Выделяйся!',
            cost: 500,
            icon: <Sparkles className="text-indigo-400" size={32} fill="currentColor" />,
            color: 'from-indigo-400 to-purple-600'
        },
    ];

    if (loading) return null;

    return (
        <div className="min-h-screen bg-[#FFFECF] pb-20">
            <TopBar userData={userData} />

            <div className="max-w-4xl mx-auto px-4 pt-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[#C14D7D] font-black uppercase tracking-widest hover:scale-105 transition"
                    >
                        <ChevronLeft size={24} strokeWidth={3} /> Назад
                    </button>

                    <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border-2 border-gray-100 shadow-sm">
                        <span className="text-xl">💎</span>
                        <span className="text-2xl font-black text-blue-400">{userData?.gems || 0}</span>
                    </div>
                </div>

                {/* Purchase Status Popup */}
                {purchaseStatus.show && (
                    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-pop">
                        <div className={`px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-4 bg-white ${purchaseStatus.success ? 'border-green-400' : 'border-red-400'}`}>
                            {purchaseStatus.success ? <CheckCircle2 className="text-green-500" /> : <AlertCircle className="text-red-500" />}
                            <p className="font-black text-gray-800">{purchaseStatus.message}</p>
                        </div>
                    </div>
                )}

                <div className="text-center mb-12">
                    <div className="inline-block p-4 bg-white rounded-3xl border-4 border-[#F9ADD1] shadow-[0_8px_0_0_#F9ADD1] mb-4">
                        <ShoppingBag size={48} className="text-[#F9ADD1]" />
                    </div>
                    <h1 className="text-4xl font-black text-[#C14D7D] uppercase tracking-tight">Магазин Balapan</h1>
                    <p className="text-[#A0A0FF] font-bold mt-2">Трать свои алмазы с пользой!</p>
                </div>

                {/* Shop Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shopItems.map((item) => {
                        const isUnlocked = userData?.unlockedItems?.includes(item.id);
                        return (
                            <div
                                key={item.id}
                                className="bg-white rounded-[2.5rem] p-6 border-2 border-[#FFDAEC] shadow-[0_8px_0_0_#FFDAEC] flex flex-col items-center text-center group hover:-translate-y-2 transition duration-300 relative overflow-hidden"
                            >
                                {/* Visual Background */}
                                <div className="absolute top-0 left-0 w-full h-2 bg-[#FFDAEC]"></div>

                                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition duration-500">
                                    {item.icon}
                                </div>

                                <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight mb-2">{item.name}</h3>
                                <p className="text-xs text-gray-400 font-bold mb-8 leading-relaxed px-2">
                                    {item.desc}
                                </p>

                                <div className="mt-auto w-full">
                                    {item.id === 'streak_freeze' && userData?.streakFreezes > 0 && (
                                        <div className="mb-4 text-[10px] font-black text-green-500 uppercase">
                                            У тебя есть: {userData.streakFreezes} шт.
                                        </div>
                                    )}

                                    <button
                                        onClick={() => handleBuy(item.id, item.cost)}
                                        disabled={isUnlocked && item.id !== 'streak_freeze'}
                                        className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all relative overflow-hidden
                      ${isUnlocked && item.id !== 'streak_freeze'
                                                ? 'bg-gray-100 text-gray-400 cursor-default'
                                                : 'bg-white border-2 border-[#F9ADD1] text-[#F9ADD1] shadow-[0_4px_0_0_#F9ADD1] active:translate-y-1 active:shadow-none hover:bg-[#FFE0F0]'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            {isUnlocked && item.id !== 'streak_freeze' ? (
                                                <>РАЗБЛОКИРОВАНО</>
                                            ) : (
                                                <>
                                                    <Gem size={18} fill="currentColor" />
                                                    {item.cost}
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Banner */}
                <div className="mt-16 bg-gradient-to-r from-[#A0A0FF] to-[#7A7AFF] rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                    <div className="absolute right-[-20px] top-[-20px] opacity-20 rotate-12 group-hover:scale-125 transition duration-1000">
                        <Sparkles size={180} />
                    </div>
                    <div className="relative z-10 max-w-lg">
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Получай больше алмазов!</h3>
                        <p className="font-bold opacity-90 mb-6 text-sm">
                            Завершай уроки с идеальным результатом, выполняй ежедневные цели и заходи в приложение каждый день!
                        </p>
                        <button
                            onClick={() => navigate('/lesson')}
                            className="bg-white text-[#7A7AFF] px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-105 transition active:scale-95"
                        >
                            Учиться сейчас
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
