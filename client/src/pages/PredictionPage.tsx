import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, User, Clock, Target, BookOpen, Wifi, GraduationCap,
  Moon, Zap, FileText, AlertTriangle, CheckCircle,
  RefreshCw, Sparkles, Award,
} from 'lucide-react';
import { usePrediction } from '../contexts/PredictionContext';
import type { PredictionRequest } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const COLORS_RISK = ['#10b981', '#34d399', '#6ee7b7', '#f59e0b', '#ef4444'];

const KCSE_GRADES = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "E"];
const UNI_GRADES = ["A", "B", "C", "D", "F"];
const PARENT_ED = ["Primary", "Secondary", "Diploma", "Bachelor's", "Master's", "PhD"];

const inputFields: {
  label: string; key: keyof PredictionRequest; icon: React.ComponentType<{ className?: string }>;
  type: string; min?: number; max?: number; step?: number; options?: string[]; section?: string;
}[] = [
  { label: 'Age', key: 'age', icon: User, type: 'number', min: 18, max: 45, section: 'background' },
  { label: 'Gender', key: 'gender', icon: User, type: 'select', options: ['Male', 'Female'], section: 'background' },
  { label: 'KCPE Marks (0-500)', key: 'kcpe_marks', icon: FileText, type: 'number', min: 0, max: 500, section: 'background' },
  { label: 'KCSE Grade', key: 'kcse_grade', icon: Award, type: 'select', options: KCSE_GRADES, section: 'background' },
  { label: 'Prev Univ Grade', key: 'university_previous_grade', icon: GraduationCap, type: 'select', options: [...UNI_GRADES, 'N/A'], section: 'background' },
  { label: 'Study Hours/Week', key: 'study_hours_per_week', icon: Clock, type: 'number', min: 0, max: 60, section: 'habits' },
  { label: 'Attendance %', key: 'attendance_percentage', icon: Target, type: 'number', min: 0, max: 100, section: 'habits' },
  { label: 'Assignment Completion %', key: 'assignment_completion_rate', icon: BookOpen, type: 'number', min: 0, max: 100, section: 'habits' },
  { label: 'Internet Access', key: 'internet_access', icon: Wifi, type: 'select', options: ['Yes', 'No'], section: 'other' },
  { label: 'Parent Education', key: 'parent_education', icon: GraduationCap, type: 'select', options: PARENT_ED, section: 'other' },
  { label: 'Sleep Hours', key: 'sleep_hours', icon: Moon, type: 'number', min: 0, max: 12, section: 'other' },
  { label: 'Extracurricular', key: 'extracurricular_activities', icon: Zap, type: 'select', options: ['Yes', 'No'], section: 'other' },
];

const sections = [
  { id: 'background', label: 'Student Background' },
  { id: 'habits', label: 'Study Habits' },
  { id: 'other', label: 'Other Factors' },
];

const defaultForm: PredictionRequest = {
  age: 20, gender: 'Male', kcpe_marks: 350, kcse_grade: 'B+',
  university_previous_grade: 'N/A', study_hours_per_week: 20,
  attendance_percentage: 85, assignment_completion_rate: 80,
  internet_access: 'Yes', parent_education: "Bachelor's",
  sleep_hours: 7, extracurricular_activities: 'Yes',
};

export function PredictionPage() {
  const { result, isPredicting, error, predict, clear } = usePrediction();
  const [form, setForm] = useState<PredictionRequest>(defaultForm);

  const updateField = (key: keyof PredictionRequest, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await predict(form);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'High': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-navy-400 bg-navy-500/10 border-navy-500/20';
    }
  };

  const getGradeColor = (g: string) => {
    if (g.includes('A')) return 'text-emerald-400';
    if (g.includes('B')) return 'text-blue-400';
    if (g.includes('C')) return 'text-amber-400';
    if (g.includes('D')) return 'text-orange-400';
    return 'text-red-400';
  };

  const probData = result
    ? Object.entries(result.probabilities).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Grade Prediction</h2>
        <p className="text-navy-400 mt-1">Enter student details to predict university grade (A-F) based on KCPE, KCSE, and academic habits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-navy-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-6 space-y-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Student Information</h3>
          </div>

          {sections.map((sec) => (
            <div key={sec.id}>
              <h4 className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3">{sec.label}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inputFields.filter((f) => f.section === sec.id).map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-navy-300 mb-1.5 flex items-center gap-1.5">
                      <field.icon className="w-3.5 h-3.5 text-navy-400" />
                      {field.label}
                    </label>
                    {field.type === 'select' ? (
                      <select value={form[field.key] as string} onChange={(e) => updateField(field.key, e.target.value)}
                        className="w-full px-3 py-2 bg-navy-900/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all">
                        {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={field.type} min={field.min} max={field.max} step={field.step ?? 1}
                        value={form[field.key]} onChange={(e) => updateField(field.key, field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                        className="w-full px-3 py-2 bg-navy-900/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isPredicting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg font-semibold transition-all">
              {isPredicting ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Predicting...</>
              ) : (
                <><Brain className="w-4 h-4" /> Predict Grade</>
              )}
            </button>
            <button type="button" onClick={clear}
              className="px-4 py-2.5 border border-white/10 hover:border-white/20 text-navy-300 rounded-lg text-sm transition-all">
              Clear
            </button>
          </div>
        </motion.form>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <AnimatePresence mode="wait">
            {isPredicting && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-navy-800/50 border border-white/5 rounded-xl p-12 flex flex-col items-center justify-center min-h-[500px]">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-emerald-400" />
                </motion.div>
                <p className="text-navy-400">Analyzing Kenyan academic data...</p>
              </motion.div>
            )}

            {error && (
              <motion.div key="error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="bg-navy-800/50 border border-red-500/20 rounded-xl p-8 text-center min-h-[500px] flex flex-col items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Prediction Failed</h3>
                <p className="text-navy-400 mb-4">{error}</p>
                <button onClick={() => predict(form)} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-all">Try Again</button>
              </motion.div>
            )}

            {!isPredicting && !error && result && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Predicted University Grade</h3>
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-center py-4">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                      <h2 className={`text-5xl font-bold ${getGradeColor(result.prediction)}`}>
                        {result.prediction}
                      </h2>
                    </motion.div>
                    <div className="flex items-center justify-center gap-4 mt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{result.confidence}%</p>
                        <p className="text-xs text-navy-400">Confidence</p>
                      </div>
                      <div className="w-px h-10 bg-white/10" />
                      <div className="text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(result.risk)}`}>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {result.risk} Risk
                        </span>
                        <p className="text-xs text-navy-400 mt-1">Risk Level</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Grade Probability Distribution</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={probData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                      <XAxis dataKey="name" stroke="#627d98" tick={{ fontSize: 14 }} />
                      <YAxis stroke="#627d98" tick={{ fontSize: 12 }} unit="%" domain={[0, 100]} />
                      <Tooltip contentStyle={{ background: '#1e3a5f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {probData.map((_, i) => <Cell key={i} fill={COLORS_RISK[i % COLORS_RISK.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2 text-sm text-navy-300">
                        <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        {rec}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {!isPredicting && !error && !result && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-navy-800/50 border border-white/5 rounded-xl p-12 flex flex-col items-center justify-center min-h-[500px]">
                <Award className="w-16 h-16 text-navy-600 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Ready to Predict</h3>
                <p className="text-navy-400 text-center max-w-sm">
                  Fill in the student&apos;s KCPE marks, KCSE grade, and study details to predict their likely university grade.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
