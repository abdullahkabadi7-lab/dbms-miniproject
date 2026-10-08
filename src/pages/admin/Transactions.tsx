import React, { useState, useEffect } from 'react';
import { History, Search, SlidersHorizontal, ArrowDownLeft, ArrowUpRight, RotateCcw } from 'lucide-react';
import { StockTransaction, TransactionType } from '../../types';
import { mockStore } from '../../services/mockStore';

export const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const loadTransactions = () => {
    setTransactions(mockStore.getTransactions());
  };

  useEffect(() => {
    loadTransactions();
    const unsub = mockStore.subscribe(loadTransactions);
    return () => unsub();
  }, []);

  const filtered = transactions.filter((t) => {
    if (typeFilter !== 'all' && t.transaction_type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.transaction_id.toLowerCase().includes(q) ||
        t.product_name.toLowerCase().includes(q) ||
        t.reference_id.toLowerCase().includes(q) ||
        t.notes?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00A8FF] uppercase tracking-widest mb-1">
            <span>IMMUTABLE AUDIT LOG</span>
            <span>•</span>
            <span>TABLE: stock_transactions</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-white">
            STOCK TRANSACTION LEDGER
          </h1>
        </div>

        <div className="text-xs font-mono text-neutral-400">
          LOG ENTRIES: <span className="text-white font-bold">{transactions.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Transaction ID, Product, Reference..."
            className="w-full bg-surface-900 border border-white/10 rounded-xl text-white placeholder-neutral-400 pl-10 pr-4 py-2.5 text-xs font-mono focus:outline-none focus:border-[#00A8FF]"
          />
        </div>

        <div className="flex items-center bg-surface-900 border border-white/10 rounded-xl text-xs font-mono overflow-hidden">
          <span className="px-3 text-neutral-400 border-r border-white/10 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#00A8FF]" />
            TYPE:
          </span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-transparent text-white px-3 py-2.5 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#08090E]">All Types</option>
            <option value="SALE" className="bg-[#08090E]">SALE (Order Fulfillment)</option>
            <option value="RESTOCK" className="bg-[#08090E]">RESTOCK (Intake / PO)</option>
            <option value="RETURN" className="bg-[#08090E]">RETURN (Customer Return)</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-surface-900 border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-surface-950 border-b border-white/[0.08] text-[10px] text-neutral-400 uppercase">
                <th className="p-4">TXN ID</th>
                <th className="p-4">PRODUCT RECORD</th>
                <th className="p-4 text-center">TYPE</th>
                <th className="p-4 text-right">QUANTITY DELTA</th>
                <th className="p-4">REFERENCE ID</th>
                <th className="p-4">AUDIT NOTES</th>
                <th className="p-4 text-right">TIMESTAMP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((txn) => {
                const isPositive = txn.quantity > 0;
                return (
                  <tr key={txn.transaction_id} className="hover:bg-neutral-900/30 transition-colors">
                    <td className="p-4 font-bold text-white tracking-wider">
                      {txn.transaction_id}
                    </td>
                    <td className="p-4">
                      <div className="text-white font-sans font-medium">{txn.product_name}</div>
                      <div className="text-[10px] text-[#00A8FF]">PID: {txn.product_id}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider border ${
                          txn.transaction_type === 'SALE'
                            ? 'border-blue-900 bg-blue-950/20 text-[#00A8FF]'
                            : txn.transaction_type === 'RESTOCK'
                            ? 'border-emerald-900 bg-emerald-950/20 text-emerald-400'
                            : 'border-amber-900 bg-amber-950/20 text-amber-400'
                        }`}
                      >
                        {txn.transaction_type === 'SALE' && <ArrowDownLeft className="w-3 h-3" />}
                        {txn.transaction_type === 'RESTOCK' && <ArrowUpRight className="w-3 h-3" />}
                        {txn.transaction_type === 'RETURN' && <RotateCcw className="w-3 h-3" />}
                        {txn.transaction_type}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span
                        className={`font-bold text-sm ${
                          isPositive ? 'text-emerald-400' : 'text-neutral-300'
                        }`}
                      >
                        {isPositive ? `+${txn.quantity}` : txn.quantity}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-300 font-mono">
                      {txn.reference_id}
                    </td>
                    <td className="p-4 text-neutral-400 font-sans text-xs max-w-xs truncate">
                      {txn.notes || '—'}
                    </td>
                    <td className="p-4 text-right text-neutral-400">
                      {new Date(txn.transaction_date).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
