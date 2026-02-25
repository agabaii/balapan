import React, { useState } from 'react';
import { Bell, Send, Users, Smartphone, Clock } from 'lucide-react';

const NotificationsService = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [target, setTarget] = useState('all');

    const handleSend = () => {
        alert(`Notification sent to ${target}: ${title}`);
        setTitle('');
        setBody('');
    };

    return (
        <div className="glass-card" style={{ padding: '24px' }}>
            <h1>Push Notifications</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Send messages directly to students' devices</p>

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 600 }}>Target Audience</label>
                        <select value={target} onChange={(e) => setTarget(e.target.value)}>
                            <option value="all">All Users</option>
                            <option value="inactive">Inactive for 3+ days</option>
                            <option value="streak">Users with 7+ day streak</option>
                            <option value="kk-course">Kazakh Course Students</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 600 }}>Notification Title</label>
                        <input
                            type="text"
                            placeholder="Enter catchy title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 600 }}>Message Content</label>
                        <textarea
                            placeholder="Type your message here..."
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            style={{ height: '120px', padding: '12px' }}
                        />
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={handleSend}
                        disabled={!title || !body}
                        style={{ padding: '14px', marginTop: '10px' }}
                    >
                        <Send size={18} /> Send Notification Now
                    </button>
                </div>

                <div className="glass-card" style={{ marginTop: '40px', padding: '20px', background: 'rgba(255,100,100,0.05)', border: '1px solid rgba(255,100,100,0.1)' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Clock size={24} color="#f87171" />
                        <div>
                            <h4 style={{ color: '#f87171' }}>Scheduled Reminder</h4>
                            <p style={{ fontSize: '13px' }}>Daily "Practice" reminder is sent automatically at 18:00 (user time).</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationsService;
