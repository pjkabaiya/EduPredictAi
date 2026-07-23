import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import type { TeamMember } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Mail, Github, Linkedin, MapPin } from 'lucide-react';

export function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ members: TeamMember[] }>('/team')
      .then((res) => setMembers(res.members))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Our Team</h2>
        <p className="text-navy-400 mt-1">The talented individuals behind EduPredict AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {members.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-navy-800/50 border border-white/5 rounded-xl p-6 text-center hover:border-emerald-500/20 hover:bg-navy-800/70 transition-all group"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
              <span className="text-2xl font-bold text-white">
                {member.name.split(' ').map((n) => n[0]).join('')}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
            <p className="text-xs text-navy-400 font-mono mb-2">{member.student_id}</p>
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-3">
              {member.role}
            </div>
            <p className="text-sm text-navy-400 mb-4">{member.bio}</p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {member.skills.map((skill) => (
                <span key={skill} className="px-2 py-0.5 rounded bg-navy-900/50 border border-white/5 text-xs text-navy-300">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
