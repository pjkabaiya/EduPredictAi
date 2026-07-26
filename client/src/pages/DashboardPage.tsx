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
import {
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip,
} from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

const recentPredictions = [
  { id: '#PRED-001', student: 'Alice Kamau', prediction: 'High Performance', confidence: 94.2, risk: 'Low', date: '2026-07-22' },
  { id: '#PRED-002', student: 'Bob Otieno', prediction: 'Average Performance', confidence: 78.5, risk: 'Medium', date: '2026-07-22' },
  { id: '#PRED-003', student: 'Carol Wanjiku', prediction: 'Low Performance', confidence: 88.1, risk: 'High', date: '2026-07-21' },
  { id: '#PRED-004', student: 'David Mwangi', prediction: 'High Performance', confidence: 91.7, risk: 'Low', date: '2026-07-21' },
  { id: '#PRED-005', student: 'Emily Akinyi', prediction: 'Average Performance', confidence: 82.3, risk: 'Medium', date: '2026-07-20' },
];

const weeklyTrend = [
  { day: 'Mon', predictions: 12, accuracy: 92 },
  { day: 'Tue', predictions: 18, accuracy: 94 },
  { day: 'Wed', predictions: 15, accuracy: 91 },
  { day: 'Thu', predictions: 22, accuracy: 95 },
  { day: 'Fri', predictions: 20, accuracy: 93 },
  { day: 'Sat', predictions: 8, accuracy: 96 },
  { day: 'Sun', predictions: 5, accuracy: 94 },
];

const riskDistribution = [
  { name: 'High Performance', value: 42 },
  { name: 'Average Performance', value: 50 },
  { name: 'Low Performance', value: 35 },
];

const activityLog = [
  { action: 'Performance prediction made', detail: 'Alice Kamau - High Performance', time: '2 min ago' },
  { action: 'Model retrained', detail: 'Accuracy improved to 91.2%', time: '1 hour ago' },
  { action: 'Dataset updated', detail: 'New student records added from UCI dataset', time: '3 hours ago' },
  { action: 'System health check', detail: 'All services operational', time: '5 hours ago' },
  { action: 'Feature engineering completed', detail: 'New math assessment attributes added', time: '1 day ago' },
];

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <LoadingSpinner />;

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
        <StatCard title="Total Predictions" value="1,247" change={12} icon="Brain" color="bg-emerald-500/10 text-emerald-400" delay={0.05} />
        <StatCard title="High Performers" value="48" change={6} icon="Target" color="bg-emerald-500/10 text-emerald-400" delay={0.1} />
        <StatCard title="Average Performers" value="312" change={4} icon="Users" color="bg-amber-500/10 text-amber-400" delay={0.15} />
        <StatCard title="Low Performers" value="52" change={-3} icon="AlertTriangle" color="bg-red-500/10 text-red-400" delay={0.2} />
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
              <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                {riskDistribution.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e3a5f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {riskDistribution.map((d, i) => (
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
            {recentPredictions.map((p) => (
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
              {[
                { label: 'API Server', status: 'Operational', icon: CheckCircle, color: 'text-emerald-400' },
                { label: 'ML Model', status: 'Loaded (Random Forest)', icon: Activity, color: 'text-emerald-400' },
                { label: 'Database', status: 'Connected (MongoDB)', icon: CheckCircle, color: 'text-emerald-400' },
                { label: 'Prediction Service', status: 'Ready', icon: CheckCircle, color: 'text-emerald-400' },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <s.icon className={`w-4 h-4 ${s.color}`} />
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
