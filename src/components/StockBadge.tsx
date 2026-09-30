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
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-mono tracking-wider uppercase border border-emerald-900/50 bg-emerald-950/20 text-emerald-400 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        IN STOCK {stockCount !== undefined && stockCount > 0 && `(${stockCount})`}
      </span>
    );
  }

  if (status === 'LOW_STOCK') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-mono tracking-wider uppercase border border-amber-900/50 bg-amber-950/20 text-amber-400 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
        LOW STOCK {stockCount !== undefined && `(${stockCount} LEFT)`}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-mono tracking-wider uppercase border border-neutral-800 bg-neutral-900/50 text-neutral-400 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-neutral-500"></span>
      OUT OF STOCK
    </span>
  );
};
