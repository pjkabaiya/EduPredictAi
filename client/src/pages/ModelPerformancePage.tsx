import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import type { ModelPerformance } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { Target, Crosshair, Activity, Shield, GitBranch, Clock, Zap, CheckCircle } from 'lucide-react';

const COLORS = ['#10b981', '#34d399', '#6ee7b7'];

export function ModelPerformancePage() {
  const [data, setData] = useState<ModelPerformance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<ModelPerformance>('/model')
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return <div className="text-navy-400 text-center py-20">Failed to load model data.</div>;

  const metrics = [
    { label: 'Accuracy', value: (data.accuracy * 100).toFixed(1) + '%', icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Precision', value: (data.precision * 100).toFixed(1) + '%', icon: Crosshair, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Recall', value: (data.recall * 100).toFixed(1) + '%', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'F1 Score', value: (data.f1_score * 100).toFixed(1) + '%', icon: Shield, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'ROC AUC', value: (data.roc_auc * 100).toFixed(1) + '%', icon: GitBranch, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { label: 'CV Score', value: (data.model_info.cross_validation_score * 100).toFixed(1) + '%', icon: CheckCircle, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  ];

  const crData = Object.entries(data.classification_report).map(([cls, m]) => ({ category: cls, ...m }));
  const fiData = data.feature_importance.slice(0, 6);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Model Performance</h2>
        <p className="text-navy-400 mt-1">Comprehensive evaluation metrics for the mathematics performance prediction model.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-navy-800/50 border border-white/5 rounded-xl p-4 text-center">
            <div className={`w-10 h-10 rounded-lg ${m.bg} flex items-center justify-center mx-auto mb-3`}>
              <m.icon className={`w-5 h-5 ${m.color}`} />
            </div>
            <p className="text-xl font-bold text-white">{m.value}</p>
            <p className="text-xs text-navy-400 mt-1">{m.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Classification Report</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={crData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="category" stroke="#627d98" tick={{ fontSize: 11 }} />
              <YAxis stroke="#627d98" domain={[0, 1]} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1e3a5f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="precision" name="Precision" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="recall" name="Recall" fill="#34d399" radius={[4, 4, 0, 0]} />
              <Bar dataKey="f1-score" name="F1-Score" fill="#6ee7b7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Classification Report</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-navy-400 text-xs">
                  <th className="p-2 text-left">Class</th>
                  <th className="p-2 text-right">Precision</th>
                  <th className="p-2 text-right">Recall</th>
                  <th className="p-2 text-right">F1-Score</th>
                  <th className="p-2 text-right">Support</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.classification_report).map(([cls, metrics]) => (
                  <tr key={cls} className="border-t border-white/5">
                    <td className="p-2 font-medium text-white">{cls}</td>
                    <td className="p-2 text-right text-navy-300">{metrics.precision.toFixed(2)}</td>
                    <td className="p-2 text-right text-navy-300">{metrics.recall.toFixed(2)}</td>
                    <td className="p-2 text-right text-navy-300">{metrics['f1-score'].toFixed(2)}</td>
                    <td className="p-2 text-right text-navy-300">{metrics.support}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Feature Importance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fiData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis type="number" stroke="#627d98" tick={{ fontSize: 11 }} />
              <YAxis dataKey="feature" type="category" stroke="#627d98" width={140} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1e3a5f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                {fiData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Model Configuration</h3>
          <div className="space-y-4">
            {[
              { label: 'Best Model', value: data.model_info.best_model },
              { label: 'Algorithm', value: data.model_info.algorithm },
              { label: 'Candidate Models', value: data.model_info.candidates.join(', ') },
              { label: 'Number of Estimators', value: data.model_info.n_estimators },
              { label: 'Max Depth', value: data.model_info.max_depth },
              { label: 'Training Samples', value: data.model_info.training_samples },
              { label: 'Test Samples', value: data.model_info.test_samples },
              { label: 'Training Time', value: data.model_info.training_time, icon: Clock },
              { label: 'Inference Time', value: data.model_info.inference_time, icon: Zap },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2">
                  {m.icon && <m.icon className="w-4 h-4 text-navy-400" />}
                  <span className="text-sm text-navy-300">{m.label}</span>
                </div>
                <span className="text-sm font-medium text-white">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
