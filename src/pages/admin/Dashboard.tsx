import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ClipboardList,
  Users,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  History,
  Boxes,
  Plus
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
  const [restockNotes, setRestockNotes] = useState('Standard supplier restocking');

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

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const handleExecuteRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockProduct) return;
    mockStore.restockProduct(restockProduct.product_id, Number(restockQty), restockNotes);
    setRestockProduct(null);
    loadData();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00A8FF] uppercase tracking-widest mb-1">
            <span>OPERATIONS CONSOLE</span>
            <span>•</span>
            <span>POSTGRESQL AUDIT</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-white">
            TRANSACTIONAL OVERVIEW
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-[#00A8FF] hover:bg-[#29C5FF] text-black font-mono font-bold text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            ADD PRODUCT
          </Link>
        </div>
      </div>

      {/* Top Operational Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-6 bg-[#0A0A0A] border border-neutral-900">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">TOTAL SKUS</span>
            <Package className="w-4 h-4 text-[#00A8FF]" />
          </div>
          <div className="font-display font-black text-3xl text-white">
            {products.length}
          </div>
          <div className="mt-2 text-[11px] font-mono text-neutral-400">
            Across {mockStore.getCategories().length} Departments
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-6 bg-[#0A0A0A] border border-neutral-900">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">TOTAL ORDERS</span>
            <ClipboardList className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-display font-black text-3xl text-white">
            {orders.length}
          </div>
          <div className="mt-2 text-[11px] font-mono text-emerald-400">
            100% Confirmed via ACID Check
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-6 bg-[#0A0A0A] border border-neutral-900">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">STOCK ATTENTION</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-display font-black text-3xl text-amber-400">
            {lowStockProducts.length}
          </div>
          <div className="mt-2 text-[11px] font-mono text-neutral-400">
            Reorder Level Thresholds Met
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-6 bg-[#0A0A0A] border border-neutral-900">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">TOTAL REVENUE</span>
            <span className="text-xs font-mono text-[#00A8FF]">USD</span>
          </div>
          <div className="font-display font-black text-3xl text-[#00A8FF]">
            ${totalRevenue.toFixed(2)}
          </div>
          <div className="mt-2 text-[11px] font-mono text-neutral-400">
            Gross Settled Order Receipts
          </div>
        </div>
      </div>

      {/* Two Column Layout: Low Stock Alerts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Low Stock Attention Required */}
        <div className="bg-[#0A0A0A] border border-neutral-900 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-amber-400" />
              <h2 className="font-display font-bold text-base uppercase tracking-wider text-white">
                LOW STOCK INVENTORY ALERTS
              </h2>
            </div>
            <Link
              to="/admin/inventory"
              className="text-[11px] font-mono text-[#00A8FF] hover:underline"
            >
              FULL LEDGER →
            </Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-neutral-400">
              ALL INVENTORY LEVELS SUFFICIENT
            </div>
          ) : (
            <div className="divide-y divide-neutral-900">
              {lowStockProducts.slice(0, 5).map((p) => (
                <div key={p.product_id} className="py-3 flex items-center justify-between gap-3 text-xs font-mono">
                  <div className="min-w-0">
                    <div className="text-white font-sans font-medium truncate">{p.name}</div>
                    <div className="text-[11px] text-neutral-400">
                      SKU: {p.sku} • On Hand: <span className="text-amber-400 font-bold">{p.current_stock}</span> (Min: {p.reorder_level})
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setRestockProduct(p);
                      setRestockQty(Math.max(20, p.reorder_level * 2));
                    }}
                    className="px-3 py-1.5 bg-[#00A8FF]/10 border border-[#00A8FF]/40 text-[#00A8FF] hover:bg-[#00A8FF] hover:text-black font-mono text-[11px] tracking-wider uppercase transition-colors shrink-0"
                  >
                    RESTOCK
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recent Orders */}
        <div className="bg-[#0A0A0A] border border-neutral-900 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-emerald-400" />
              <h2 className="font-display font-bold text-base uppercase tracking-wider text-white">
                RECENT CUSTOMER ORDERS
              </h2>
            </div>
            <Link
              to="/admin/orders"
              className="text-[11px] font-mono text-[#00A8FF] hover:underline"
            >
              ALL ORDERS →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-neutral-400">
              NO ORDERS RECORDED YET
            </div>
          ) : (
            <div className="divide-y divide-neutral-900">
              {orders.slice(0, 5).map((ord) => (
                <div key={ord.order_id} className="py-3 flex items-center justify-between gap-3 text-xs font-mono">
                  <div>
                    <div className="text-white font-sans font-medium">{ord.customer_name}</div>
                    <div className="text-[11px] text-neutral-400">
                      ID: {ord.order_id} • {new Date(ord.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">${ord.total.toFixed(2)}</div>
                    <span className="text-[10px] text-emerald-400 uppercase">{ord.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom: Recent Stock Transactions Stream */}
      <div className="bg-[#0A0A0A] border border-neutral-900 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#00A8FF]" />
            <h2 className="font-display font-bold text-base uppercase tracking-wider text-white">
              RECENT STOCK TRANSACTIONS (AUDIT TRAIL)
            </h2>
          </div>
          <Link
            to="/admin/transactions"
            className="text-[11px] font-mono text-[#00A8FF] hover:underline"
          >
            VIEW COMPLETE AUDIT JOURNAL →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-neutral-900 text-[10px] text-neutral-400 uppercase">
                <th className="py-2.5">TXN ID</th>
                <th className="py-2.5">PRODUCT</th>
                <th className="py-2.5">TYPE</th>
                <th className="py-2.5 text-right">QUANTITY</th>
                <th className="py-2.5">REFERENCE</th>
                <th className="py-2.5 text-right">DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900/60">
              {transactions.slice(0, 5).map((txn) => (
                <tr key={txn.transaction_id} className="hover:bg-neutral-900/40">
                  <td className="py-3 text-neutral-300">{txn.transaction_id}</td>
                  <td className="py-3 text-white font-sans font-medium">{txn.product_name}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 text-[10px] uppercase border ${
                        txn.transaction_type === 'SALE'
                          ? 'border-blue-900 bg-blue-950/20 text-[#00A8FF]'
                          : txn.transaction_type === 'RESTOCK'
                          ? 'border-emerald-900 bg-emerald-950/20 text-emerald-400'
                          : 'border-amber-900 bg-amber-950/20 text-amber-400'
                      }`}
                    >
                      {txn.transaction_type}
                    </span>
                  </td>
                  <td className={`py-3 text-right font-bold ${txn.quantity > 0 ? 'text-emerald-400' : 'text-neutral-300'}`}>
                    {txn.quantity > 0 ? `+${txn.quantity}` : txn.quantity}
                  </td>
                  <td className="py-3 text-neutral-400">{txn.reference_id}</td>
                  <td className="py-3 text-right text-neutral-400">
                    {new Date(txn.transaction_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Quick Action Modal */}
      {restockProduct && (
        <Modal
          isOpen={true}
          onClose={() => setRestockProduct(null)}
          title="INVENTORY REPLENISHMENT"
          subtitle={`Product: ${restockProduct.name} (${restockProduct.sku})`}
        >
          <form onSubmit={handleExecuteRestock} className="space-y-4">
            <div>
              <span className="text-xs font-mono text-neutral-400 block mb-1">
                CURRENT INVENTORY ON HAND:
              </span>
              <div className="font-display font-bold text-2xl text-white">
                {restockProduct.current_stock} Units
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Restock Intake Units (Positive Integer) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={restockQty}
                onChange={(e) => setRestockQty(Number(e.target.value))}
                className="w-full bg-black border border-neutral-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#00A8FF] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Audit Journal Notes / Reference *
              </label>
              <input
                type="text"
                required
                value={restockNotes}
                onChange={(e) => setRestockNotes(e.target.value)}
                placeholder="e.g. Shipment invoice PO-9812"
                className="w-full bg-black border border-neutral-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#00A8FF]"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setRestockProduct(null)}
                className="px-4 py-2 border border-neutral-800 text-neutral-400 hover:text-white text-xs font-mono uppercase"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#00A8FF] text-black font-mono font-bold text-xs uppercase hover:bg-[#29C5FF]"
              >
                COMMIT RESTOCK
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
