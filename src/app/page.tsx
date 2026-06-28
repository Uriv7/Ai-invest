'use client';

import React, { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import AgentProgress from '@/components/AgentProgress';
import VerdictCard from '@/components/VerdictCard';
import MetricsGrid from '@/components/MetricsGrid';
import ProsConsPanel from '@/components/ProsConsPanel';
import AnalystReport from '@/components/AnalystReport';
import SourcesList from '@/components/SourcesList';
import HistoryPanel from '@/components/HistoryPanel';
import { AgentStepEvent, ResearchResult, ResearchHistoryItem } from '@/types';
import { Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState<AgentStepEvent[]>([]);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleSearch = async (companyName: string) => {
    setIsLoading(true);
    setSteps([]);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName }),
      });

      if (!response.ok) {
        throw new Error('Failed to start research');
      }

      if (!response.body) throw new Error('No readable stream');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '');
            if (dataStr === '[DONE]') break;

            try {
              const event: AgentStepEvent = JSON.parse(dataStr);
              setSteps(prev => [...prev, event]);

              if (event.type === 'result' && event.data) {
                setResult(event.data);
                setRefreshHistory(prev => prev + 1);
                setIsLoading(false);
              }
              if (event.type === 'error' && event.error) {
                setError(event.error);
                setIsLoading(false);
              }
            } catch (err) {
              console.error('Error parsing SSE', err);
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (item: ResearchHistoryItem) => {
    setResult(item);
    setSteps([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-transparent selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/30 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center text-2xl font-bold text-white tracking-tight"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(79,70,229,0.5)]">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 ml-2">Analyst</span>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            
            <AnimatePresence mode="wait">
              {!result && !isLoading && steps.length === 0 && (
                <motion.div 
                  key="hero"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center pt-20 pb-12"
                >
                  <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-tight">
                    Institutional Research, <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Automated.</span>
                  </h1>
                  <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
                    Enter a company name below to trigger the multi-agent LangGraph workflow.
                    The agent will fetch live financials, read market news, and synthesize an investment verdict.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <SearchBar onSearch={handleSearch} isLoading={isLoading} />

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-2xl mt-8 text-center backdrop-blur-xl shadow-[0_0_30px_rgba(239,68,68,0.15)]"
              >
                <div className="font-bold mb-1">Research Failed</div>
                <div className="text-sm">{error}</div>
              </motion.div>
            )}

            {(isLoading || steps.length > 0) && !result && !error && (
              <AgentProgress steps={steps} />
            )}

            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="pt-12"
                >
                  <VerdictCard 
                    decision={result.decision} 
                    confidenceScore={result.confidenceScore} 
                  />
                  <MetricsGrid metrics={result.financialData} />
                  <ProsConsPanel thesis={result.investmentThesis} />
                  <AnalystReport report={result.analystReport} />
                  <SourcesList sources={result.sources} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-96 flex-shrink-0 lg:h-[calc(100vh-8rem)] lg:sticky lg:top-28">
            <HistoryPanel 
              onSelectHistory={handleSelectHistory} 
              refreshTrigger={refreshHistory} 
            />
          </div>
        </div>
      </main>
    </div>
  );
}
