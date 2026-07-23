import { motion } from 'framer-motion';
import {
  Brain, Target, AlertTriangle, CheckCircle,
  BarChart3, Lightbulb, Shield, Award,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const featureImportance = [
  { feature: 'KCSE Grade', importance: 0.25 },
  { feature: 'Study Hours/Week', importance: 0.20 },
  { feature: 'KCPE Marks', importance: 0.18 },
  { feature: 'Attendance', importance: 0.15 },
  { feature: 'Prev Univ Grade', importance: 0.12 },
  { feature: 'Assignment Completion', importance: 0.07 },
  { feature: 'Sleep Hours', importance: 0.03 },
];

const riskFactors = [
  { factor: 'Low KCPE Marks (< 250/500)', impact: 'High', severity: 88 },
  { factor: 'Poor KCSE Grade (C- & below)', impact: 'High', severity: 92 },
  { factor: 'Low Study Hours (< 20/week)', impact: 'High', severity: 82 },
  { factor: 'Poor Attendance (< 70%)', impact: 'Medium', severity: 68 },
  { factor: 'Low Assignment Completion', impact: 'Medium', severity: 60 },
  { factor: 'Insufficient Sleep (< 6hrs)', impact: 'Low', severity: 40 },
];

const recommendations = [
  'Strengthen KCSE subject foundations before university-level coursework',
  'Increase weekly study hours to at least 20 for consistent performance',
  'Maintain attendance above 80% to stay aligned with lecture content',
  'Complete all assignments to reinforce understanding and improve grades',
  'Ensure 7-8 hours of sleep for optimal cognitive function',
  'Use internet resources for additional learning and research',
];

export function AIInsightsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">AI Insights</h2>
        <p className="text-navy-400 mt-1">Deep analysis of Kenyan academic predictions and student risk factors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" /> Top Important Features
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={featureImportance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis type="number" stroke="#627d98" tick={{ fontSize: 12 }} />
              <YAxis dataKey="feature" type="category" stroke="#627d98" width={130} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#1e3a5f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                {featureImportance.map((_, i) => (
                  <rect key={i} fill={['#10b981', '#34d399', '#6ee7b7', '#f59e0b', '#f97316', '#ef4444', '#8b5cf6'][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" /> Student Risk Factors
          </h3>
          <div className="space-y-3">
            {riskFactors.map((rf) => (
              <div key={rf.factor} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-navy-300">{rf.factor}</p>
                  <div className="w-full h-1.5 rounded-full bg-navy-700 mt-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${rf.severity}%` }}
                      className={`h-full rounded-full ${rf.severity > 75 ? 'bg-red-500' : rf.severity > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    />
                  </div>
                </div>
                <span className={`ml-3 text-xs font-medium px-2 py-0.5 rounded ${
                  rf.impact === 'High' ? 'bg-red-500/10 text-red-400' :
                  rf.impact === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                }`}>{rf.impact}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-emerald-400" /> Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-navy-900/30 border border-white/5">
              <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-navy-300">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6 text-center">
          <Brain className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
          <p className="text-2xl font-bold text-white">90.5%</p>
          <p className="text-sm text-navy-400">Prediction Accuracy</p>
        </div>
        <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6 text-center">
          <Award className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
          <p className="text-2xl font-bold text-white">5</p>
          <p className="text-sm text-navy-400">Grade Categories (A-F)</p>
        </div>
        <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6 text-center">
          <Target className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
          <p className="text-2xl font-bold text-white">12</p>
          <p className="text-sm text-navy-400">Features Analyzed</p>
        </div>
      </div>
    </motion.div>
  );
}
