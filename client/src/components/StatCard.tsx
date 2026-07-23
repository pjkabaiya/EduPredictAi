import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Brain, Users, Target, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

const iconComponents: Record<string, typeof Brain> = {
  Brain, Users, Target, AlertTriangle,
};

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: string;
  color: string;
  delay?: number;
}

export function StatCard({ title, value, change, icon, color, delay = 0 }: StatCardProps) {
  const Icon = iconComponents[icon] || Brain;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-navy-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center', color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={clsx('flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full', change >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10')}>
          {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-navy-400 mt-1">{title}</p>
      </div>
    </motion.div>
  );
}
