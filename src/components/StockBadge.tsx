import React from 'react';
import { StockStatus } from '../types';

interface StockBadgeProps {
  status: StockStatus;
  stockCount?: number;
  className?: string;
}

export const StockBadge: React.FC<StockBadgeProps> = ({ status, stockCount, className = '' }) => {
  if (status === 'IN_STOCK') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 backdrop-blur-md shadow-[0_0_12px_rgba(16,185,129,0.25)] ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse"></span>
        IN STOCK {stockCount !== undefined && stockCount > 0 && `(${stockCount})`}
      </span>
    );
  }

  if (status === 'LOW_STOCK') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase border border-amber-500/30 bg-amber-950/40 text-amber-300 backdrop-blur-md shadow-[0_0_12px_rgba(245,158,11,0.25)] ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]"></span>
        LOW STOCK {stockCount !== undefined && `(${stockCount} LEFT)`}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase border border-white/10 bg-neutral-900/70 text-neutral-400 backdrop-blur-md ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-neutral-500"></span>
      OUT OF STOCK
    </span>
  );
};
