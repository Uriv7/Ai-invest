'use client';

import React from 'react';
import { Source } from '@/types';
import { Link, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface SourcesListProps {
  sources: Source[];
}

export default function SourcesList({ sources }: SourcesListProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <Link className="mr-2 w-5 h-5 text-blue-400" />
        Sources & Citations
      </h3>
      <div className="glass-panel p-6">
        <ul className="space-y-3">
          {sources.map((source, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-start"
            >
              <ExternalLink className="w-4 h-4 text-gray-500 mr-2 mt-1 flex-shrink-0" />
              <a 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300 hover:underline break-words"
              >
                {source.title || source.url}
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
