// src/components/Header.jsx
import { Link } from 'react-router-dom';
import apiService from '../services/api';

export default function Header({ showProfileLink = true }) {
  const isLoggedIn = apiService.isLoggedIn();

  return (
    <header className="px-6 py-4 flex justify-between items-center">
      <Link to="/">
        <img 
          src="/fav.png" 
          className="h-18 cursor-pointer hover:opacity-80 transition"
          alt="Balapan Logo"
        />
      </Link>
      <div className="flex items-center gap-4">
        {isLoggedIn && showProfileLink && (
          <>
            <Link to="/lesson" className="text-base font-bold text-gray-700 hover:text-gray-900">
              Уроки
            </Link>
            <Link to="/stories" className="text-base font-bold text-gray-700 hover:text-gray-900">
              Истории
            </Link>
            <Link to="/profile">
              <img 
                src="/ava.jpg" 
                className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-pink-400 transition"
                alt="Avatar"
              />
            </Link>
          </>
        )}
      </div>
    </header>
  );
}