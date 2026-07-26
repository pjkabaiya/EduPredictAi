import { motion } from 'framer-motion';
import {
  Brain, Target, AlertTriangle, CheckCircle,
  BarChart3, Lightbulb, Shield, Award,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const featureImportance = [
  { feature: 'G2 (Second Period Grade)', importance: 0.32 },
  { feature: 'G1 (First Period Grade)', importance: 0.25 },
  { feature: 'Number of Past Failures', importance: 0.12 },
  { feature: 'Weekly Study Time', importance: 0.08 },
  { feature: 'School Absences', importance: 0.06 },
  { feature: "Mother's Education Level", importance: 0.04 },
  { feature: "Father's Education Level", importance: 0.03 },
  { feature: 'School Educational Support', importance: 0.03 },
  { feature: 'Internet Access at Home', importance: 0.02 },
  { feature: 'Student Health Status', importance: 0.02 },
];

const riskFactors = [
  { factor: 'Multiple Past Failures (> 2)', impact: 'High', severity: 92 },
  { factor: 'Low Study Time (< 2 hrs/week)', impact: 'High', severity: 85 },
  { factor: 'High Absences (> 20)', impact: 'High', severity: 80 },
  { factor: 'Low First Period Grade (< 8)', impact: 'Medium', severity: 72 },
  { factor: 'No Internet Access at Home', impact: 'Medium', severity: 58 },
  { factor: 'Low Parental Education', impact: 'Low', severity: 42 },
];

const recommendations = [
  'Increase weekly study time to at least 5-10 hours for better mathematics performance',
  'Address past academic failures through remedial support and tutoring',
  'Maintain consistent school attendance above 95% to stay aligned with coursework',
  'Utilise internet resources and online mathematics practice platforms',
  'Seek school educational support programs and teacher consultations',
  'Establish a regular study routine with focused mathematics practice',
  'Engage family educational support for homework and learning activities',
];

export function AIInsightsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">AI Insights</h2>
        <p className="text-navy-400 mt-1">Deep analysis of mathematics performance predictions and key influencing factors.</p>
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
              <YAxis dataKey="feature" type="category" stroke="#627d98" width={170} tick={{ fontSize: 12 }} />
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
            <AlertTriangle className="w-5 h-5 text-amber-400" /> Key Performance Factors
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
          <p className="text-2xl font-bold text-white">91.2%</p>
          <p className="text-sm text-navy-400">Prediction Accuracy</p>
        </div>
        <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6 text-center">
          <Award className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
          <p className="text-2xl font-bold text-white">3</p>
          <p className="text-sm text-navy-400">Performance Classes</p>
        </div>
        <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6 text-center">
          <Target className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
          <p className="text-2xl font-bold text-white">33</p>
          <p className="text-sm text-navy-400">Features Analyzed</p>
        </div>
      </div>
    </motion.div>
  );
}
