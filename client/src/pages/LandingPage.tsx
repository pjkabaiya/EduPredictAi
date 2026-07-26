import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight, Brain, BarChart3, Shield, Zap, Users,
  GraduationCap, Sparkles, TrendingUp, Target, CheckCircle,
  ChevronDown, Github, Mail, Linkedin, Menu, X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.15 },
};

const features = [
  { icon: Brain, title: 'AI-Powered Predictions', description: 'Advanced machine learning algorithms analyze student demographic, behavioural and educational data to predict mathematics performance with high accuracy.' },
  { icon: BarChart3, title: 'Performance Analytics', description: 'Interactive dashboards and visualizations provide deep insights into mathematics performance patterns and key factors.' },
  { icon: Shield, title: 'Early Risk Detection', description: 'Identify students at risk of low mathematics performance early and enable targeted interventions.' },
  { icon: Zap, title: 'Study Time Analysis', description: 'Analyse the impact of study time, past failures, and attendance on mathematics outcomes.' },
  { icon: Users, title: 'Multi-Factor Analysis', description: 'Evaluate 30+ features including family background, parental education, and school support.' },
  { icon: TrendingUp, title: 'Actionable Insights', description: 'Receive clear recommendations to help students improve their mathematics performance.' },
];

const steps = [
  { number: '01', title: 'Input Student Data', description: 'Enter demographic, family, behavioural and academic data' },
  { number: '02', title: 'AI Analysis', description: 'Our model processes data through a trained Random Forest classifier' },
  { number: '03', title: 'Get Prediction', description: 'Receive instant mathematics performance prediction with confidence score' },
  { number: '04', title: 'Take Action', description: 'Use personalised recommendations to improve mathematics outcomes' },
];

const benefits = [
  { icon: Target, title: '93% Accuracy', description: 'Our model achieves high prediction accuracy through robust training' },
  { icon: Sparkles, title: '33 Feature Analysis', description: 'Comprehensive analysis across demographic, behavioural and academic factors' },
  { icon: CheckCircle, title: 'Early Intervention', description: 'Identify struggling students before performance declines significantly' },
];

const team = [
  { name: 'Serena Muyeera', role: 'Project Manager & Research Lead', id: 'INTE/MG/3738/09/22', initials: 'SM' },
  { name: 'Nicky Lawrence', role: 'Data Engineer & EDA Lead', id: 'INTE/M/0146/01/24', initials: 'NL' },
  { name: 'Joseph Kihuria', role: 'Machine Learning Engineer', id: 'INTE/M/1179/09/23', initials: 'JK' },
  { name: 'John Peter Kabaiya', role: 'Deployment & Full Stack Lead', id: 'INTE/MK/1082/09/23', initials: 'JP' },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [mobileMenu, setMobileMenu] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

  return (
    <div className="min-h-screen bg-navy-950">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-400" />
            <span className="font-bold text-lg">MathPredict<span className="text-emerald-400">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('features')} className="text-sm text-navy-300 hover:text-white transition-colors">Features</button>
            <button onClick={() => scrollTo('how-it-works')} className="text-sm text-navy-300 hover:text-white transition-colors">How It Works</button>
            <button onClick={() => scrollTo('benefits')} className="text-sm text-navy-300 hover:text-white transition-colors">Benefits</button>
            <button onClick={() => scrollTo('team')} className="text-sm text-navy-300 hover:text-white transition-colors">Team</button>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button onClick={() => navigate('/dashboard')} className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">
                Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="hidden md:inline-block text-sm text-navy-300 hover:text-white transition-colors">Sign In</button>
                <button onClick={() => navigate('/register')} className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-navy-300">
              {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileMenu && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden border-t border-white/5 bg-navy-900 px-6 py-4 space-y-3">
            <button onClick={() => { scrollTo('features'); setMobileMenu(false); }} className="block text-sm text-navy-300 hover:text-white">Features</button>
            <button onClick={() => { scrollTo('how-it-works'); setMobileMenu(false); }} className="block text-sm text-navy-300 hover:text-white">How It Works</button>
            <button onClick={() => { scrollTo('benefits'); setMobileMenu(false); }} className="block text-sm text-navy-300 hover:text-white">Benefits</button>
            <button onClick={() => { scrollTo('team'); setMobileMenu(false); }} className="block text-sm text-navy-300 hover:text-white">Team</button>
            <div className="pt-2 flex gap-3">
              <button onClick={() => { setMobileMenu(false); navigate('/login'); }} className="flex-1 px-4 py-2 border border-white/10 text-white rounded-lg text-sm">Sign In</button>
              <button onClick={() => { setMobileMenu(false); navigate('/register'); }} className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm">Get Started</button>
            </div>
          </motion.div>
        )}
      </nav>

      <motion.section style={{ opacity, scale }} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-navy-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative text-center max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" /> AI-Powered Mathematics Analytics
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Predict Mathematics
              <br />
              Performance with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300">
                AI Precision
              </span>
            </h1>
            <p className="text-lg md:text-xl text-navy-300 mb-10 max-w-2xl mx-auto">
              Leverage machine learning to predict student mathematics outcomes, identify at-risk students,
              and provide personalised recommendations based on behavioural, demographic and educational factors.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {isAuthenticated ? (
                <button onClick={() => navigate('/prediction')} className="flex items-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/25">
                  Start Predicting <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button onClick={() => navigate('/register')} className="flex items-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/25">
                  Start Predicting <ArrowRight className="w-5 h-5" />
                </button>
              )}
              <button onClick={() => navigate('/about')} className="flex items-center gap-2 px-8 py-3.5 border border-white/10 hover:border-white/20 text-white rounded-xl font-semibold transition-all">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-8">
          <ChevronDown className="w-6 h-6 text-navy-400" />
        </motion.div>
      </motion.section>

      <section id="features" className="py-24 px-6">
        <motion.div {...fadeUp} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-navy-400 max-w-2xl mx-auto">Everything you need to understand and improve student mathematics performance.</p>
        </motion.div>
        <motion.div {...stagger} className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <motion.div
              key={f.title} variants={{ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 } }}
              className="group bg-navy-800/30 border border-white/5 rounded-xl p-6 hover:border-emerald-500/20 hover:bg-navy-800/50 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-navy-400">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section id="how-it-works" className="py-24 px-6 bg-navy-900/30">
        <motion.div {...fadeUp} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-navy-400 max-w-2xl mx-auto">From data input to actionable insights in four simple steps.</p>
        </motion.div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <motion.div key={s.number} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-400">{s.number}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-sm text-navy-400">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="benefits" className="py-24 px-6">
        <motion.div {...fadeUp} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why MathPredict AI?</h2>
          <p className="text-navy-400 max-w-2xl mx-auto">Built for accuracy, designed for impact.</p>
        </motion.div>
        <motion.div {...stagger} className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <motion.div key={b.title} variants={{ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 } }}
              className="bg-navy-800/30 border border-white/5 rounded-xl p-6 text-center hover:border-emerald-500/20 transition-all">
              <b.icon className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{b.title}</h3>
              <p className="text-sm text-navy-400">{b.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section id="team" className="py-24 px-6 bg-navy-900/30">
        <motion.div {...fadeUp} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Meet the Team</h2>
          <p className="text-navy-400 max-w-2xl mx-auto">The minds behind MathPredict AI — a mathematics performance prediction project.</p>
        </motion.div>
        <motion.div {...stagger} className="max-w-5xl mx-auto grid md:grid-cols-4 gap-6">
          {team.map((m) => (
            <motion.div key={m.name} variants={{ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 } }}
              className="bg-navy-800/30 border border-white/5 rounded-xl p-6 text-center hover:border-emerald-500/20 transition-all">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-white">{m.initials}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{m.name}</h3>
              <p className="text-xs text-navy-400 mb-2">{m.role}</p>
              <p className="text-xs text-navy-500 font-mono">{m.id}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-white">MathPredict<span className="text-emerald-400">AI</span></span>
            </div>
            <div className="flex items-center gap-6 text-sm text-navy-400">
              <button onClick={() => scrollTo('features')} className="hover:text-white transition-colors">Features</button>
              <button onClick={() => scrollTo('how-it-works')} className="hover:text-white transition-colors">How It Works</button>
              <button onClick={() => scrollTo('team')} className="hover:text-white transition-colors">Team</button>
              <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">About</button>
            </div>
            <div className="flex items-center gap-4">
              <Github className="w-5 h-5 text-navy-400 hover:text-white cursor-pointer transition-colors" />
              <Mail className="w-5 h-5 text-navy-400 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-navy-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/5 text-center text-sm text-navy-500">
            &copy; {new Date().getFullYear()} MathPredict AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
