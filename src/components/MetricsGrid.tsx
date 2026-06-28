import React from 'react';
import { FinancialMetrics } from '@/types';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, DollarSign, PieChart, BarChart3, AlertCircle } from 'lucide-react';

export default function MetricsGrid({ metrics }: { metrics?: FinancialMetrics }) {
  if (!metrics) return null;

  const cards = [
    { label: 'Current Price', value: metrics.currentPrice ? \`\${metrics.currency} \${metrics.currentPrice.toFixed(2)}\` : 'N/A', icon: DollarSign, color: 'text-blue-400' },
    { label: 'Market Cap', value: metrics.marketCap ? \`$\${(metrics.marketCap / 1e9).toFixed(2)}B\` : 'N/A', icon: PieChart, color: 'text-purple-400' },
    { label: 'Trailing P/E', value: metrics.peRatio ? metrics.peRatio.toFixed(2) : 'N/A', icon: Activity, color: 'text-emerald-400' },
    { label: 'Forward P/E', value: metrics.forwardPE ? metrics.forwardPE.toFixed(2) : 'N/A', icon: Activity, color: 'text-emerald-400' },
    { label: 'Profit Margin', value: metrics.profitMarginPercent ? \`\${metrics.profitMarginPercent.toFixed(2)}%\` : 'N/A', icon: TrendingUp, color: 'text-amber-400' },
    { label: 'Revenue Growth YoY', value: metrics.revenueGrowthYoY ? \`\${metrics.revenueGrowthYoY.toFixed(2)}%\` : 'N/A', icon: BarChart3, color: 'text-cyan-400' },
    { label: 'Debt to Equity', value: metrics.debtToEquity ? metrics.debtToEquity.toFixed(2) : 'N/A', icon: AlertCircle, color: 'text-red-400' },
    { label: 'Dividend Yield', value: metrics.dividendYieldPercent ? \`\${metrics.dividendYieldPercent.toFixed(2)}%\` : 'N/A', icon: DollarSign, color: 'text-green-400' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <div className="mb-12">
      <h3 className="text-xl font-semibold mb-6 flex items-center text-white/90">
        <Activity className="w-5 h-5 mr-2 text-indigo-400" />
        Live Financial Telemetry
      </h3>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {cards.map((c, i) => (
          <motion.div 
            key={i} 
            variants={item}
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass-panel p-5 group relative overflow-hidden"
          >
            <div className="absolute -inset-10 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full blur-xl pointer-events-none" />
            
            <div className="relative z-10 flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-400">{c.label}</span>
              <c.icon className={\`w-4 h-4 \${c.color} opacity-80 group-hover:opacity-100 transition-opacity\`} />
            </div>
            <div className="relative z-10 text-2xl font-bold tracking-tight text-white group-hover:text-indigo-100 transition-colors">
              {c.value}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
