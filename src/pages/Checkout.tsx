import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Database, AlertOctagon, CheckCircle2, Loader2 } from 'lucide-react';
import { CartItem } from '../types';
import { mockStore } from '../services/mockStore';
import { Button } from '../components/ui/Button';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = mockStore.getCurrentUser();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionStep, setTransactionStep] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: currentUser.full_name || 'Alex Morgan',
    email: currentUser.email || 'alex.morgan@example.com',
    phone: currentUser.phone || '+1 (555) 789-0123',
    shippingAddress: currentUser.address || '742 Evergreen Terrace, Springfield, OR 97477'
  });

  useEffect(() => {
    const items = mockStore.getCart();
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    setCartItems(items);
  }, [navigate]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.selling_price * item.quantity,
    0
  );
  const tax = +(subtotal * 0.08).toFixed(2);
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5.00;
  const grandTotal = +(subtotal + tax + shipping).toFixed(2);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsProcessing(true);

    // Simulate Step 1: BEGIN TRANSACTION & VERIFY STOCK
    setTransactionStep('1/3: BEGIN TRANSACTION — Executing SELECT stock FOR UPDATE...');
    await new Promise((r) => setTimeout(r, 600));

    // Simulate Step 2: DEDUCT STOCK & GENERATE AUDIT LOGS
    setTransactionStep('2/3: Decrementing inventory & writing to stock_transactions journal...');
    await new Promise((r) => setTimeout(r, 600));

    // Call actual mockStore atomic transaction
    const result = await mockStore.placeOrder(formData);

    if (!result.success) {
      setIsProcessing(false);
      setTransactionStep(null);
      setErrorMessage(result.error || 'Transaction rolled back due to stock constraints.');
      return;
    }

    // Step 3: COMMIT
    setTransactionStep('3/3: COMMIT TRANSACTION — Order Confirmed.');
    await new Promise((r) => setTimeout(r, 500));

    setIsProcessing(false);
    navigate('/order-success', { state: { order: result.order } });
  };

  return (
    <div className="w-full min-h-screen bg-transparent text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Button
            to="/cart"
            variant="ghost"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4 text-cyan-400" />}
            iconPosition="left"
          >
            RETURN TO BASKET
          </Button>
        </div>

        <div className="pb-6 mb-10 border-b border-neutral-900">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00A8FF] uppercase tracking-widest mb-1">
            <span>ATOMIC TRANSACTION STAGE</span>
            <span>•</span>
            <span>POSTGRESQL ACID CHECK</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-white">
            CHECKOUT DISPATCH
          </h1>
        </div>

        {errorMessage && (
          <div className="mb-8 p-5 bg-red-950/40 border border-red-800 text-red-300 text-xs font-mono flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold uppercase tracking-wider mb-1">TRANSACTION ROLLED BACK</div>
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Customer & Delivery Info */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-[#0A0A0A] border border-neutral-900 p-6 sm:p-8 space-y-6">
              <h2 className="font-display font-bold text-lg uppercase tracking-wider text-white border-b border-neutral-900 pb-4">
                CUSTOMER INFORMATION
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-black border border-neutral-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#00A8FF] font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-black border border-neutral-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#00A8FF] font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-black border border-neutral-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#00A8FF] font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Shipping Address (Street, City, Postal Code) *
                  </label>
                  <textarea
                    rows={3}
                    name="shippingAddress"
                    required
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    className="w-full bg-black border border-neutral-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#00A8FF] font-sans resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Simulated Payment Notice */}
            <div className="bg-[#0A0A0A] border border-neutral-900 p-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-0.5">
                  PAYMENT GATEWAY SPECIFICATION
                </span>
                <span className="text-white text-sm font-semibold">
                  Simulated Cash on Delivery / Direct Ledger Settlement
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 border border-emerald-800 bg-emerald-950/30 text-emerald-400">
                ZERO GATEWAY FEE
              </span>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0A0A0A] border border-neutral-900 p-6 sm:p-8 space-y-6">
              <h2 className="font-display font-bold text-lg uppercase tracking-wider text-white border-b border-neutral-900 pb-4">
                ORDER LEDGER SUMMARY
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div
                    key={item.product.product_id}
                    className="flex items-center justify-between gap-3 py-2 border-b border-neutral-900/60"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-10 h-10 object-cover bg-black border border-neutral-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs text-white truncate font-medium">
                          {item.product.name}
                        </div>
                        <div className="text-[11px] font-mono text-neutral-400">
                          {item.quantity} × ${item.product.selling_price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold text-white shrink-0">
                      ${(item.product.selling_price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-neutral-900 space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Sales Tax (8%)</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Shipping & Handling</span>
                  <span className="text-white">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="pt-3 border-t border-neutral-800 flex justify-between items-baseline text-base font-sans">
                  <span className="font-display uppercase tracking-wider text-white font-bold">
                    Order Total
                  </span>
                  <span className="font-display font-extrabold text-2xl text-[#00A8FF]">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Processing Progress Feedback */}
              {isProcessing && transactionStep && (
                <div className="p-3 bg-black border border-[#00A8FF]/40 text-[#00A8FF] font-mono text-xs flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>{transactionStep}</span>
                </div>
              )}

              {/* Luxury Pill Action Button */}
              <Button
                type="submit"
                disabled={isProcessing}
                isLoading={isProcessing}
                variant="accent"
                size="lg"
                icon={!isProcessing ? <ShieldCheck className="w-4 h-4" /> : undefined}
                className="w-full py-4 text-sm font-bold"
              >
                {isProcessing ? 'EXECUTING TRANSACTION...' : `PLACE ORDER ($${grandTotal.toFixed(2)})`}
              </Button>

              <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400 justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>NO PENDING APPROVAL • INSTANT CONFIRMATION</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
