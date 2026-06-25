'use client';

import React from 'react';
import { FinancialMetrics } from '@/types';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Activity, PieChart, Target, AlertCircle } from 'lucide-react';

interface MetricsGridProps {
  metrics: FinancialMetrics | null;
}

export default function MetricsGrid({ metrics }: MetricsGridProps) {
  if (!metrics) {
    return (
      <div className="glass-panel p-6 mb-8 text-center text-gray-400">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No financial metrics available.</p>
      </div>
    );
  }

  const formatNumber = (num: number | null, style: 'currency' | 'percent' | 'decimal' = 'decimal') => {
    if (num === null || num === undefined) return 'N/A';
    if (style === 'currency') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: metrics.currency || 'USD', notation: 'compact' }).format(num);
    }
    if (style === 'percent') {
      return new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 }).format(num / 100);
    }
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num);
  };

  const cards = [
    { label: 'Current Price', value: formatNumber(metrics.currentPrice, 'currency'), icon: DollarSign, color: 'text-emerald-400' },
    { label: 'Market Cap', value: formatNumber(metrics.marketCap, 'currency'), icon: PieChart, color: 'text-blue-400' },
    { label: 'P/E Ratio', value: formatNumber(metrics.peRatio), icon: Target, color: 'text-purple-400' },
    { label: 'Revenue Growth YoY', value: formatNumber(metrics.revenueGrowthYoY, 'percent'), icon: TrendingUp, color: 'text-green-400' },
    { label: 'Profit Margin', value: formatNumber(metrics.profitMarginPercent, 'percent'), icon: Activity, color: 'text-cyan-400' },
    { label: 'Beta', value: formatNumber(metrics.beta), icon: Activity, color: 'text-amber-400' },
  ];

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <DollarSign className="mr-2 w-5 h-5 text-blue-400" />
        Key Financials
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-5 relative overflow-hidden"
          >
            <card.icon className={`absolute right-[-10px] top-[-10px] w-16 h-16 opacity-5 ${card.color}`} />
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-medium">{card.label}</div>
            <div className={`text-xl md:text-2xl font-bold ${card.value === 'N/A' ? 'text-gray-500' : 'text-white'}`}>
              {card.value}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
