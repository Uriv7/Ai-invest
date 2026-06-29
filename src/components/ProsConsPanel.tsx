import React from 'react';
import { CheckCircle2, XCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProsConsPanelProps {
  thesis: {
    summary: string;
    pros: string[];
    cons: string[];
  };
}

export default function ProsConsPanel({ thesis }: ProsConsPanelProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring" as const } }
  };

  return (
    <div className="mb-12">
      <div className="glass-panel p-6 sm:p-8 mb-6 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
        <h3 className="relative z-10 text-xl font-bold mb-4 text-white">Investment Thesis</h3>
        <p className="relative z-10 text-gray-300 leading-relaxed text-lg">{thesis.summary}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PROS */}
        <motion.div variants={container} initial="hidden" animate="show" className="glass-panel p-6 border-t-2 border-emerald-500/30">
          <div className="flex items-center mb-6">
            <TrendingUp className="w-6 h-6 text-emerald-400 mr-3" />
            <h4 className="text-lg font-bold text-emerald-100 tracking-wide">Bull Case</h4>
          </div>
          <ul className="space-y-4">
            {thesis.pros.map((pro, i) => (
              <motion.li key={i} variants={item} className="flex items-start bg-white/5 p-4 rounded-xl border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-300 leading-snug">{pro}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* CONS */}
        <motion.div variants={container} initial="hidden" animate="show" className="glass-panel p-6 border-t-2 border-red-500/30">
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
            <h4 className="text-lg font-bold text-red-100 tracking-wide">Bear Case</h4>
          </div>
          <ul className="space-y-4">
            {thesis.cons.map((con, i) => (
              <motion.li key={i} variants={item} className="flex items-start bg-white/5 p-4 rounded-xl border border-white/5">
                <XCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-300 leading-snug">{con}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
