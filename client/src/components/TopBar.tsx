import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Moon, Sun, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';
import clsx from 'clsx';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/prediction': 'Prediction',
  '/analytics': 'Analytics',
  '/model-performance': 'Model Performance',
  '/dataset': 'Dataset Explorer',
  '/about': 'About',
  '/team': 'Team',
  '/settings': 'Settings',
};

export function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  const title = pageTitles[location.pathname] || 'MathPredict AI';

  return (
    <header className="h-16 border-b border-white/5 bg-navy-900/40 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
      <div>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg text-navy-400 hover:text-white hover:bg-white/5 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
        </button>
        <button
          onClick={toggle}
          className="p-2 rounded-lg text-navy-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <span className="text-sm font-bold text-emerald-400">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-navy-800 border border-white/10 rounded-xl shadow-xl z-20 py-2">
                <div className="px-4 py-2 border-b border-white/5">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-navy-400">{user?.email}</p>
                </div>
                <button
                  onClick={() => { setShowMenu(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-navy-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Settings
                </button>
                <button
                  onClick={() => { setShowMenu(false); logout(); navigate('/'); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
