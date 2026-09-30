import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Package, Printer, Database } from 'lucide-react';
import { Order } from '../types';

export const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const order = location.state?.order as Order | undefined;

  if (!order) {
    return <Navigate to="/orders" replace />;
  }

  return (
    <div className="w-full min-h-screen bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Confirmation Hero Card */}
        <div className="bg-[#0A0A0A] border border-neutral-900 p-8 sm:p-12 mb-8">
          <div className="w-16 h-16 rounded-full border border-emerald-500/40 bg-emerald-950/20 text-emerald-400 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 stroke-[2]" />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#00A8FF] uppercase tracking-widest mb-2">
            <span>TRANSACTION COMMITTED</span>
            <span>•</span>
            <span>INVENTORY ALLOCATED</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white mb-4">
            ORDER CONFIRMED
          </h1>

          <p className="text-neutral-400 text-sm leading-relaxed mb-8 max-w-xl font-light">
            Thank you, {order.customer_name}. Your order has been committed to the PostgreSQL transactional database. Stock levels have been decremented and audited in the stock ledger.
          </p>

          {/* Key Order Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-black border border-neutral-900 font-mono text-xs mb-8">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase block">ORDER ID</span>
              <span className="text-white font-bold">{order.order_id}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase block">STATUS</span>
              <span className="text-emerald-400 font-bold uppercase">{order.status}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase block">DATE</span>
              <span className="text-white">{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase block">TOTAL AMOUNT</span>
              <span className="text-[#00A8FF] font-bold">${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3">
              LINE ITEMS DISPATCHED
            </h3>
            <div className="border border-neutral-900 divide-y divide-neutral-900">
              {order.items?.map((item) => (
                <div key={item.order_item_id} className="p-4 flex items-center justify-between text-xs font-mono bg-[#050505]">
                  <div className="flex items-center gap-3">
                    {item.image_url && (
                      <img src={item.image_url} alt="" className="w-8 h-8 object-cover border border-neutral-800" />
                    )}
                    <div>
                      <div className="text-white font-sans font-medium">{item.product_name}</div>
                      <div className="text-neutral-400 text-[11px]">{item.quantity} units @ ${item.unit_price.toFixed(2)}</div>
                    </div>
                  </div>
                  <span className="text-white font-bold">${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping destination */}
          <div className="p-4 bg-black border border-neutral-900 text-xs font-mono text-neutral-400 mb-8">
            <span className="text-[10px] text-neutral-400 uppercase block mb-1">FULFILLMENT DESTINATION:</span>
            <span className="text-neutral-200">{order.shipping_address}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              to="/shop"
              className="px-6 py-3 bg-[#00A8FF] hover:bg-[#29C5FF] text-black font-mono font-bold text-xs tracking-widest uppercase text-center transition-colors flex items-center justify-center gap-2"
            >
              <span>CONTINUE SHOPPING</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to={`/orders/${order.order_id}`}
              className="px-6 py-3 border border-neutral-800 hover:border-neutral-600 bg-surface-900 text-white font-mono text-xs tracking-widest uppercase text-center transition-colors flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4 text-[#00A8FF]" />
              <span>VIEW ORDER RECORD</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
