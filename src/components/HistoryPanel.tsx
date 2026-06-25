'use client';

import React, { useEffect, useState } from 'react';
import { ResearchHistoryItem } from '@/types';
import { motion } from 'framer-motion';
import { Clock, History, ChevronRight } from 'lucide-react';

interface HistoryPanelProps {
  onSelectHistory: (item: ResearchHistoryItem) => void;
  refreshTrigger: number; // passed from parent to re-fetch when new research completes
}

export default function HistoryPanel({ onSelectHistory, refreshTrigger }: HistoryPanelProps) {
  const [history, setHistory] = useState<ResearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/history');
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHistory();
  }, [refreshTrigger]);

  return (
    <div className="glass-panel p-6 h-full flex flex-col">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <History className="mr-2 w-5 h-5 text-blue-400" />
        Recent Research
      </h3>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="text-sm text-gray-500 animate-pulse">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="text-sm text-gray-500">No past research found.</div>
        ) : (
          history.map((item, idx) => (
            <motion.button
              key={item._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onSelectHistory(item)}
              className="w-full text-left glass-card p-4 hover:bg-white/10 group flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {item.companyName} {item.ticker ? `(${item.ticker})` : ''}
                </div>
                <div className="flex items-center text-xs text-gray-400 mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(item.createdAt).toLocaleDateString()}
                  <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                    item.decision === 'INVEST' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {item.decision}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
}
