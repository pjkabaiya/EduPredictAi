import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 flex items-center justify-center"
      >
        <GraduationCap className="w-5 h-5 text-emerald-400" />
      </motion.div>
    </div>
  );
}

export function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-navy-950 z-[100] flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 flex items-center justify-center mx-auto mb-6"
        >
          <GraduationCap className="w-7 h-7 text-emerald-400" />
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-2">
          MathPredict <span className="text-emerald-400">AI</span>
        </h1>
        <p className="text-navy-400">Loading intelligent insights...</p>
      </motion.div>
    </motion.div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-navy-800/50 border border-white/5 rounded-xl p-5 animate-pulse">
      <div className="flex justify-between">
        <div className="w-10 h-10 rounded-lg bg-navy-700" />
        <div className="w-14 h-6 rounded-full bg-navy-700" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-8 w-24 bg-navy-700 rounded" />
        <div className="h-4 w-32 bg-navy-700 rounded" />
      </div>
    </div>
  );
}
