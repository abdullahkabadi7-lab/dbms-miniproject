import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Package,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  CreditCard,
  User,
  ShoppingBag
} from 'lucide-react';
import { Order } from '../types';
import { mockStore } from '../services/mockStore';
import { Button } from '../components/ui/Button';

export const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | undefined>();

  useEffect(() => {
    if (!id) return;
    const found = mockStore.getOrderById(id);
    if (!found) {
      navigate('/orders');
      return;
    }
    setOrder(found);
  }, [id, navigate]);

  if (!order) {
    return (
      <div className="min-h-screen bg-transparent text-white flex items-center justify-center font-mono text-xs">
        Loading order details...
      </div>
    );
  }

  const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="w-full min-h-screen bg-transparent text-white py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#00A8FF] selection:text-black">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#00A8FF]" />
          <span>Back to All Orders</span>
        </Link>

        {/* Order Receipt Card */}
        <div className="rounded-2xl bg-surface-900/90 border border-white/10 overflow-hidden shadow-xl">
          {/* Header */}
          <div className="p-6 sm:p-8 bg-surface-950/70 border-b border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#00A8FF] uppercase tracking-wider mb-1.5 font-semibold">
                <span>ORDER CONFIRMATION & RECEIPT</span>
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-white">
                Order #{order.order_id}
              </h1>
              <p className="text-neutral-400 text-xs mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                Placed on {formattedDate}
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase border border-emerald-500/30 bg-emerald-950/40 text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {order.status}
            </span>
          </div>

          {/* Delivery & Customer Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8 border-b border-white/[0.08] text-xs">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-neutral-400 font-mono uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#00A8FF]" />
                <span>Shipping Destination</span>
              </div>
              <div className="p-4 rounded-xl bg-surface-950 border border-white/[0.06] space-y-1">
                <div className="text-white font-medium">{order.customer_name}</div>
                <div className="text-neutral-300 leading-relaxed">{order.shipping_address}</div>
                <div className="text-neutral-400 pt-1 text-[11px]">Contact: {order.customer_phone}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-neutral-400 font-mono uppercase tracking-wider">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Payment & Order Assurance</span>
              </div>
              <div className="p-4 rounded-xl bg-surface-950 border border-white/[0.06] space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Payment Status:</span>
                  <span className="text-emerald-400 font-medium">Settled Upon Checkout</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Customer Account:</span>
                  <span className="text-neutral-200">{order.customer_email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Inventory Status:</span>
                  <span className="text-[#00A8FF] font-medium">Allocated from Warehouse</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ordered Line Items */}
          <div className="p-6 sm:p-8 space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
              Ordered Products ({order.items?.length || 0})
            </h2>

            <div className="border border-white/10 rounded-xl overflow-hidden divide-y divide-white/[0.06]">
              {order.items?.map((item) => (
                <div
                  key={item.order_item_id}
                  className="p-4 flex items-center justify-between gap-4 bg-surface-950/40 hover:bg-surface-950 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="w-12 h-12 object-cover rounded-lg bg-black border border-white/10 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-neutral-400" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-white font-medium text-sm truncate">{item.product_name}</div>
                      <div className="text-xs font-mono text-neutral-400 mt-0.5">
                        ${item.unit_price.toFixed(2)} × {item.quantity}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono font-bold text-sm text-white">
                    ${item.subtotal.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Summary Breakdown */}
            <div className="pt-6 flex justify-end">
              <div className="w-full sm:w-80 space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal:</span>
                  <span className="text-white">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Estimated Tax (8%):</span>
                  <span className="text-white">${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Cold-Chain Shipping:</span>
                  <span className="text-white">${order.shipping_fee.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-white/10 flex justify-between items-baseline font-sans">
                  <span className="font-semibold text-white text-sm">Total Paid:</span>
                  <span className="font-display font-bold text-xl text-[#00A8FF]">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-between items-center pt-2">
          <Link
            to="/orders"
            className="text-xs font-mono text-neutral-400 hover:text-white uppercase transition-colors"
          >
            ← Back to orders
          </Link>
          <Button
            to="/shop"
            variant="primary"
            size="md"
            icon={<ShoppingBag className="w-4 h-4" />}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};
