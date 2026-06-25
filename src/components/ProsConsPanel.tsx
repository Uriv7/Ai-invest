'use client';

import React from 'react';
import { InvestmentThesis } from '@/types';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Scale } from 'lucide-react';

interface ProsConsPanelProps {
  thesis: InvestmentThesis;
}

export default function ProsConsPanel({ thesis }: ProsConsPanelProps) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <Scale className="mr-2 w-5 h-5 text-blue-400" />
        Investment Thesis
      </h3>
      
      <div className="glass-panel p-6 mb-4">
        <p className="text-gray-200 leading-relaxed">{thesis.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-6 border-t-4 border-t-green-500"
        >
          <h4 className="text-lg font-semibold text-green-400 mb-4 flex items-center">
            <CheckCircle className="mr-2 w-5 h-5" /> Bull Case (Pros)
          </h4>
          <ul className="space-y-3">
            {thesis.pros.map((pro, idx) => (
              <li key={idx} className="flex items-start text-sm text-gray-300">
                <span className="text-green-500 mr-2 mt-0.5">•</span>
                <span>{pro}</span>
              </li>
            ))}
            {thesis.pros.length === 0 && <li className="text-gray-500 italic">No strong pros identified.</li>}
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-6 border-t-4 border-t-red-500"
        >
          <h4 className="text-lg font-semibold text-red-400 mb-4 flex items-center">
            <XCircle className="mr-2 w-5 h-5" /> Bear Case (Cons)
          </h4>
          <ul className="space-y-3">
            {thesis.cons.map((con, idx) => (
              <li key={idx} className="flex items-start text-sm text-gray-300">
                <span className="text-red-500 mr-2 mt-0.5">•</span>
                <span>{con}</span>
              </li>
            ))}
            {thesis.cons.length === 0 && <li className="text-gray-500 italic">No major cons identified.</li>}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
