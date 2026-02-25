// src/Login.jsx
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from './services/api';

import { getTranslation } from './translations';

export default function BalapanLogin() {
  const navigate = useNavigate();
  const t = getTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Валидация
    if (!username || username.length < 3) {
      setError(t.usernameMin);
      setLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      setError(t.passwordMin);
      setLoading(false);
      return;
    }

    const result = await apiService.login(username, password);

    if (result.success) {
      // Если уже есть активный курс — сразу на уроки, иначе выбор языка
      const activeCourses = JSON.parse(localStorage.getItem('activeCourses') || '[]');
      if (activeCourses.length > 0) {
        navigate('/lesson');
      } else {
        navigate('/language');
      }
    } else {
      setError(result.message || t.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFECF' }}>
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center">
        <Link to="/">
          <img
            src="/fav.png"
            className="h-18 cursor-pointer hover:opacity-80 transition"
            alt="Balapan Logo"
          />
        </Link>
        <Link to="/">
          <button className="p-3 mr-8 bg-white rounded-full hover:bg-pink-50 transition shadow-md hover:shadow-lg">
            <ArrowLeft size={24} color="#F9ADD1" strokeWidth={2.5} />
          </button>
        </Link>
      </header>

      {/* Form Container */}
      <div className="max-w-lg mx-auto px-8 py-4">
        {/* Mascot Image */}
        <div className="flex justify-center mb-4">
          <img
            src="/balapan.png"
            alt="Balapan Mascot"
            className="w-32 h-32 object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          {t.haveAccount}
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              {t.username}:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t.username}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-white text-gray-800"
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div className="mb-10">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              {t.password}:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.password}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-white text-gray-800"
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="block w-full bg-pink-300 hover:bg-pink-400 text-white font-bold py-4 px-8 rounded-2xl transition shadow-[0_4px_0_0_#C54554] text-center mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t.wait : t.continue}
          </button>
        </form>

        {/* Footer Links */}
        <div className="space-y-4 text-center">
          <Link to="/password" className="block text-sm text-pink-400 font-bold hover:underline">
            {t.forgotPassword}
          </Link>

          <p className="text-sm text-gray-500">
            {t.dontHaveAccount} <Link to="/register" className="text-pink-300 font-bold hover:underline">{t.register}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
