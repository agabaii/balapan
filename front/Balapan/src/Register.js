// src/Register.jsx
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from './services/api';

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Registration info, 2: Verification code
  const [verificationCode, setVerificationCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (step === 1) {
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

      if (!email || !email.includes('@')) {
        setError('Введите корректный email');
        setLoading(false);
        return;
      }

      const result = await apiService.register(username, email, password, 'ru');

      if (result.success) {
        setStep(2);
      } else {
        setError(result.message || 'Ошибка регистрации');
      }
    } else {
      // Step 2: Verification
      if (!verificationCode || verificationCode.length < 6) {
        setError('Введите корректный код (6 цифр)');
        setLoading(false);
        return;
      }

      const result = await apiService.verify(email, verificationCode);

      if (result.success) {
        navigate('/language');
      } else {
        setError(result.message || 'Неверный код');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFECF' }}>
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

      <div className="max-w-lg mx-auto px-8 py-16">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-10">
          {step === 1 ? 'Начинаем изучение с Балапан' : 'Подтверждение почты'}
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Username:
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Введите username (минимум 3 символа)"
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-white text-gray-800"
                  disabled={loading}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Password:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль (минимум 6 символов)"
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-white text-gray-800"
                  disabled={loading}
                />
              </div>

              <div className="mb-10">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Почта:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-white text-gray-800"
                  disabled={loading}
                />
              </div>
            </>
          ) : (
            <div className="mb-10 text-center">
              <p className="text-gray-600 mb-6">
                Мы отправили код подтверждения на <b>{email}</b>. Проверьте вашу почту.
              </p>
              <label className="block text-sm font-semibold text-gray-800 mb-2 text-left">
                Код подтверждения:
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="******"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-white text-gray-800 text-center text-2xl tracking-widest"
                disabled={loading}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="block w-full bg-pink-300 hover:bg-pink-400 text-white font-bold py-4 px-8 rounded-2xl transition shadow-[0_4px_0_0_#C54554] text-center mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'ПОДОЖДИТЕ...' : step === 1 ? 'ПРОДОЛЖИТЬ' : 'ПОДТВЕРДИТЬ'}
          </button>
        </form>

        <Link to="/login" className="block text-center text-sm text-gray-500">
          уже есть аккаунт? <span className="text-pink-300 font-semibold">Войти</span>
        </Link>
      </div>
    </div>
  );
}