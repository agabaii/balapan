import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from './services/api';

export default function BalapanForgotPassword() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: Code
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSendCode = async () => {
    if (!email) {
      setError('Введите email');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    const result = await apiService.forgotPassword(email);
    setLoading(false);

    if (result.success) {
      setMessage(result.message);
      setStep(2);
    } else {
      setError(result.message || 'Ошибка отправки кода');
    }
  };

  const handleNext = () => {
    if (!code || code.length < 6) {
      setError('Введите корректный код');
      return;
    }
    // Navigate to new password page with email and code
    navigate('/newpass', { state: { email, code } });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFECF' }}>
      <header className="px-6 py-4 flex justify-between items-center">
        <a href="/">
          <img
            src="/fav.png"
            className="h-18 cursor-pointer hover:opacity-80 transition"
            alt="Balapan Logo"
          />
        </a>
        <a href="/login">
          <button className="p-3 mr-8 bg-white rounded-full hover:bg-pink-50 transition shadow-md hover:shadow-lg">
            <ArrowLeft size={24} color="#F9ADD1" strokeWidth={2.5} />
          </button>
        </a>
      </header>

      <div className="max-w-lg mx-auto px-6 pt-16">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-10">
          Восстановить пароль
        </h1>

        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        {message && <div className="mb-4 text-green-600 text-center">{message}</div>}

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Gmail:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={step === 2}
            placeholder="example@gmail.com"
            className={`w-full px-4 py-3 text-base border rounded-lg bg-white transition-colors ${email ? 'border-blue-400 text-gray-800' : 'border-gray-300 text-gray-500'
              }`}
          />
        </div>

        {step === 2 && (
          <div className="mb-3">
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="******"
                className={`w-full px-4 py-3 text-base border rounded-lg bg-white transition-colors ${code ? 'border-blue-400 text-gray-800' : 'border-gray-300 text-gray-500'
                  }`}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Введите код, который пришел вам на почту
            </p>
          </div>
        )}

        {step === 1 ? (
          <button
            onClick={handleSendCode}
            disabled={loading}
            className="block w-full bg-pink-300 hover:bg-pink-400 text-white font-bold py-4 px-8 rounded-2xl transition shadow-[0_4px_0_0_#C54554] text-center mt-6"
          >
            {loading ? 'ОТПРАВКА...' : 'ПОЛУЧИТЬ КОД'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="block w-full bg-pink-300 hover:bg-pink-400 text-white font-bold py-4 px-8 rounded-2xl transition shadow-[0_4px_0_0_#C54554] text-center mt-6"
          >
            ПРОДОЛЖИТЬ
          </button>
        )}
      </div>
    </div>
  );
}