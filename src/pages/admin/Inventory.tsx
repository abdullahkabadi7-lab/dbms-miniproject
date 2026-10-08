import React, { useState, useEffect } from 'react';
import { Boxes, ArrowDownUp, RefreshCw, AlertTriangle, Plus, Search, CheckCircle2 } from 'lucide-react';
import { ProductWithInventory } from '../../types';
import { mockStore } from '../../services/mockStore';
import { StockBadge } from '../../components/StockBadge';
import { Modal } from '../../components/Modal';

export const Inventory: React.FC = () => {
  const [products, setProducts] = useState<ProductWithInventory[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Restock action modal
  const [selectedProduct, setSelectedProduct] = useState<ProductWithInventory | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(20);
  const [notes, setNotes] = useState('Routine supplier delivery replenishment');

  const loadData = () => {
    setProducts(mockStore.getProductsWithInventory());
  };

  useEffect(() => {
    loadData();
    const unsub = mockStore.subscribe(loadData);
    return () => unsub();
  }, []);

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    mockStore.restockProduct(selectedProduct.product_id, Number(restockAmount), notes);
    setSelectedProduct(null);
    loadData();
  };

  const filtered = products.filter((p) => {
    if (statusFilter !== 'all' && p.stock_status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00A8FF] uppercase tracking-widest mb-1">
            <span>REAL-TIME STOCK LEDGER</span>
            <span>•</span>
            <span>TABLE: inventory</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-white">
            INVENTORY STATUS & RESTOCKING
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-300 bg-surface-900 px-3 py-1.5 rounded-lg border border-white/10">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>CHECK (current_stock &gt;= 0)</span>
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
            placeholder="Search SKU or product title..."
            className="w-full bg-surface-900 border border-white/10 rounded-xl text-white placeholder-neutral-400 pl-10 pr-4 py-2.5 text-xs font-mono focus:outline-none focus:border-[#00A8FF]"
          />
        </div>

        <div className="flex items-center bg-surface-900 border border-white/10 rounded-xl text-xs font-mono overflow-hidden">
          <span className="px-3 text-neutral-400 border-r border-white/10">STATUS:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-white px-3 py-2.5 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#08090E]">All Inventory</option>
            <option value="IN_STOCK" className="bg-[#08090E]">In Stock</option>
            <option value="LOW_STOCK" className="bg-[#08090E]">Low Stock Alert</option>
            <option value="OUT_OF_STOCK" className="bg-[#08090E]">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-surface-900 border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-surface-950 border-b border-white/[0.08] text-[10px] text-neutral-400 uppercase">
                <th className="p-4">PRODUCT RECORD</th>
                <th className="p-4">DEPARTMENT</th>
                <th className="p-4 text-right">CURRENT STOCK</th>
                <th className="p-4 text-right">REORDER THRESHOLD</th>
                <th className="p-4 text-center">HEALTH STATE</th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((prod) => (
                <tr key={prod.product_id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image_url}
                        alt=""
                        className="w-10 h-10 object-cover bg-black border border-white/10 rounded-lg shrink-0"
                      />
                      <div>
                        <div className="text-white font-sans font-medium">{prod.name}</div>
                        <div className="text-[10px] text-[#00A8FF]">SKU: {prod.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-neutral-400">{prod.category_name}</td>
                  <td className="p-4 text-right">
                    <span className={`font-bold text-sm ${
                      prod.current_stock === 0
                        ? 'text-rose-400'
                        : prod.current_stock <= prod.reorder_level
                        ? 'text-amber-400'
                        : 'text-white'
                    }`}>
                      {prod.current_stock}
                    </span>
                  </td>
                  <td className="p-4 text-right text-neutral-400">
                    {prod.reorder_level} units
                  </td>
                  <td className="p-4 text-center">
                    <StockBadge status={prod.stock_status} />
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedProduct(prod);
                        setRestockAmount(Math.max(15, prod.reorder_level * 2));
                      }}
                      className="px-3.5 py-1.5 bg-[#00A8FF]/10 border border-[#00A8FF]/30 text-[#00A8FF] hover:bg-[#00A8FF] hover:text-black font-mono text-[11px] tracking-wider uppercase rounded-lg transition-all font-semibold"
                    >
                      RESTOCK +
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Modal */}
      {selectedProduct && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedProduct(null)}
          title="Replenish Inventory"
          subtitle={`Product: ${selectedProduct.name} (${selectedProduct.sku})`}
        >
          <form onSubmit={handleRestockSubmit} className="space-y-4">
            <div className="p-4 bg-surface-900 border border-white/[0.08] rounded-xl grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Current On Hand</span>
                <span className="text-white font-bold text-base mt-0.5 block">{selectedProduct.current_stock} Units</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Reorder Threshold</span>
                <span className="text-amber-400 font-bold text-base mt-0.5 block">{selectedProduct.reorder_level} Units</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                Quantity to Restock *
              </label>
              <input
                type="number"
                min="1"
                required
                value={restockAmount}
                onChange={(e) => setRestockAmount(Number(e.target.value))}
                className="w-full bg-surface-900 border border-white/10 rounded-xl text-white px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#00A8FF]"
              />
              <span className="text-[11px] font-mono text-neutral-400 mt-1.5 block">
                Resulting inventory level will be: <strong className="text-white">{selectedProduct.current_stock + Number(restockAmount)} units</strong>
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                Restock Notes / PO Reference
              </label>
              <input
                type="text"
                required
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Purchase order PO-2026-90"
                className="w-full bg-surface-900 border border-white/10 rounded-xl text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#00A8FF]"
              />
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2.5 border border-white/10 rounded-lg text-neutral-400 hover:text-white text-xs font-mono uppercase transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#00A8FF] hover:bg-[#38BDF8] text-black font-mono font-bold text-xs uppercase rounded-lg transition-colors"
              >
                Commit Restock
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
