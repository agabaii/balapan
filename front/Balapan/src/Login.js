// src/Login.jsx
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from './services/api';

export default function BalapanLogin() {
  const navigate = useNavigate();
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
      setError('Username должен быть минимум 3 символа');
      setLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      setError('Пароль должен быть минимум 6 символов');
      setLoading(false);
      return;
    }

    const result = await apiService.login(username, password);
    
    if (result.success) {
      navigate('/language');
    } else {
      setError(result.message || 'Ошибка входа');
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
      <div className="max-w-lg mx-auto px-8 py-16">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-10">
          Уже есть аккаунт?
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
              Username:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите username"
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-white text-gray-800"
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div className="mb-10">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
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
            {loading ? 'ВХОД...' : 'ПРОДОЛЖИТЬ'}
          </button>
        </form>

        {/* Forgot Password Link */}
        <Link to="/password" className="block text-center text-sm text-gray-500">
          Забыли пароль? <span className="text-pink-300 font-semibold">Восстановить</span>
        </Link>
      </div>
    </div>
  );
}