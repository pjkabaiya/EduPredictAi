import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Brain,
  BarChart3,
  Activity,
  Database,
  Info,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Prediction', path: '/prediction', icon: Brain },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Model Performance', path: '/model-performance', icon: Activity },
  { label: 'Dataset Explorer', path: '/dataset', icon: Database },
  { label: 'About', path: '/about', icon: Info },
  { label: 'Team', path: '/team', icon: Users },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      className="fixed left-0 top-0 h-screen bg-navy-900/80 backdrop-blur-xl border-r border-white/5 z-50 flex flex-col"
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
        <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-5 h-5 text-emerald-400" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-lg text-white whitespace-nowrap"
            >
              MathPredict
              <span className="text-emerald-400">AI</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-navy-300 hover:text-white hover:bg-white/5 border border-transparent'
              )
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {user && !collapsed && (
        <div className="px-4 py-3 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <span className="text-xs font-bold text-emerald-400">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-navy-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 border-t border-white/5 text-navy-400 hover:text-white transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4 mx-auto" /> : <ChevronLeft className="w-4 h-4 mx-auto" />}
      </button>
    </motion.aside>
  );
}
