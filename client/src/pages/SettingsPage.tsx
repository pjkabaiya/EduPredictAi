import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Moon, Sun, Bell, Globe, RefreshCw, LogOut, User,
  Monitor, Smartphone, Palette, Shield,
} from 'lucide-react';

export function SettingsPage() {
  const { isDark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');
  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    localStorage.removeItem('mathpredict_user');
    setResetDone(true);
    setTimeout(() => {
      logout();
      navigate('/');
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-navy-400 mt-1">Manage your application preferences.</p>
      </div>

      <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-emerald-400" /> Appearance
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="w-5 h-5 text-navy-400" /> : <Sun className="w-5 h-5 text-navy-400" />}
              <div>
                <p className="text-sm font-medium text-white">Dark Mode</p>
                <p className="text-xs text-navy-400">Toggle dark/light theme</p>
              </div>
            </div>
            <button
              onClick={toggle}
              className={`relative w-12 h-6 rounded-full transition-colors ${isDark ? 'bg-emerald-500' : 'bg-navy-600'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isDark ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-emerald-400" /> Notifications
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Push Notifications</p>
            <p className="text-xs text-navy-400">Receive alerts about predictions and updates</p>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`relative w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-emerald-500' : 'bg-navy-600'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-400" /> Language
        </h3>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}
          className="w-full max-w-xs px-3 py-2 bg-navy-900/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500/50">
          <option value="en">English</option>
          <option value="sw">Kiswahili</option>
          <option value="fr">Français</option>
        </select>
      </div>

      <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-400" /> Account
        </h3>
        {user && (
          <div className="flex items-center gap-4 p-4 rounded-lg bg-navy-900/30 border border-white/5 mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <span className="text-lg font-bold text-emerald-400">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-navy-400">{user.email}</p>
            </div>
          </div>
        )}
        <button onClick={() => { logout(); navigate('/'); }}
          className="flex items-center gap-2 px-4 py-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-medium transition-all">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-emerald-400" /> Data
        </h3>
        <p className="text-sm text-navy-400 mb-4">Reset all demo data and start fresh.</p>
        {resetDone ? (
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-sm inline-block">
            Data reset successfully! Redirecting...
          </div>
        ) : (
          <button onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-amber-500/20 text-amber-400 hover:bg-amber-500/10 rounded-lg text-sm font-medium transition-all">
            <RefreshCw className="w-4 h-4" /> Reset Demo Data
          </button>
        )}
      </div>
    </motion.div>
  );
}
