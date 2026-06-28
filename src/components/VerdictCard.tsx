import React from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface VerdictCardProps {
  decision: 'INVEST' | 'PASS';
  confidenceScore: number;
}

export default function VerdictCard({ decision, confidenceScore }: VerdictCardProps) {
  const isInvest = decision === 'INVEST';
  const colorClass = isInvest ? 'text-emerald-400' : 'text-red-500';
  const glowClass = isInvest ? 'shadow-[0_0_40px_rgba(16,185,129,0.3)]' : 'shadow-[0_0_40px_rgba(239,68,68,0.3)]';
  const borderClass = isInvest ? 'border-emerald-500/30' : 'border-red-500/30';
  const bgClass = isInvest ? 'from-emerald-500/10 to-transparent' : 'from-red-500/10 to-transparent';

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`glass-panel border-t-2 ${borderClass} ${glowClass} bg-gradient-to-b ${bgClass} p-8 my-10 flex flex-col items-center justify-center relative overflow-hidden`}
    >
      {/* Decorative background glow */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 blur-3xl opacity-50 ${isInvest ? 'bg-emerald-500' : 'bg-red-500'}`} />

      <div className="relative z-10 flex flex-col items-center">
        {isInvest ? (
          <ShieldCheck className="w-16 h-16 text-emerald-400 mb-4" />
        ) : (
          <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        )}
        
        <h2 className="text-gray-400 font-semibold tracking-[0.2em] uppercase text-sm mb-2">Final Verdict</h2>
        <div className={`text-6xl font-black tracking-tighter ${colorClass} mb-8`}>
          {decision}
        </div>

        <div className="w-full max-w-md">
          <div className="flex justify-between text-sm mb-2 font-medium">
            <span className="text-gray-400">Confidence Score</span>
            <span className={colorClass}>{confidenceScore}%</span>
          </div>
          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: \`\${confidenceScore}%\` }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              className={\`h-full rounded-full \${isInvest ? 'bg-emerald-500' : 'bg-red-500'} shadow-[0_0_10px_currentColor]\`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
