import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import apiService from './services/api';

export default function BalapanResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { email, code } = location.state || {}; // Get passed state

  useEffect(() => {
    if (!email || !code) {
      navigate('/password'); // Redirect back if accessed directly
    }
  }, [email, code, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      setError('Пароль должен быть минимум 6 символов');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await apiService.resetPassword(email, code, newPassword);
    setLoading(false);

    if (result.success) {
      alert('Пароль успешно изменен! Вы можете войти с новым паролем.');
      navigate('/login');
    } else {
      setError(result.message || 'Ошибка смены пароля');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFECF' }}>
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center">
        <a href="/">
          <img
            src="/fav.png"
            className="h-18 cursor-pointer hover:opacity-80 transition"
            alt="Balapan Logo"
          />
        </a>
        <a href="/password">
          <button className="p-3 mr-8 bg-white rounded-full hover:bg-pink-50 transition shadow-md hover:shadow-lg">
            <ArrowLeft size={24} color="#F9ADD1" strokeWidth={2.5} />
          </button>
        </a>
      </header>

      {/* Form Container */}
      <div className="max-w-lg mx-auto px-6 pt-16">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-10">
          Новый пароль
        </h1>

        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

        {/* New Password Field */}
        <div className="mb-32">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Новый пароль:
          </label>
          <input
            type="text"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min 6 characters"
            className={`w-full px-4 py-3 text-base border rounded-lg bg-white transition-colors ${newPassword ? 'border-blue-400 text-gray-800' : 'border-gray-300 text-gray-500'
              }`}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="block w-full bg-pink-300 hover:bg-pink-400 text-white font-bold py-4 px-8 rounded-2xl transition shadow-[0_4px_0_0_#C54554] text-center"
        >
          {loading ? 'СОХРАНЕНИЕ...' : 'ПОДТВЕРДИТЬ'}
        </button>
      </div>
    </div>
  );
}