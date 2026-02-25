import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Gem, Star, Zap, TrendingUp } from 'lucide-react';
import { userApi, courseApi } from '../api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        users: 0,
        courses: 0,
        totalXp: 0,
        totalGems: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersRes = await userApi.getAll();
                const coursesRes = await courseApi.getAll();

                const users = usersRes.data;
                const totalXp = users.reduce((acc, u) => acc + (u.totalXp || 0), 0);
                const totalGems = users.reduce((acc, u) => acc + (u.gems || 0), 0);

                setStats({
                    users: users.length,
                    courses: coursesRes.data.length,
                    totalXp,
                    totalGems
                });
            } catch (error) {
                console.error("Error fetching dashboard stats", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Обзор панели</h1>

            <div className="stats-grid">
                <StatCard
                    icon={<Users color="#6366f1" />}
                    label="Всего пользователей"
                    value={stats.users}
                    trend="+12%"
                />
                <StatCard
                    icon={<BookOpen color="#10b981" />}
                    label="Активных курсов"
                    value={stats.courses}
                />
                <StatCard
                    icon={<Zap color="#f59e0b" />}
                    label="Всего заработано XP"
                    value={stats.totalXp.toLocaleString()}
                />
                <StatCard
                    icon={<Gem color="#ef4444" />}
                    label="Алмазов в обороте"
                    value={stats.totalGems.toLocaleString()}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <h3>Последняя активность</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Здесь будет отображаться лог действий...</p>
                </div>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <h3>Статус системы</h3>
                    <div style={{ marginTop: '1.5rem' }}>
                        <StatusItem label="Бэкенд API" status="Онлайн" color="var(--success)" />
                        <StatusItem label="База данных" status="Активна" color="var(--success)" />
                        <StatusItem label="AI Сервис" status="Онлайн" color="var(--success)" />
                        <StatusItem label="Почтовый сервер" status="Внимание" color="var(--warning)" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, trend }) => (
    <div className="glass-card stat-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
                {icon}
            </div>
            {trend && (
                <span style={{ fontSize: '12px', color: 'var(--success)', display: 'flex', alignItems: 'center' }}>
                    <TrendingUp size={14} style={{ marginRight: '4px' }} /> {trend}
                </span>
            )}
        </div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
    </div>
);

const StatusItem = ({ label, status, color }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
        <span>{label}</span>
        <span style={{ color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }}></div>
            {status}
        </span>
    </div>
);

export default Dashboard;
