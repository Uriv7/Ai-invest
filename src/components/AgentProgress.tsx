'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, CircleDashed, Loader2 } from 'lucide-react';
import { AgentStepEvent } from '@/types';

interface AgentProgressProps {
  steps: AgentStepEvent[];
}

export default function AgentProgress({ steps }: AgentProgressProps) {
  if (steps.length === 0) return null;

  return (
    <div className="glass-panel p-6 mb-8">
      <h3 className="text-lg font-semibold text-white mb-4">Agent Progress</h3>
      <div className="space-y-4">
        <AnimatePresence>
          {steps.map((step, index) => {
            if (step.type === 'result') return null;
            
            const isLatest = index === steps.length - 1;
            const isError = step.type === 'error';

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start space-x-3"
              >
                <div className="mt-1 flex-shrink-0">
                  {isError ? (
                    <CircleDashed className="w-5 h-5 text-red-500" />
                  ) : step.status === 'completed' || !isLatest ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${isError ? 'text-red-400' : 'text-gray-200'}`}>
                    {step.step ? `Running step: ${step.step}` : (step.error || 'Processing...')}
                  </p>
                  {step.nodeId && (
                    <p className="text-xs text-gray-500 mt-1">Node: {step.nodeId}</p>
                  )}
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(step.timestamp).toLocaleTimeString()}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
