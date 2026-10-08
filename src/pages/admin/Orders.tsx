import React, { useState, useEffect } from 'react';
import { ClipboardList, Search, Eye, CheckCircle2, Calendar, User, DollarSign } from 'lucide-react';
import { Order } from '../../types';
import { mockStore } from '../../services/mockStore';
import { Modal } from '../../components/Modal';

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = () => {
    setOrders(mockStore.getOrders());
  };

  useEffect(() => {
    loadOrders();
    const unsub = mockStore.subscribe(loadOrders);
    return () => unsub();
  }, []);

  const filtered = orders.filter((o) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      o.order_id.toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      o.customer_email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00A8FF] uppercase tracking-widest mb-1">
            <span>TRANSACTION JOURNAL</span>
            <span>•</span>
            <span>TABLE: orders</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-white">
            CUSTOMER ORDERS
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/20 px-3 py-1.5 border border-emerald-900">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>ALL ORDERS AUTO-CONFIRMED VIA INVENTORY LOCK</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by Order ID, customer name, email..."
          className="w-full bg-surface-900 border border-white/10 rounded-xl text-white placeholder-neutral-400 pl-10 pr-4 py-2.5 text-xs font-mono focus:outline-none focus:border-[#00A8FF]"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-surface-900 border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-surface-950 border-b border-white/[0.08] text-[10px] text-neutral-400 uppercase">
                <th className="p-4">ORDER ID</th>
                <th className="p-4">CUSTOMER</th>
                <th className="p-4">DATE & TIME</th>
                <th className="p-4 text-center">LINE ITEMS</th>
                <th className="p-4 text-right">TOTAL (USD)</th>
                <th className="p-4 text-center">STATUS</th>
                <th className="p-4 text-right">INSPECT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((ord) => {
                const itemCount = ord.items?.reduce((s, i) => s + i.quantity, 0) || 0;
                return (
                  <tr key={ord.order_id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white tracking-wider">
                      {ord.order_id}
                    </td>
                    <td className="p-4">
                      <div className="text-white font-sans font-medium">{ord.customer_name}</div>
                      <div className="text-[10px] text-neutral-400">{ord.customer_email}</div>
                    </td>
                    <td className="p-4 text-neutral-400">
                      {new Date(ord.created_at).toLocaleString()}
                    </td>
                    <td className="p-4 text-center text-neutral-300">
                      {itemCount} units
                    </td>
                    <td className="p-4 text-right font-bold text-white">
                      ${ord.total.toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border border-emerald-500/30 bg-emerald-950/40 text-emerald-300">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-2 text-neutral-400 hover:text-[#00A8FF] hover:bg-white/5 rounded-lg transition-colors"
                        title="Inspect Order Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Order Modal */}
      {selectedOrder && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedOrder(null)}
          title={`Order Receipt: ${selectedOrder.order_id}`}
          subtitle={`Placed on ${new Date(selectedOrder.created_at).toLocaleString()}`}
          maxWidth="xl"
        >
          <div className="space-y-5 font-mono text-xs">
            {/* Customer Details */}
            <div className="p-4 bg-surface-900 border border-white/[0.08] rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Customer Info</span>
                <div className="text-white font-sans font-medium text-sm">{selectedOrder.customer_name}</div>
                <div className="text-neutral-400 font-mono text-xs mt-0.5">{selectedOrder.customer_email}</div>
                <div className="text-neutral-400 font-mono text-xs">{selectedOrder.customer_phone}</div>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Shipping Destination</span>
                <div className="text-neutral-200 font-sans text-xs leading-relaxed">{selectedOrder.shipping_address}</div>
              </div>
            </div>

            {/* Line items list */}
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-2 font-semibold">
                Order Items ({selectedOrder.items?.length || 0})
              </span>
              <div className="bg-surface-900 border border-white/[0.08] rounded-xl overflow-hidden divide-y divide-white/[0.06]">
                {selectedOrder.items?.map((item) => (
                  <div key={item.order_item_id} className="p-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      {item.image_url ? (
                        <img src={item.image_url} alt="" className="w-10 h-10 object-cover rounded-lg border border-white/10" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-surface-950 border border-white/10 flex items-center justify-center text-neutral-600 font-sans text-xs">
                          Item
                        </div>
                      )}
                      <div>
                        <div className="text-white font-sans font-medium text-sm">{item.product_name}</div>
                        <div className="text-[11px] text-neutral-400 font-mono">
                          {item.quantity} × ${item.unit_price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white text-sm">${item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing breakdown */}
            <div className="p-4 bg-surface-900 border border-white/[0.08] rounded-xl space-y-2">
              <div className="flex justify-between text-neutral-400 text-xs">
                <span>Subtotal</span>
                <span className="text-white font-mono">${selectedOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-400 text-xs">
                <span>Tax (8%)</span>
                <span className="text-white font-mono">${selectedOrder.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-400 text-xs">
                <span>Shipping Fee</span>
                <span className="text-white font-mono">${selectedOrder.shipping_fee.toFixed(2)}</span>
              </div>
              <div className="pt-2.5 border-t border-white/10 flex justify-between items-center font-bold">
                <span className="text-white font-sans text-sm">Total Paid</span>
                <span className="text-[#00A8FF] font-mono text-base">${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-mono text-xs uppercase rounded-lg transition-colors"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
