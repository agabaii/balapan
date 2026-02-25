import React, { useState } from 'react';
import { ShoppingBag, Plus, Tag, Flame, Shield, Trash2, Edit2 } from 'lucide-react';

const ShopManagement = () => {
    const [items, setItems] = useState([
        { id: 1, name: 'Streak Freeze', type: 'streak_freeze', cost: 200, icon: <Flame color="var(--primary)" /> },
        { id: 2, name: 'Double or Nothing', type: 'gamble', cost: 50, icon: <Zap color="var(--warning)" /> },
        { id: 3, name: 'Shield', type: 'shield', cost: 150, icon: <Shield color="var(--success)" /> }
    ]);

    return (
        <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1>Shop Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage items and prices in the in-app shop</p>
                </div>
                <button className="btn btn-primary"><Plus size={18} /> Add New Item</button>
            </div>

            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '24px' }}>
                <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700 }}>{items.length}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ACTIVE ITEMS</div>
                </div>
                <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700 }}>200</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>AVG ITEM COST (GEMS)</div>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Type ID</th>
                        <th>Cost (Gems)</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {item.icon}
                                    </div>
                                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                                </div>
                            </td>
                            <td><code>{item.type}</code></td>
                            <td>{item.cost}</td>
                            <td><span className="badge badge-success">Active</span></td>
                            <td>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button className="btn btn-ghost" style={{ padding: '6px' }}><Edit2 size={16} /></button>
                                    <button className="btn btn-ghost" style={{ padding: '6px' }}><Trash2 size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const Zap = ({ color }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
);

export default ShopManagement;
