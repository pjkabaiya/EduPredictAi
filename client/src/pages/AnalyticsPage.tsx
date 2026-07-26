import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import type { AnalyticsData } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#ec4899'];

export function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<AnalyticsData>('/analytics')
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return <div className="text-navy-400 text-center py-20">Failed to load analytics.</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
        <p className="text-navy-400 mt-1">Comprehensive analysis of mathematics performance data and key influencing factors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.performance_distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="category" stroke="#627d98" />
              <YAxis stroke="#627d98" />
              <Tooltip contentStyle={{ background: '#1e3a5f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {data.performance_distribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Study Time vs Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.studytime_performance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="range" stroke="#627d98" />
              <YAxis stroke="#627d98" />
              <Tooltip contentStyle={{ background: '#1e3a5f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="avg_g3" radius={[6, 6, 0, 0]} fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Failures Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.failures_distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="failures" stroke="#627d98" />
              <YAxis stroke="#627d98" />
              <Tooltip contentStyle={{ background: '#1e3a5f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Parental Education vs Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.parental_education}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="level" stroke="#627d98" />
              <YAxis stroke="#627d98" />
              <Tooltip contentStyle={{ background: '#1e3a5f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="avg_g3" radius={[4, 4, 0, 0]} fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Gender vs Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.gender_performance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="gender" stroke="#627d98" />
              <YAxis stroke="#627d98" />
              <Tooltip contentStyle={{ background: '#1e3a5f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="high" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="average" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="low" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Feature Importance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.feature_importance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis type="number" stroke="#627d98" />
              <YAxis dataKey="feature" type="category" stroke="#627d98" width={120} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#1e3a5f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                {data.feature_importance.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Internet Access Impact</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.internet_access}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
            <XAxis dataKey="access" stroke="#627d98" />
            <YAxis stroke="#627d98" />
            <Tooltip contentStyle={{ background: '#1e3a5f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
            <Bar dataKey="avg_g3" radius={[6, 6, 0, 0]} fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Daily Predictions Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data.trends.daily_predictions.map((v, i) => ({ day: i + 1, value: v }))}>
              <defs>
                <linearGradient id="dp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="day" stroke="#627d98" hide />
              <YAxis stroke="#627d98" hide />
              <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#dp)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Model Accuracy Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data.trends.model_accuracy.map((v, i) => ({ day: i + 1, value: v }))}>
              <defs>
                <linearGradient id="ma" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} /><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="day" stroke="#627d98" hide />
              <YAxis stroke="#627d98" hide />
              <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="url(#ma)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Avg Confidence Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data.trends.avg_confidence.map((v, i) => ({ day: i + 1, value: v }))}>
              <defs>
                <linearGradient id="ac" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} /><stop offset="95%" stopColor="#f59e0b" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="day" stroke="#627d98" hide />
              <YAxis stroke="#627d98" hide />
              <Area type="monotone" dataKey="value" stroke="#f59e0b" fill="url(#ac)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Correlation Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left text-navy-400 p-2"></th>
                {Object.keys(data.correlation_matrix).map((k) => (
                  <th key={k} className="text-center text-navy-400 p-2 capitalize">{k.replace('_', ' ')}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.correlation_matrix).map(([row, cols]) => (
                <tr key={row}>
                  <td className="text-left text-navy-300 p-2 font-medium capitalize">{row.replace('_', ' ')}</td>
                  {Object.entries(cols).map(([col, val]) => {
                    const intensity = Math.abs(val);
                    const color = val > 0
                      ? `rgba(16, 185, 129, ${intensity})`
                      : `rgba(239, 68, 68, ${intensity})`;
                    return (
                      <td key={col} className="text-center p-2 rounded" style={{ backgroundColor: color }}>
                        <span className="text-white text-xs font-mono">{val.toFixed(2)}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
