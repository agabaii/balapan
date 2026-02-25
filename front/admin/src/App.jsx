import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  LayoutDashboard,
  ShieldAlert,
  ShoppingBag
} from 'lucide-react';

// Pages
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import CourseManagement from './pages/CourseManagement';
import CourseDetail from './pages/CourseDetail';
import LessonEditor from './pages/LessonEditor';
import ShopManagement from './pages/ShopManagement';
import Login from './pages/Login';

const SidebarLink = ({ to, icon, label }) => (
  <NavLink to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
    {icon}
    <span>{label}</span>
  </NavLink>
);

const Sidebar = ({ onLogout }) => (
  <div className="sidebar">
    <div style={{ padding: '0 1rem 2rem 1rem' }}>
      <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ShieldAlert size={28} /> Balapan Админ
      </h2>
    </div>

    <nav>
      <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="Панель" />
      <SidebarLink to="/users" icon={<Users size={20} />} label="Пользователи" />
      <SidebarLink to="/courses" icon={<BookOpen size={20} />} label="Курсы" />
    </nav>

    <div style={{ position: 'absolute', bottom: '2rem', left: '1rem', right: '1rem' }}>
      <button
        onClick={onLogout}
        className="btn btn-ghost"
        style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--danger)' }}
      >
        Выйти
      </button>
      <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '12px', marginTop: '1rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>Администратор:</p>
        <p style={{ fontWeight: 600, color: 'var(--success)' }}>● admin</p>
      </div>
    </div>
  </div>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('adminAuth') === 'true'
  );

  const handleLogin = () => {
    localStorage.setItem('adminAuth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar onLogout={handleLogout} />
        <main className="main-content" style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/courses" element={<CourseManagement />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/lessons/:lessonId" element={<LessonEditor />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
