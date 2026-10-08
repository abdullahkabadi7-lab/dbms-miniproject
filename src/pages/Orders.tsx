import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Search,
  ShoppingBag,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Order } from '../types';
import { mockStore } from '../services/mockStore';
import { Button } from '../components/ui/Button';

export const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const currentUser = mockStore.getCurrentUser();

  useEffect(() => {
    if (!mockStore.isAuthenticated()) {
      navigate('/login?redirect=/orders');
      return;
    }
    const load = () => {
      if (currentUser) {
        setOrders(mockStore.getCustomerOrders(currentUser.user_id));
      }
    };
    load();
    const unsub = mockStore.subscribe(load);
    return () => unsub();
  }, [currentUser, navigate]);

  const filteredOrders = orders.filter((order) => {
    if (filterStatus !== 'all' && order.status.toLowerCase() !== filterStatus.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.order_id.toLowerCase().includes(q);
      const matchItems = order.items?.some((i) => i.product_name.toLowerCase().includes(q));
      return matchId || matchItems;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'CONFIRMED' || s === 'DELIVERED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase border border-emerald-500/30 bg-emerald-950/40 text-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Confirmed
        </span>
      );
    }
    if (s === 'CANCELLED' || s === 'REJECTED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase border border-rose-500/30 bg-rose-950/40 text-rose-300">
          <XCircle className="w-3.5 h-3.5 text-rose-400" />
          Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase border border-amber-500/30 bg-amber-950/40 text-amber-300">
        <Clock className="w-3.5 h-3.5 text-amber-400" />
        Processing
      </span>
    );
  };

  return (
    <div className="w-full min-h-screen bg-transparent text-white py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#00A8FF] selection:text-black">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="pb-6 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00A8FF] uppercase tracking-wider mb-1 font-semibold">
              <span>CUSTOMER ACCOUNT</span>
              <span className="text-neutral-600">•</span>
              <span>PURCHASE HISTORY</span>
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-white">
              My Orders
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Review your past purchases, verify reserved items, and inspect fulfillment details.
            </p>
          </div>

          <Button
            to="/shop"
            variant="secondary"
            size="md"
            icon={<ShoppingBag className="w-4 h-4 text-[#00A8FF]" />}
          >
            Browse Products
          </Button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID or product name..."
              className="w-full bg-surface-900 border border-white/10 rounded-xl text-white placeholder-neutral-400 pl-10 pr-4 py-2.5 text-xs font-mono focus:outline-none focus:border-[#00A8FF]"
            />
          </div>

          <div className="flex items-center gap-2 p-1 bg-surface-900/90 border border-white/10 rounded-xl text-xs font-mono">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all ${
                filterStatus === 'all'
                  ? 'bg-[#00A8FF] text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setFilterStatus('confirmed')}
              className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all ${
                filterStatus === 'confirmed'
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setFilterStatus('cancelled')}
              className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all ${
                filterStatus === 'cancelled'
                  ? 'bg-rose-500 text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>

        {/* Orders Listing */}
        {orders.length === 0 ? (
          <div className="text-center py-20 px-6 rounded-2xl bg-surface-900/80 border border-white/10">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-neutral-400">
              <Package className="w-6 h-6" />
            </div>
            <h2 className="font-display font-semibold text-xl text-white mb-2">No orders placed yet</h2>
            <p className="text-neutral-400 text-sm max-w-md mx-auto mb-6">
              When you order fresh groceries or pantry items, your order summary and delivery tracking will appear here.
            </p>
            <Button to="/shop" variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
              Start Shopping
            </Button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-2xl bg-surface-900/80 border border-white/10">
            <p className="text-neutral-300 font-mono text-sm">No orders match your filter criteria.</p>
            <button
              onClick={() => { setSearchQuery(''); setFilterStatus('all'); }}
              className="mt-3 text-xs font-mono text-[#00A8FF] hover:underline uppercase"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const totalItemsCount = order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
              const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });

              return (
                <div
                  key={order.order_id}
                  className="rounded-2xl bg-surface-900/90 border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden shadow-lg"
                >
                  {/* Order Card Header */}
                  <div className="p-5 sm:p-6 bg-surface-950/70 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                      <div>
                        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                          ORDER NUMBER
                        </span>
                        <span className="font-mono font-bold text-sm text-white">
                          #{order.order_id}
                        </span>
                      </div>

                      <div className="hidden sm:block border-l border-white/10 pl-6">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                          DATE PLACED
                        </span>
                        <span className="text-xs text-neutral-200 flex items-center gap-1.5 mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                          {formattedDate}
                        </span>
                      </div>

                      <div className="hidden md:block border-l border-white/10 pl-6">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                          TOTAL AMOUNT
                        </span>
                        <span className="text-sm font-display font-bold text-white mt-0.5 block">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(order.status)}

                      <Link
                        to={`/orders/${order.order_id}`}
                        className="px-3.5 py-1.5 rounded-lg border border-white/10 hover:border-[#00A8FF]/40 text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
                      >
                        <span>Receipt</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="divide-y divide-white/[0.06]">
                      {order.items?.map((item) => (
                        <div
                          key={item.order_item_id}
                          className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.product_name}
                                className="w-12 h-12 object-cover rounded-lg bg-black/40 border border-white/10 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <Package className="w-5 h-5 text-neutral-400" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <h4 className="font-sans font-medium text-sm text-white truncate">
                                {item.product_name}
                              </h4>
                              <div className="text-xs font-mono text-neutral-400 mt-0.5">
                                Qty: <span className="text-white font-semibold">{item.quantity}</span> × ${item.unit_price.toFixed(2)}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-mono text-sm font-bold text-white">
                              ${item.subtotal.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Destination Footer */}
                    <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-neutral-400">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#00A8FF]" />
                        <span>Delivered to: <strong className="text-neutral-200">{order.shipping_address}</strong></span>
                      </div>

                      <div className="text-neutral-400">
                        Total items: <span className="text-white font-semibold">{totalItemsCount} units</span>
                      </div>
                    </div>
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
