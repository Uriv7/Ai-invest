'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { InvestmentDecision } from '@/types';

interface VerdictCardProps {
  decision: InvestmentDecision;
  confidenceScore: number;
}

export default function VerdictCard({ decision, confidenceScore }: VerdictCardProps) {
  const isInvest = decision === 'INVEST';
  const colorClass = isInvest ? 'text-green-400' : 'text-red-400';
  const bgGradient = isInvest ? 'from-green-500/20 to-transparent' : 'from-red-500/20 to-transparent';
  const borderColor = isInvest ? 'border-green-500/30' : 'border-red-500/30';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden rounded-2xl border ${borderColor} bg-gradient-to-br ${bgGradient} p-8 mb-8 backdrop-blur-md`}
    >
      <div className="absolute inset-0 bg-black/40 -z-10" />
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 z-10">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-gray-400 text-sm uppercase tracking-wider mb-2 font-semibold">
            Final Verdict
          </h2>
          <div className={`text-6xl font-black tracking-tight ${colorClass} drop-shadow-lg`}>
            {decision}
          </div>
        </div>

        <div className="flex flex-col items-center w-full md:w-1/2">
          <div className="flex justify-between w-full mb-2">
            <span className="text-gray-300 text-sm font-medium">Confidence Score</span>
            <span className="text-white text-sm font-bold">{confidenceScore}%</span>
          </div>
          <div className="h-4 w-full bg-gray-800 rounded-full overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidenceScore}%` }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className={`h-full ${isInvest ? 'bg-green-500' : 'bg-red-500'} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
            />
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Based on aggregated financial metrics, qualitative analysis, and market sentiment.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
