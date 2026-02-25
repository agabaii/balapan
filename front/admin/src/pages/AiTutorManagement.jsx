import React, { useState } from 'react';
import { MessageSquare, Save, Terminal, Bot, RefreshCw } from 'lucide-react';

const AiTutorManagement = () => {
    const [systemPrompt, setSystemPrompt] = useState(
        "You are an AI language tutor for the Balapan app. You help students learn Kazakh/Russian/English through natural conversation. Keep responses short and educational."
    );
    const [model, setModel] = useState("gpt-4o-mini");

    return (
        <div className="glass-card" style={{ padding: '24px' }}>
            <h1>AI Tutor Configuration</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Tune the behavior and settings of the AI tutor</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 600 }}>System Instruction (Prompt)</label>
                        <textarea
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            style={{
                                height: '250px',
                                padding: '16px',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                color: 'white',
                                fontFamily: 'Inter, sans-serif'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn btn-primary">
                            <Save size={18} /> Update Instructions
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <Bot size={20} color="var(--primary)" /> Model Settings
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>Active Model</label>
                                <select
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    style={{ width: '100%' }}
                                >
                                    <option value="gpt-4o">GPT-4o (Premium)</option>
                                    <option value="gpt-4o-mini">GPT-4o Mini (Fast)</option>
                                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Legacy)</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Temperature</span>
                                <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" style={{ width: '150px' }} />
                                <span>0.7</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <Terminal size={20} color="var(--primary)" /> Recent Activity
                        </h4>
                        <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ color: 'var(--text-muted)' }}>[14:40] User 'Aida' started a session</div>
                            <div style={{ color: 'var(--text-muted)' }}>[14:41] AI responded: "Sizge kөmek kerek pe?"</div>
                            <div style={{ color: 'var(--text-muted)' }}>[14:42] Token usage: 450 prompt, 120 completion</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiTutorManagement;
