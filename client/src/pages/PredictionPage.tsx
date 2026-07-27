import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, User, Users, BookOpen, Heart, Award,
  AlertTriangle, CheckCircle,
  RefreshCw, Sparkles,
} from 'lucide-react';
import { usePrediction } from '../contexts/PredictionContext';
import type { PredictionRequest } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const COLORS_PROB = ['#10b981', '#f59e0b', '#ef4444'];
const SECTION_ICONS = { demographics: User, family: Users, academic: BookOpen, health: Heart, grades: Award } as const;

const GRADE_LETTERS = [
  { label: 'A (Excellent)', value: '18' },
  { label: 'B (Good)', value: '15' },
  { label: 'C (Average)', value: '12' },
  { label: 'D (Below Average)', value: '8' },
  { label: 'E (Poor)', value: '4' },
  { label: 'F (Fail)', value: '1' },
];

const inputFields: {
  label: string; key: keyof PredictionRequest; type: string;
  min?: number; max?: number; step?: number; options?: { label: string; value: string }[];
  section: keyof typeof SECTION_ICONS;
}[] = [
  { label: 'Sex', key: 'sex', type: 'select', options: [{ label: 'Male', value: 'M' }, { label: 'Female', value: 'F' }], section: 'demographics' },
  { label: 'Age', key: 'age', type: 'number', min: 15, max: 22, section: 'demographics' },
  { label: 'Address Type', key: 'address', type: 'select', options: [{ label: 'Urban', value: 'U' }, { label: 'Rural', value: 'R' }], section: 'demographics' },
  { label: 'Family Size', key: 'famsize', type: 'select', options: [{ label: '\u22643', value: 'LE3' }, { label: '>3', value: 'GT3' }], section: 'demographics' },
  { label: 'Parent Status', key: 'pstatus', type: 'select', options: [{ label: 'Together', value: 'T' }, { label: 'Apart', value: 'A' }], section: 'demographics' },

  { label: "Mother's Education", key: 'medu', type: 'select', options: [{ label: 'None', value: '0' }, { label: 'Primary', value: '1' }, { label: 'Secondary', value: '2' }, { label: 'Higher', value: '3' }, { label: 'Higher', value: '4' }], section: 'family' },
  { label: "Father's Education", key: 'fedu', type: 'select', options: [{ label: 'None', value: '0' }, { label: 'Primary', value: '1' }, { label: 'Secondary', value: '2' }, { label: 'Higher', value: '3' }, { label: 'Higher', value: '4' }], section: 'family' },
  { label: "Mother's Job", key: 'mjob', type: 'select', options: [{ label: 'Teacher', value: 'teacher' }, { label: 'Health', value: 'health' }, { label: 'Services', value: 'services' }, { label: 'At Home', value: 'at_home' }, { label: 'Other', value: 'other' }], section: 'family' },
  { label: "Father's Job", key: 'fjob', type: 'select', options: [{ label: 'Teacher', value: 'teacher' }, { label: 'Health', value: 'health' }, { label: 'Services', value: 'services' }, { label: 'At Home', value: 'at_home' }, { label: 'Other', value: 'other' }], section: 'family' },
  { label: 'Reason for School Choice', key: 'reason', type: 'select', options: [{ label: 'Home', value: 'home' }, { label: 'Reputation', value: 'reputation' }, { label: 'Course', value: 'course' }, { label: 'Other', value: 'other' }], section: 'family' },
  { label: 'Guardian', key: 'guardian', type: 'select', options: [{ label: 'Mother', value: 'mother' }, { label: 'Father', value: 'father' }, { label: 'Other', value: 'other' }], section: 'family' },

  { label: 'Travel Time to School', key: 'traveltime', type: 'select', options: [{ label: '<15 min', value: '1' }, { label: '15-30 min', value: '2' }, { label: '30-60 min', value: '3' }, { label: '>60 min', value: '4' }], section: 'academic' },
  { label: 'Weekly Study Time', key: 'studytime', type: 'select', options: [{ label: '<2 hrs', value: '1' }, { label: '2-5 hrs', value: '2' }, { label: '5-10 hrs', value: '3' }, { label: '>10 hrs', value: '4' }], section: 'academic' },
  { label: 'Past Class Failures', key: 'failures', type: 'select', options: [{ label: '0', value: '0' }, { label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' }, { label: '4', value: '4' }], section: 'academic' },
  { label: 'School Educational Support', key: 'schoolsup', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }], section: 'academic' },
  { label: 'Family Educational Support', key: 'famsup', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }], section: 'academic' },
  { label: 'Extra Paid Classes', key: 'paid', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }], section: 'academic' },
  { label: 'Extra-curricular Activities', key: 'activities', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }], section: 'academic' },
  { label: 'Attended Nursery School', key: 'nursery', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }], section: 'academic' },
  { label: 'Higher Education Aspiration', key: 'higher', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }], section: 'academic' },
  { label: 'Internet Access at Home', key: 'internet', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }], section: 'academic' },
  { label: 'In a Romantic Relationship', key: 'romantic', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }], section: 'academic' },

  { label: 'Family Relationship Quality', key: 'famrel', type: 'select', options: [{ label: '1 - Very Poor', value: '1' }, { label: '2 - Poor', value: '2' }, { label: '3 - Fair', value: '3' }, { label: '4 - Good', value: '4' }, { label: '5 - Excellent', value: '5' }], section: 'health' },
  { label: 'Free Time After School', key: 'freetime', type: 'select', options: [{ label: '1 - Very Low', value: '1' }, { label: '2 - Low', value: '2' }, { label: '3 - Moderate', value: '3' }, { label: '4 - High', value: '4' }, { label: '5 - Very High', value: '5' }], section: 'health' },
  { label: 'Going Out with Friends', key: 'goout', type: 'select', options: [{ label: '1 - Very Rarely', value: '1' }, { label: '2 - Rarely', value: '2' }, { label: '3 - Sometimes', value: '3' }, { label: '4 - Often', value: '4' }, { label: '5 - Very Often', value: '5' }], section: 'health' },
  { label: 'Workday Alcohol Consumption', key: 'dalc', type: 'select', options: [{ label: '1 - Very Low', value: '1' }, { label: '2 - Low', value: '2' }, { label: '3 - Moderate', value: '3' }, { label: '4 - High', value: '4' }, { label: '5 - Very High', value: '5' }], section: 'health' },
  { label: 'Weekend Alcohol Consumption', key: 'walc', type: 'select', options: [{ label: '1 - Very Low', value: '1' }, { label: '2 - Low', value: '2' }, { label: '3 - Moderate', value: '3' }, { label: '4 - High', value: '4' }, { label: '5 - Very High', value: '5' }], section: 'health' },
  { label: 'Current Health Status', key: 'health', type: 'select', options: [{ label: '1 - Very Poor', value: '1' }, { label: '2 - Poor', value: '2' }, { label: '3 - Fair', value: '3' }, { label: '4 - Good', value: '4' }, { label: '5 - Excellent', value: '5' }], section: 'health' },
  { label: 'School Absences', key: 'absences', type: 'number', min: 0, max: 50, section: 'health' },

  { label: 'Prior Maths Grade', key: 'g1', type: 'select', options: GRADE_LETTERS, section: 'grades' },
  { label: 'Last Maths Grade', key: 'g2', type: 'select', options: GRADE_LETTERS, section: 'grades' },
];

const sections: { id: keyof typeof SECTION_ICONS; label: string }[] = [
  { id: 'demographics', label: 'Student Demographics' },
  { id: 'family', label: 'Family Background' },
  { id: 'academic', label: 'Academic Factors' },
  { id: 'health', label: 'Personal & Health' },
  { id: 'grades', label: 'Prior Grades' },
];

const defaultForm: PredictionRequest = {
  sex: 'F', age: 17, address: 'U', famsize: 'LE3',
  pstatus: 'T', medu: 2, fedu: 2, mjob: 'other', fjob: 'other',
  reason: 'course', guardian: 'mother', traveltime: 2, studytime: 2,
  failures: 0, schoolsup: 'no', famsup: 'no', paid: 'no',
  activities: 'no', nursery: 'yes', higher: 'yes', internet: 'yes',
  romantic: 'no', famrel: 4, freetime: 3, goout: 3, dalc: 1,
  walc: 1, health: 4, absences: 4, g1: 12, g2: 12,
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

  const getPerformanceColor = (p: string) => {
    if (p === 'High') return 'text-emerald-400';
    if (p === 'Average') return 'text-amber-400';
    return 'text-red-400';
  };

  const probData = result
    ? Object.entries(result.probabilities).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Performance Prediction</h2>
        <p className="text-navy-400 mt-1">Enter student details to predict academic performance (High / Average / Low) based on UCI Student Performance dataset features.</p>
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

          {sections.map((sec) => {
            const Icon = SECTION_ICONS[sec.id];
            return (
              <div key={sec.id}>
                <h4 className="flex items-center gap-1.5 text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3">
                  <Icon className="w-3.5 h-3.5" />
                  {sec.label}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inputFields.filter((f) => f.section === sec.id).map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-navy-300 mb-1.5">
                        {field.label}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          value={form[field.key] as string}
                          onChange={(e) => updateField(field.key, e.target.value)}
                          className="w-full px-3 py-2 bg-navy-900/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                        >
                          {field.options?.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type} min={field.min} max={field.max} step={field.step ?? 1}
                          value={form[field.key]}
                          onChange={(e) => updateField(field.key, field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                          className="w-full px-3 py-2 bg-navy-900/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isPredicting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg font-semibold transition-all">
              {isPredicting ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Predicting...</>
              ) : (
                <><Brain className="w-4 h-4" /> Predict Performance</>
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
                <p className="text-navy-400">Analyzing student data...</p>
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
                    <h3 className="text-lg font-semibold text-white">Predicted Performance</h3>
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-center py-4">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                      <h2 className={`text-5xl font-bold ${getPerformanceColor(result.prediction)}`}>
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
                  <h3 className="text-lg font-semibold text-white mb-4">Probability Distribution</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={probData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                      <XAxis dataKey="name" stroke="#627d98" tick={{ fontSize: 14 }} />
                      <YAxis stroke="#627d98" tick={{ fontSize: 12 }} unit="%" domain={[0, 100]} />
                      <Tooltip contentStyle={{ background: '#1e3a5f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {probData.map((_, i) => <Cell key={i} fill={COLORS_PROB[i % COLORS_PROB.length]} />)}
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
                  Fill in the student details across demographics, family background, academic factors, personal health, and prior grades to get a performance prediction.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
