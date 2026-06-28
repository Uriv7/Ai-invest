import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface AnalystReportProps {
  report: string;
}

export default function AnalystReport({ report }: AnalystReportProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-12">
      <div className="glass-panel overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 transition-colors border-b border-white/5"
        >
          <div className="flex items-center text-lg font-semibold text-white">
            <FileText className="w-6 h-6 mr-3 text-indigo-400" />
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
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="border-t border-white/5 bg-black/20"
            >
              <div className="p-8 prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-indigo-400 hover:prose-a:text-indigo-300">
                <ReactMarkdown>{report}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
