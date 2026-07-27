import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await sendPasswordResetEmail(auth!, email);
      setSent(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-navy-950" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <GraduationCap className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-navy-400 mt-2">Enter your email and we&apos;ll send you reset instructions</p>
        </div>

        {sent ? (
          <div className="bg-navy-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-white mb-2">Check Your Email</h2>
            <p className="text-sm text-navy-400 mb-6">Reset instructions have been sent to {email}</p>
            <Link to="/login" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-navy-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-navy-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-900/50 border border-white/10 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all" />
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            <button type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all">
              Send Reset Link
            </button>
            <p className="text-center text-sm text-navy-400">
              <Link to="/login" className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </Link>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
}
