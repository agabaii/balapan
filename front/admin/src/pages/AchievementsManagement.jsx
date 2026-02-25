import React from 'react';
import { Sword, Trophy, Star, Target } from 'lucide-react';

const AchievementsManagement = () => {
    const list = [
        { id: 1, name: 'First Words', goal: 'Complete 1 lesson', xp: 50 },
        { id: 2, name: 'Scholar', goal: 'Complete 10 lessons', xp: 200 },
        { id: 3, name: 'Unstoppable', goal: '7-day streak', xp: 500 }
    ];

    return (
        <div className="glass-card" style={{ padding: '24px' }}>
            <h1>Achievements</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Configure user milestones and rewards</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {list.map(a => (
                    <div key={a.id} className="glass-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={{ padding: '10px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px' }}>
                                <Trophy color="#f59e0b" size={24} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '16px' }}>{a.name}</h4>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{a.goal}</p>
                                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#f59e0b' }}>
                                    <Star size={14} fill="#f59e0b" /> +{a.xp} XP
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div
                    className="glass-card"
                    style={{
                        padding: '20px',
                        background: 'transparent',
                        border: '2px dashed var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <span style={{ color: 'var(--text-muted)' }}>+ Add Achievement</span>
                </div>
            </div>
        </div>
    );
};

export default AchievementsManagement;
