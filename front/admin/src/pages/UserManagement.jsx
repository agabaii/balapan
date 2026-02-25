import React, { useState, useEffect } from 'react';
import {
    Search,
    Ban,
    Trash2,
    Edit,
    CheckCircle,
    XCircle,
    ShieldCheck,
    ShieldAlert,
    Coins,
    Zap,
    MoreVertical
} from 'lucide-react';
import { userApi } from '../api';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await userApi.getAll();
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users", err);
            setError("Не удалось загрузить пользователей. Пожалуйста, проверьте бэкенд (порт 8081).");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleBan = async (id, isBanned) => {
        try {
            if (isBanned) {
                await userApi.unban(id);
            } else {
                await userApi.ban(id);
            }
            fetchUsers();
        } catch (error) {
            alert("Действие не удалось");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Вы уверены, что хотите удалить этого пользователя? Это действие нельзя отменить.")) {
            try {
                await userApi.delete(id);
                fetchUsers();
            } catch (error) {
                alert("Удаление не удалось");
            }
        }
    };

    const handleEditStats = async (id, type) => {
        const typeLabel = type === 'xp' ? 'XP (опыт)' : 'алмазы';
        const value = prompt(`Введите новое количество для ${typeLabel}:`);
        if (value === null || isNaN(value)) return;

        try {
            if (type === 'xp') await userApi.setXp(id, parseInt(value));
            if (type === 'gems') await userApi.setGems(id, parseInt(value));
            fetchUsers();
        } catch (error) {
            alert("Обновление не удалось");
        }
    };

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2>Управление пользователями</h2>
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Поиск по имени или email..."
                        style={{ paddingLeft: '40px', width: '300px' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>Загрузка пользователей...</div>
            ) : error ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--danger)' }}>{error}</div>
            ) : filteredUsers.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>Пользователи не найдены.</div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Пользователь</th>
                                <th>Статус</th>
                                <th>Прогресс (XP/Алмазы)</th>
                                <th>Дата регистрации</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                {user.username[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{user.username}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {user.isBanned ? (
                                            <span className="badge badge-danger">Забанен</span>
                                        ) : (
                                            <span className="badge badge-success">Активен</span>
                                        )}
                                        {user.isVerified ? (
                                            <span style={{ marginLeft: '8px', color: 'var(--success)' }} title="Почта подтверждена"><CheckCircle size={14} /></span>
                                        ) : null}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '16px' }}>
                                            <div onClick={() => handleEditStats(user.id, 'xp')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Zap size={14} color="#f59e0b" fill="#f59e0b" /> {user.totalXp || 0}
                                            </div>
                                            <div onClick={() => handleEditStats(user.id, 'gems')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Coins size={14} color="#ef4444" fill="#ef4444" /> {user.gems || 0}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '14px' }}>
                                            {user.createdAt ? format(new Date(user.createdAt), 'd MMM yyyy', { locale: ru }) : 'Н/Д'}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => handleBan(user.id, user.isBanned)}
                                                className="btn btn-ghost"
                                                style={{ padding: '6px', minWidth: '36px' }}
                                                title={user.isBanned ? "Разбанить" : "Забанить"}
                                            >
                                                {user.isBanned ? <ShieldCheck size={18} color="var(--success)" /> : <Ban size={18} color="var(--danger)" />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="btn btn-ghost"
                                                style={{ padding: '6px', minWidth: '36px' }}
                                                title="Удалить пользователя"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <button className="btn btn-ghost" style={{ padding: '6px', minWidth: '36px' }}>
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
