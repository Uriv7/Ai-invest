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
      className="w-full max-w-3xl mx-auto relative group mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
      <div className="relative flex items-center w-full h-16 md:h-20 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full pl-6 pr-3 md:pr-4 shadow-2xl">
        <Search className="w-6 h-6 text-indigo-400 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Analyze a company (e.g., Apple, Tesla, Stripe)..."
          className="w-full h-full bg-transparent border-none outline-none text-white px-4 md:px-6 text-lg md:text-xl placeholder-white/30 font-light"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="h-10 md:h-12 px-6 md:px-8 flex items-center justify-center bg-white text-black hover:bg-gray-100 disabled:bg-white/10 disabled:text-white/30 rounded-full font-bold tracking-wide transition-all duration-300 flex-shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.15)] disabled:shadow-none"
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
