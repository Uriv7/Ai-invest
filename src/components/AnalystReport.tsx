'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface AnalystReportProps {
  report: string;
}

export default function AnalystReport({ report }: AnalystReportProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-8 glass-panel overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center text-xl font-bold text-white">
          <FileText className="mr-2 w-5 h-5 text-blue-400" />
          Full Analyst Report
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/10"
          >
            <div className="p-6 prose prose-invert max-w-none text-gray-300 prose-headings:text-white prose-a:text-blue-400">
              {/* Very basic markdown rendering for the scope of this project, 
                  ideally use react-markdown, but we'll use a split/map approach for safety without extra deps */}
              {report.split('\\n').map((paragraph, idx) => {
                if (!paragraph.trim()) return <br key={idx} />;
                if (paragraph.startsWith('### ')) return <h3 key={idx} className="text-lg font-bold mt-4 mb-2">{paragraph.replace('### ', '')}</h3>;
                if (paragraph.startsWith('## ')) return <h2 key={idx} className="text-xl font-bold mt-5 mb-3 border-b border-white/10 pb-2">{paragraph.replace('## ', '')}</h2>;
                if (paragraph.startsWith('# ')) return <h1 key={idx} className="text-2xl font-bold mt-6 mb-4">{paragraph.replace('# ', '')}</h1>;
                if (paragraph.startsWith('- ')) return <li key={idx} className="ml-4 list-disc">{paragraph.replace('- ', '')}</li>;
                return <p key={idx} className="mb-2">{paragraph}</p>;
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
