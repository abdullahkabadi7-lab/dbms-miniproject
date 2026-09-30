import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Calendar, DollarSign, Clock, ShieldCheck } from 'lucide-react';
import { Order } from '../types';
import { mockStore } from '../services/mockStore';
import { EmptyState } from '../components/EmptyState';

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const currentUser = mockStore.getCurrentUser();

  useEffect(() => {
    const load = () => {
      setOrders(mockStore.getCustomerOrders(currentUser.user_id));
    };
    load();
    const unsub = mockStore.subscribe(load);
    return () => unsub();
  }, [currentUser]);

  return (
    <div className="w-full min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="pb-6 mb-8 border-b border-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00A8FF] uppercase tracking-widest mb-1">
              <span>CUSTOMER AUDIT LOGS</span>
              <span>•</span>
              <span>ACID ORDER ARCHIVE</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-white">
              MY ORDER HISTORY
            </h1>
          </div>
          <div className="text-xs font-mono text-neutral-400">
            RECORD COUNT: <span className="text-white font-bold">{orders.length}</span>
          </div>
        </div>

        {orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="NO ORDERS PLACED YET"
            description="Your customer record currently has no historical orders on file. Explore our product catalog to place your first transactional order."
            actionText="BROWSE SHOP"
            actionLink="/shop"
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const totalItems = order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
              return (
                <div
                  key={order.order_id}
                  className="bg-[#0A0A0A] border border-neutral-900 p-6 hover:border-neutral-800 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-900">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-base text-white tracking-wider">
                        {order.order_id}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 border border-emerald-900/60 bg-emerald-950/20 text-emerald-400 uppercase">
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span className="text-white font-bold">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-xs text-neutral-300 font-medium">
                        {order.items?.map(i => `${i.product_name} (${i.quantity})`).slice(0, 2).join(', ')}
                        {order.items && order.items.length > 2 && ` +${order.items.length - 2} more`}
                      </div>
                      <div className="text-[11px] font-mono text-neutral-400">
                        {totalItems} total units delivered to {order.shipping_address.split(',')[0]}
                      </div>
                    </div>

                    <Link
                      to={`/orders/${order.order_id}`}
                      className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#00A8FF] hover:text-[#29C5FF] font-semibold whitespace-nowrap"
                    >
                      <span>VIEW DETAILS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
