import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (companyName: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative flex items-center w-full h-16 rounded-full glass-panel overflow-hidden pl-6 pr-2">
        <Search className="w-6 h-6 text-indigo-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Analyze a company (e.g., Apple, Tesla, Stripe)..."
          className="w-full h-full bg-transparent border-none outline-none text-white px-4 text-lg placeholder-white/40"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="h-12 w-32 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-full font-semibold tracking-wide transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'RESEARCH'
          )}
        </button>
      </div>
    </motion.form>
  );
}
