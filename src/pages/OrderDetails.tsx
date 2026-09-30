import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldCheck, MapPin, Calendar, Clock, DollarSign, Database } from 'lucide-react';
import { Order } from '../types';
import { mockStore } from '../services/mockStore';

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
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
        LOADING ORDER RECORD...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#00A8FF]" />
          BACK TO ALL ORDERS
        </Link>

        {/* Receipt Container */}
        <div className="bg-[#0A0A0A] border border-neutral-900 p-6 sm:p-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-900">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#00A8FF] uppercase tracking-widest mb-1">
                <span>DATABASE RECEIPT</span>
                <span>•</span>
                <span>TABLE: orders / order_items</span>
              </div>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-white">
                ORDER {order.order_id}
              </h1>
            </div>

            <span className="px-3 py-1 text-xs font-mono tracking-widest uppercase border border-emerald-900 bg-emerald-950/20 text-emerald-400 font-bold">
              {order.status}
            </span>
          </div>

          {/* Customer & Shipping Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-b border-neutral-900 font-mono text-xs">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase block mb-1">CUSTOMER</span>
              <div className="text-white font-medium">{order.customer_name}</div>
              <div className="text-neutral-400 text-[11px]">{order.customer_email}</div>
              <div className="text-neutral-400 text-[11px]">{order.customer_phone}</div>
            </div>

            <div>
              <span className="text-[10px] text-neutral-400 uppercase block mb-1">SHIPPING DESTINATION</span>
              <div className="text-neutral-200 leading-relaxed">{order.shipping_address}</div>
            </div>

            <div>
              <span className="text-[10px] text-neutral-400 uppercase block mb-1">TRANSACTION TIMESTAMP</span>
              <div className="text-white">{new Date(order.created_at).toLocaleString()}</div>
              <div className="text-emerald-400 text-[11px] mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                ACID Inventory Verified
              </div>
            </div>
          </div>

          {/* Line items table */}
          <div className="py-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4">
              ORDERED PRODUCTS & INVENTORY ALLOCATIONS
            </h3>

            <div className="border border-neutral-900 divide-y divide-neutral-900">
              <div className="p-3 bg-[#050505] grid grid-cols-12 text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                <div className="col-span-6">PRODUCT</div>
                <div className="col-span-2 text-right">UNIT PRICE</div>
                <div className="col-span-2 text-center">QUANTITY</div>
                <div className="col-span-2 text-right">LINE TOTAL</div>
              </div>

              {order.items?.map((item) => (
                <div
                  key={item.order_item_id}
                  className="p-4 grid grid-cols-12 items-center text-xs font-mono hover:bg-[#050505]/40 transition-colors"
                >
                  <div className="col-span-6 flex items-center gap-3">
                    {item.image_url && (
                      <img src={item.image_url} alt="" className="w-10 h-10 object-cover bg-black border border-neutral-800 shrink-0" />
                    )}
                    <div>
                      <div className="text-white font-sans font-medium line-clamp-1">{item.product_name}</div>
                      <div className="text-[10px] text-[#00A8FF]">ITEM ID: {item.order_item_id}</div>
                    </div>
                  </div>
                  <div className="col-span-2 text-right text-neutral-300">
                    ${item.unit_price.toFixed(2)}
                  </div>
                  <div className="col-span-2 text-center text-white font-bold">
                    {item.quantity}
                  </div>
                  <div className="col-span-2 text-right text-white font-bold">
                    ${item.subtotal.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="pt-4 border-t border-neutral-900 flex justify-end">
            <div className="w-full sm:w-72 space-y-2 font-mono text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal:</span>
                <span className="text-white">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Tax (8%):</span>
                <span className="text-white">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Shipping:</span>
                <span className="text-white">${order.shipping_fee.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-neutral-800 flex justify-between items-baseline text-sm font-sans">
                <span className="font-display uppercase font-bold text-white">Total Amount:</span>
                <span className="font-display font-extrabold text-xl text-[#00A8FF]">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
