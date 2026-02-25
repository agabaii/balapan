import React, { useState } from 'react';
import { Database, RefreshCw, Trash2, FileJson, ShieldAlert, Download } from 'lucide-react';
import { courseApi } from '../api';

const DatabaseTools = () => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAction = async (action) => {
        if (!window.confirm(`Are you sure you want to perform: ${action}?`)) return;

        setIsProcessing(true);
        try {
            if (action === 'Reseed Courses') await courseApi.reseed(true);
            alert(`${action} completed successfully!`);
        } catch (error) {
            alert(`${action} failed`);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="glass-card" style={{ padding: '24px' }}>
            <h1>Database Tools</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Careful: These actions directly affect production data</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <ToolCard
                    icon={<RefreshCw size={24} color="var(--primary)" />}
                    title="Reseed Courses"
                    desc="Clear current course hierarchy and rebuild from JSON files."
                    onAction={() => handleAction('Reseed Courses')}
                    disabled={isProcessing}
                />
                <ToolCard
                    icon={<Download size={24} color="var(--success)" />}
                    title="Export Backup"
                    desc="Download a full JSON dump of users and progress."
                    onAction={() => alert('Exporting...')}
                    variant="ghost"
                />
                <ToolCard
                    icon={<Trash2 size={24} color="var(--danger)" />}
                    title="Clear Cache"
                    desc="Flush all temporary images and audio metadata."
                    onAction={() => alert('Cache cleared')}
                    variant="ghost"
                />
                <ToolCard
                    icon={<ShieldAlert size={24} color="#f59e0b" />}
                    title="Reset API Key"
                    desc="Rotate OpenAI / Firebase service tokens."
                    onAction={() => alert('Token rotated')}
                    variant="ghost"
                />
            </div>
        </div>
    );
};

const ToolCard = ({ icon, title, desc, onAction, disabled, variant = 'primary' }) => (
    <div className="glass-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                {icon}
            </div>
            <div>
                <h3 style={{ fontSize: '18px' }}>{title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{desc}</p>
            </div>
        </div>
        <button
            className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={onAction}
            disabled={disabled}
            style={{ width: '100%', marginTop: 'auto' }}
        >
            Execute Action
        </button>
    </div>
);

export default DatabaseTools;
