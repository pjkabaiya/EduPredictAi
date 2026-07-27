import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, Users, TrendingUp, Target, CheckCircle,
  AlertTriangle, Activity, ArrowRight, Award,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../components/StatCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import {
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip,
} from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

interface DashboardData {
  stats: {
    total_predictions: number;
    high_performers: number;
    average_performers: number;
    low_performers: number;
    high_change: number;
    avg_change: number;
    low_change: number;
  };
  performance_distribution: { name: string; value: number }[];
  recent_predictions: {
    id: string; student: string; prediction: string;
    confidence: number; risk: string; date: string;
  }[];
  weekly_trend: { day: string; predictions: number; accuracy: number }[];
  system_status: { label: string; status: string; color: string }[];
  activity_log: { action: string; detail: string; time: string }[];
}

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.get<DashboardData>('/dashboard')
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const stats = data?.stats;
  const performanceDist = data?.performance_distribution ?? [];
  const predictions = data?.recent_predictions ?? [];
  const weeklyTrend = data?.weekly_trend ?? [];
  const systemStatus = data?.system_status ?? [];
  const activityLog = data?.activity_log ?? [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Welcome back, {user?.name || 'User'}!</h2>
            <p className="text-navy-400 mt-1">Here&apos;s your MathPredict AI mathematics performance overview for today.</p>
          </div>
          <button onClick={() => navigate('/prediction')}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-all">
            New Prediction <Brain className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Predictions" value={stats?.total_predictions?.toLocaleString() ?? '-'} change={0} icon="Brain" color="bg-emerald-500/10 text-emerald-400" delay={0.05} />
        <StatCard title="High Performers" value={stats?.high_performers?.toLocaleString() ?? '-'} change={stats?.high_change ?? 0} icon="Target" color="bg-emerald-500/10 text-emerald-400" delay={0.1} />
        <StatCard title="Average Performers" value={stats?.average_performers?.toLocaleString() ?? '-'} change={stats?.avg_change ?? 0} icon="Users" color="bg-amber-500/10 text-amber-400" delay={0.15} />
        <StatCard title="Low Performers" value={stats?.low_performers?.toLocaleString() ?? '-'} change={-(stats?.low_change ?? 0)} icon="AlertTriangle" color="bg-red-500/10 text-red-400" delay={0.2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-navy-800/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={weeklyTrend}>
              <defs>
                <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="day" stroke="#627d98" tick={{ fontSize: 12 }} />
              <YAxis stroke="#627d98" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#1e3a5f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              <Area type="monotone" dataKey="predictions" stroke="#10b981" fill="url(#colorPred)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={performanceDist} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                {performanceDist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e3a5f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {performanceDist.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-xs text-navy-400">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Predictions</h3>
            <button onClick={() => navigate('/prediction')} className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></button>
          </div>
          <div className="space-y-3">
            {predictions.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-navy-900/30 border border-white/5 hover:border-white/10 transition-all">
                <div>
                  <p className="text-sm font-medium text-white">{p.student}</p>
                  <p className="text-xs text-navy-400">{p.id} &middot; {p.date}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                    p.prediction === 'High Performance' ? 'bg-emerald-500/10 text-emerald-400' :
                    p.prediction === 'Average Performance' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>{p.prediction}</span>
                  <p className="text-xs text-navy-500 mt-1">{p.confidence}% confidence</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
            <div className="space-y-3">
              {systemStatus.map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`w-4 h-4 ${s.color}`} />
                    <span className="text-sm text-navy-300">{s.label}</span>
                  </div>
                  <span className={`text-xs font-medium ${s.color}`}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {activityLog.slice(0, 3).map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-white">{a.action}</p>
                    <p className="text-xs text-navy-400">{a.detail} &middot; {a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
