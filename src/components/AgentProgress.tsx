import React from 'react';
import { AgentStepEvent } from '@/types';
import { Loader2, Terminal, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentProgressProps {
  steps: AgentStepEvent[];
}

export default function AgentProgress({ steps }: AgentProgressProps) {
  return (
    <div className="w-full max-w-3xl mx-auto my-12">
      <div className="glass-panel border-t-2 border-indigo-500/50 overflow-hidden relative">
        <div className="bg-black/40 px-4 py-3 flex items-center border-b border-white/5">
          <Terminal className="w-4 h-4 text-indigo-400 mr-2" />
          <span className="text-xs font-mono text-indigo-200 uppercase tracking-widest">Agent Workflow HUD</span>
        </div>
        <div className="p-6 space-y-4">
          <AnimatePresence>
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start"
              >
                <div className="mt-1 mr-4">
                  {index === steps.length - 1 && step.type !== 'result' ? (
                    <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white/90">
                    {step.nodeId?.replace(/Node$/, '').toUpperCase() || 'AGENT'}
                  </div>
                  {step.step && (
                    <div className="text-sm text-gray-400 mt-1 font-mono bg-black/20 p-2 rounded border border-white/5 inline-block">
                      {'>'} {step.step}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {steps.length > 0 && steps[steps.length - 1]?.type !== 'result' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-4 border-t border-white/5 mt-4"
            >
              <div className="flex animate-pulse space-x-4">
                <div className="h-4 w-4 bg-indigo-500/50 rounded-full mt-1"></div>
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-3 bg-white/10 rounded w-3/4"></div>
                  <div className="h-3 bg-white/10 rounded w-1/2"></div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
