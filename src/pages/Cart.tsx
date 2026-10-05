import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, ShieldCheck, Trash2, ArrowLeft } from 'lucide-react';
import { CartItem as CartItemType } from '../types';
import { mockStore } from '../services/mockStore';
import { CartItem } from '../components/CartItem';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/ui/Button';

export const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const navigate = useNavigate();

  const loadCart = () => {
    setCartItems(mockStore.getCart());
  };

  useEffect(() => {
    loadCart();
    const unsub = mockStore.subscribe(loadCart);
    return () => unsub();
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.selling_price * item.quantity,
    0
  );
  const tax = +(subtotal * 0.08).toFixed(2);
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5.00;
  const grandTotal = +(subtotal + tax + shipping).toFixed(2);

  const handleClearCart = () => {
    if (window.confirm('Clear all items from your shopping basket?')) {
      mockStore.clearCart();
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-black text-white flex items-center justify-center p-6">
        <EmptyState
          icon={ShoppingBag}
          title="Your Cart is Empty"
          description="You currently have zero items allocated in your shopping basket. Discover our curated catalog of supermarket goods."
          actionText="Explore Products"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-transparent text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-white/10 gap-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-1">
              TEMPORARY SESSION LEDGER
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-white">
              SHOPPING BASKET ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} ITEMS)
            </h1>
          </div>

          <Button
            onClick={handleClearCart}
            variant="danger"
            size="sm"
            icon={<Trash2 className="w-3.5 h-3.5" />}
            iconPosition="left"
          >
            CLEAR ALL ITEMS
          </Button>
        </div>

        {/* Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.product.product_id}
                item={item}
                onUpdate={loadCart}
              />
            ))}

            <div className="pt-4 flex items-center justify-between">
              <Button
                to="/shop"
                variant="ghost"
                size="sm"
                icon={<ArrowLeft className="w-4 h-4 text-cyan-400" />}
                iconPosition="left"
              >
                CONTINUE BROWSING AISLES
              </Button>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout Box */}
          <div className="rounded-2xl bg-[#09090e]/80 border border-white/15 p-6 sm:p-8 space-y-6 backdrop-blur-xl shadow-2xl sticky top-24">
            <h2 className="font-display font-bold text-xl uppercase tracking-wide text-white pb-4 border-b border-white/10">
              ORDER SUMMARY
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-neutral-300">
                <span>Items Subtotal:</span>
                <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span>Estimated Tax (8%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span>Fulfillment &amp; Freight:</span>
                <span>{shipping === 0 ? <span className="text-emerald-400 font-semibold">FREE (&gt;$50)</span> : `$${shipping.toFixed(2)}`}</span>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-baseline justify-between text-base font-sans">
                <span className="font-display uppercase tracking-wider font-semibold text-white">
                  Estimated Total
                </span>
                <span className="font-display font-black text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#00A8FF] to-[#29C5FF] drop-shadow-[0_0_15px_rgba(0,168,255,0.5)]">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* ACID Transaction Notice */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono text-neutral-400 flex items-start gap-2.5 backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Inventory is verified upon checkout. No charge is processed without atomic stock deduction.
              </span>
            </div>

            {/* Checkout Luxury Pill CTA */}
            <Button
              onClick={() => navigate('/checkout')}
              variant="accent"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              className="w-full py-4 text-sm font-bold"
            >
              PROCEED TO CHECKOUT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
