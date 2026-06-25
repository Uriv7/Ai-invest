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
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center text-xl font-bold text-white">
            <Briefcase className="w-6 h-6 mr-2 text-blue-500" />
            AI Investment Analyst
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
                Automated Due Diligence
              </h1>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Enter a company name below to trigger the multi-agent LangGraph workflow.
                The agent will fetch live financials, read market news, and synthesize an investment verdict.
              </p>
            </div>

            <SearchBar onSearch={handleSearch} isLoading={isLoading} />

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg mb-8 text-center">
                {error}
              </div>
            )}

            {(isLoading || steps.length > 0) && !result && !error && (
              <AgentProgress steps={steps} />
            )}

            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
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
          <div className="w-full lg:w-96 flex-shrink-0 lg:h-[calc(100vh-8rem)] lg:sticky lg:top-24">
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
