import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ClipboardList,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  History,
  Boxes,
  Plus,
  RefreshCw,
  CheckCircle2,
  DollarSign,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { mockStore } from '../../services/mockStore';
import { ProductWithInventory, Order, StockTransaction } from '../../types';
import { StockBadge } from '../../components/StockBadge';
import { Modal } from '../../components/Modal';

export const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<ProductWithInventory[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);

  // Restock modal state
  const [restockProduct, setRestockProduct] = useState<ProductWithInventory | null>(null);
  const [restockQty, setRestockQty] = useState(25);
  const [restockNotes, setRestockNotes] = useState('Standard supplier replenishment');

  const loadData = () => {
    setProducts(mockStore.getProductsWithInventory());
    setOrders(mockStore.getOrders());
    setTransactions(mockStore.getTransactions());
  };

  useEffect(() => {
    loadData();
    const unsub = mockStore.subscribe(loadData);
    return () => unsub();
  }, []);

  const lowStockProducts = products.filter(
    (p) => p.stock_status === 'LOW_STOCK' || p.stock_status === 'OUT_OF_STOCK'
  );

  const inStockCount = products.filter((p) => p.stock_status === 'IN_STOCK').length;
  const lowStockCount = products.filter((p) => p.stock_status === 'LOW_STOCK').length;
  const outOfStockCount = products.filter((p) => p.stock_status === 'OUT_OF_STOCK').length;

  const totalStockUnits = products.reduce((acc, p) => acc + (p.current_stock || 0), 0);
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  const handleExecuteRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockProduct) return;
    mockStore.restockProduct(restockProduct.product_id, Number(restockQty), restockNotes);
    setRestockProduct(null);
    loadData();
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="pb-6 border-b border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00A8FF] uppercase tracking-wider mb-1 font-semibold">
            <Activity className="w-3.5 h-3.5" />
            <span>OPERATIONS OVERVIEW</span>
            <span className="text-neutral-600">•</span>
            <span className="text-neutral-400">REAL-TIME INVENTORY & ORDERS</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-white">
            Management Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-[#00A8FF] hover:bg-[#38BDF8] text-black font-mono font-bold text-xs tracking-wider uppercase rounded-lg transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </Link>
        </div>
      </div>

      {/* Operational Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Products */}
        <div className="p-6 bg-surface-900/90 border border-white/[0.08] hover:border-white/20 rounded-2xl relative overflow-hidden transition-all duration-300">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">TOTAL PRODUCTS</span>
            <div className="w-8 h-8 rounded-lg bg-[#00A8FF]/10 flex items-center justify-center text-[#00A8FF]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-bold text-3xl text-white">
            {products.length}
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.06] text-xs text-neutral-400 flex items-center justify-between">
            <span>{mockStore.getCategories().length} Departments</span>
            <span className="text-emerald-400 font-mono font-semibold">{totalStockUnits} Total Units</span>
          </div>
        </div>

        {/* Metric 2: Total Orders */}
        <div className="p-6 bg-surface-900/90 border border-white/[0.08] hover:border-white/20 rounded-2xl relative overflow-hidden transition-all duration-300">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">ORDERS PLACED</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-bold text-3xl text-white">
            {orders.length}
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.06] text-xs text-emerald-400 flex items-center justify-between font-mono">
            <span>Verified Orders</span>
            <span className="font-semibold">100% Fulfilled</span>
          </div>
        </div>

        {/* Metric 3: Low Stock Alerts */}
        <div className="p-6 bg-surface-900/90 border border-white/[0.08] hover:border-white/20 rounded-2xl relative overflow-hidden transition-all duration-300">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">LOW STOCK ALERTS</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-bold text-3xl text-amber-400">
            {lowStockProducts.length}
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.06] text-xs text-neutral-400 flex items-center justify-between font-mono">
            <span>Needs Reorder</span>
            <span className={outOfStockCount > 0 ? 'text-rose-400 font-bold' : 'text-neutral-400'}>
              {outOfStockCount} Out of Stock
            </span>
          </div>
        </div>

        {/* Metric 4: Total Revenue */}
        <div className="p-6 bg-surface-900/90 border border-white/[0.08] hover:border-white/20 rounded-2xl relative overflow-hidden transition-all duration-300">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">GROSS SALES</span>
            <div className="w-8 h-8 rounded-lg bg-[#00A8FF]/10 flex items-center justify-center text-[#00A8FF]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-bold text-3xl text-[#00A8FF]">
            ${totalRevenue.toFixed(2)}
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.06] text-xs text-neutral-400 flex items-center justify-between font-mono">
            <span>Avg Order: ${avgOrderValue.toFixed(2)}</span>
            <span className="text-neutral-300">USD</span>
          </div>
        </div>
      </div>

      {/* Catalog Stock Health Distribution */}
      <div className="p-5 bg-surface-900/90 border border-white/[0.08] rounded-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-[#00A8FF]" />
            <span className="text-white font-semibold">INVENTORY STOCK HEALTH</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              In-Stock ({inStockCount})
            </span>
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Low Stock ({lowStockCount})
            </span>
            <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Out of Stock ({outOfStockCount})
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2.5 bg-surface-950 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${products.length > 0 ? (inStockCount / products.length) * 100 : 0}%` }}
            className="bg-emerald-500 transition-all duration-500"
            title={`In Stock: ${inStockCount}`}
          />
          <div
            style={{ width: `${products.length > 0 ? (lowStockCount / products.length) * 100 : 0}%` }}
            className="bg-amber-500 transition-all duration-500"
            title={`Low Stock: ${lowStockCount}`}
          />
          <div
            style={{ width: `${products.length > 0 ? (outOfStockCount / products.length) * 100 : 0}%` }}
            className="bg-rose-500 transition-all duration-500"
            title={`Out of Stock: ${outOfStockCount}`}
          />
        </div>
      </div>

      {/* Two-Column Layout: Low Stock Alerts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Low Stock Attention Required */}
        <div className="bg-surface-900/90 border border-white/[0.08] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-amber-400" />
              <h2 className="font-display font-semibold text-base text-white">
                Low Stock Items
              </h2>
            </div>
            <Link
              to="/admin/inventory"
              className="text-xs font-mono text-[#00A8FF] hover:underline uppercase"
            >
              Full Inventory →
            </Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-neutral-400">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              All product inventories are currently healthy.
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {lowStockProducts.slice(0, 5).map((p) => (
                <div key={p.product_id} className="py-3 flex items-center justify-between gap-3 text-xs font-mono">
                  <div className="min-w-0">
                    <div className="text-white font-sans font-medium truncate">{p.name}</div>
                    <div className="text-xs text-neutral-400 mt-0.5">
                      SKU: <span className="text-neutral-300">{p.sku}</span> • On Hand:{' '}
                      <span className={p.current_stock === 0 ? 'text-rose-400 font-bold' : 'text-amber-400 font-bold'}>
                        {p.current_stock}
                      </span>{' '}
                      (Reorder Level: {p.reorder_level})
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setRestockProduct(p);
                      setRestockQty(Math.max(20, p.reorder_level * 2));
                    }}
                    className="px-3 py-1.5 bg-[#00A8FF]/10 border border-[#00A8FF]/30 text-[#00A8FF] hover:bg-[#00A8FF] hover:text-black font-mono text-xs tracking-wider uppercase rounded-lg transition-all shrink-0 font-semibold"
                  >
                    Restock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recent Orders */}
        <div className="bg-surface-900/90 border border-white/[0.08] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-emerald-400" />
              <h2 className="font-display font-semibold text-base text-white">
                Recent Customer Orders
              </h2>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-mono text-[#00A8FF] hover:underline uppercase"
            >
              All Orders →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-neutral-400">
              No orders recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {orders.slice(0, 5).map((ord) => (
                <div key={ord.order_id} className="py-3 flex items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {ord.customer_name ? ord.customer_name.slice(0, 2).toUpperCase() : 'CU'}
                    </div>
                    <div>
                      <div className="text-white font-sans font-medium">{ord.customer_name}</div>
                      <div className="text-xs text-neutral-400">
                        #{ord.order_id} • {new Date(ord.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">${ord.total.toFixed(2)}</div>
                    <span className="text-[10px] text-emerald-400 uppercase font-semibold">{ord.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom: Recent Stock Transactions Audit Trail */}
      <div className="bg-surface-900/90 border border-white/[0.08] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#00A8FF]" />
            <h2 className="font-display font-semibold text-base text-white">
              Recent Inventory Transactions
            </h2>
          </div>
          <Link
            to="/admin/transactions"
            className="text-xs font-mono text-[#00A8FF] hover:underline uppercase"
          >
            Complete Journal →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] text-neutral-400 uppercase">
                <th className="py-3 px-3">TXN ID</th>
                <th className="py-3 px-3">PRODUCT</th>
                <th className="py-3 px-3">TYPE</th>
                <th className="py-3 px-3 text-right">QUANTITY</th>
                <th className="py-3 px-3">REFERENCE</th>
                <th className="py-3 px-3 text-right">DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {transactions.slice(0, 5).map((txn) => (
                <tr key={txn.transaction_id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-3 text-neutral-300 font-semibold">{txn.transaction_id}</td>
                  <td className="py-3 px-3 text-white font-sans">{txn.product_name}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        txn.transaction_type === 'STOCK_IN' || txn.transaction_type === 'RESTOCK'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {txn.transaction_type}
                    </span>
                  </td>
                  <td
                    className={`py-3 px-3 text-right font-bold ${
                      txn.quantity > 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {txn.quantity > 0 ? `+${txn.quantity}` : txn.quantity}
                  </td>
                  <td className="py-3 px-3 text-neutral-400 font-mono">{txn.reference_id || 'N/A'}</td>
                  <td className="py-3 px-3 text-right text-neutral-400">
                    {new Date(txn.transaction_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Modal */}
      {restockProduct && (
        <Modal
          isOpen={!!restockProduct}
          onClose={() => setRestockProduct(null)}
          title={`Restock Product: ${restockProduct.name}`}
        >
          <form onSubmit={handleExecuteRestock} className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-neutral-400 block mb-1">Product SKU</label>
              <div className="p-3 bg-surface-950 border border-white/10 rounded-lg text-white font-mono font-semibold">
                {restockProduct.sku}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-neutral-400 block mb-1">Current Stock On Hand</label>
                <div className="p-3 bg-surface-950 border border-white/10 rounded-lg text-amber-400 font-bold">
                  {restockProduct.current_stock} units
                </div>
              </div>
              <div>
                <label className="text-neutral-400 block mb-1">Restock Quantity *</label>
                <input
                  type="number"
                  min="1"
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full p-3 bg-surface-950 border border-white/20 rounded-lg text-white font-bold focus:border-[#00A8FF] outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Supplier Delivery Notes</label>
              <input
                type="text"
                value={restockNotes}
                onChange={(e) => setRestockNotes(e.target.value)}
                placeholder="e.g. Weekly vendor shipment from cooperative"
                className="w-full p-3 bg-surface-950 border border-white/20 rounded-lg text-white focus:border-[#00A8FF] outline-none font-sans"
                required
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRestockProduct(null)}
                className="px-4 py-2 bg-surface-950 hover:bg-white/10 text-neutral-300 rounded-lg uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#00A8FF] hover:bg-[#38BDF8] text-black font-bold rounded-lg uppercase shadow-sm"
              >
                Confirm Restock
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
