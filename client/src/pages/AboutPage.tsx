import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Brain, Database, BarChart3, GitBranch, Shield, Zap,Target, BookOpen, Users, Server, Smartphone } from 'lucide-react';

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  'React 19': Smartphone, TypeScript: Shield, TailwindCSS: Zap, 'Framer Motion': BarChart3,
  Recharts: BarChart3, Python: Brain, FastAPI: Zap, 'Scikit-learn': Target,
  Pandas: BookOpen, NumPy: Database, Git: GitBranch, GitHub: GitBranch, 'GitHub Pages': Server,
  Vercel: Server, Render: Server, 'Jupyter Notebook': BookOpen,
};

export function AboutPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/about')
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return <div className="text-navy-400 text-center py-20">Failed to load.</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white">About MathPredict AI</h2>
        <p className="text-navy-400 mt-1">{data.description}</p>
      </div>

      <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-400" /> Objectives
        </h3>
        <ul className="space-y-2">
          {data.objectives.map((o: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-sm text-navy-300">
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">{i + 1}</span>
              {o}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" /> Problem Statement
        </h3>
        <p className="text-sm text-navy-300 leading-relaxed">{data.problem_statement}</p>
      </div>

      <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-emerald-400" /> Machine Learning Pipeline
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(data.ml_pipeline).map(([stage, desc]) => (
            <div key={stage} className="p-3 rounded-lg bg-navy-900/30 border border-white/5">
              <p className="text-sm font-medium text-white capitalize mb-1">{stage.replace(/_/g, ' ')}</p>
              <p className="text-xs text-navy-400">{desc as string}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-400" /> Technologies
          </h3>
          {Object.entries(data.technologies).map(([category, techs]) => (
            <div key={category} className="mb-4 last:mb-0">
              <p className="text-xs font-medium text-navy-400 uppercase tracking-wider mb-2">{category}</p>
              <div className="flex flex-wrap gap-2">
                {(techs as string[]).map((t: string) => {
                  const Icon = icons[t] || Brain;
                  return (
                    <span key={t}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900/50 border border-white/5 text-xs text-navy-300">
                      <Icon className="w-3.5 h-3.5 text-emerald-400" />
                      {t}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-navy-800/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" /> Dataset
          </h3>
          <div className="space-y-3">
            {Object.entries(data.dataset).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-sm text-navy-300 capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="text-sm font-medium text-white">{val as string}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
