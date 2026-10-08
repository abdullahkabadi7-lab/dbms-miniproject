import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  RotateCcw,
  CheckCircle2,
  Package,
  ShieldCheck,
  Truck,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { ProductWithInventory, Category } from '../types';
import { mockStore } from '../services/mockStore';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';
import { CinematicEntrance } from '../components/cinematic/CinematicEntrance';
import { ShelfSection } from '../components/ShelfSection';
import { Button } from '../components/ui/Button';

export const Landing: React.FC = () => {
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductWithInventory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stockFilter, setStockFilter] = useState<'all' | 'instock' | 'lowstock'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const load = () => {
      setProducts(mockStore.getProductsWithInventory());
      setCategories(mockStore.getCategories());
    };
    load();
    const unsub = mockStore.subscribe(load);
    return () => unsub();
  }, []);

  const totalInStock = products.filter((p) => p.current_stock > 0).length;
  const totalUnits = products.reduce((acc, p) => acc + (p.current_stock || 0), 0);

  // Filter products for the showcase section
  const displayedProducts = products
    .filter((p) => {
      if (selectedCategory !== 'all' && p.category_id !== selectedCategory) return false;
      if (stockFilter === 'instock') return p.stock_status === 'IN_STOCK';
      if (stockFilter === 'lowstock') return p.stock_status === 'LOW_STOCK';
      return true;
    })
    .slice(0, 8);

  return (
    <div className="w-full bg-transparent text-white selection:bg-[#00A8FF] selection:text-black">
      {/* ======================================================== */}
      {/* 1. LOCKED & PROTECTED CINEMATIC ENTRANCE                 */}
      {/* ======================================================== */}
      {!hasEntered && (
        <CinematicEntrance onComplete={() => setHasEntered(true)} />
      )}

      {/* ======================================================== */}
      {/* 2. LOCKED & PROTECTED SUPERMARKET SHELF SECTION          */}
      {/* ======================================================== */}
      <ShelfSection />

      {/* ======================================================== */}
      {/* 3. STORE OVERVIEW & CATALOG TRANSITION                   */}
      {/* ======================================================== */}
      <section className="relative py-16 px-4 sm:px-8 lg:px-12 border-b border-white/10 bg-transparent">
        <div className="max-w-7xl mx-auto">
          {/* Top Section Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#00A8FF]" />
              <span className="text-xs font-mono tracking-wider uppercase text-neutral-400">
                SMARTMART GROCERY & PANTRY
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Live Stock Sync Active
              </span>
              <span className="text-neutral-700 hidden sm:inline">|</span>
              <span className="text-neutral-300 hidden sm:inline">
                {totalInStock} Available Products ({totalUnits} Total Units)
              </span>
            </div>
          </div>

          {/* Headline & Description */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <h1 className="font-display font-bold text-4xl sm:text-6xl tracking-tight text-white leading-[1.05] mb-6">
                Fresh provisions, <br />
                <span className="text-neutral-400">accurately tracked.</span>
              </h1>
              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                Every item in our digital aisles is connected directly to real-time warehouse inventory. What you see available is guaranteed for checkout—eliminating backorders, delays, and out-of-stock cancellations.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-wrap lg:justify-end items-center gap-3.5">
              <Button
                to="/shop"
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Shop All Products
              </Button>

              <Button
                to="/admin"
                variant="secondary"
                size="lg"
                icon={<ArrowUpRight className="w-4 h-4 text-[#00A8FF]" />}
              >
                Admin Portal
              </Button>

              <Button
                onClick={() => setHasEntered(false)}
                variant="dark"
                size="md"
                icon={<RotateCcw className="w-3.5 h-3.5" />}
                title="Replay entrance intro"
              >
                Replay Intro
              </Button>
            </div>
          </div>

          {/* Key Storefront Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 mt-12 border-t border-white/[0.08]">
            <div>
              <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-1">
                INVENTORY MODEL
              </div>
              <div className="text-sm font-semibold text-white">
                Live Physical Sync
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Zero phantom stock or double selling
              </p>
            </div>

            <div>
              <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-1">
                SOURCING
              </div>
              <div className="text-sm font-semibold text-white">
                Certified Producers
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Regenerative and small-origin partners
              </p>
            </div>

            <div>
              <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-1">
                FULFILLMENT
              </div>
              <div className="text-sm font-semibold text-emerald-400">
                Cold-Chain Care
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Temperature-controlled delivery
              </p>
            </div>

            <div>
              <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-1">
                REPLENISHMENT
              </div>
              <div className="text-sm font-semibold text-[#00A8FF]">
                Auto Restock Loop
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Predictive supplier orders on threshold
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. FEATURED DEPARTMENTS / AISLES                          */}
      {/* ======================================================== */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 border-b border-white/10 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-mono text-[#00A8FF] uppercase tracking-wider block mb-2 font-semibold">
                DEPARTMENTS
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Explore Our Aisles
              </h2>
            </div>
            <Link
              to="/shop"
              className="group inline-flex items-center gap-1.5 text-xs font-mono tracking-wider text-neutral-400 hover:text-white uppercase transition-colors"
            >
              <span>View All Departments</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#00A8FF] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((cat) => (
              <CategoryCard key={cat.category_id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. CURATED PRODUCTS SHOWCASE                              */}
      {/* ======================================================== */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 border-b border-white/10 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-10 gap-6">
            <div>
              <span className="text-xs font-mono text-[#00A8FF] uppercase tracking-wider block mb-2 font-semibold">
                FEATURED SELECTION
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Curated Essentials
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1 bg-surface-900/90 border border-white/10 rounded-xl">
              <button
                onClick={() => { setStockFilter('all'); setSelectedCategory('all'); }}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
                  stockFilter === 'all' && selectedCategory === 'all'
                    ? 'bg-[#00A8FF] text-black font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                All Items
              </button>
              <button
                onClick={() => setStockFilter('instock')}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
                  stockFilter === 'instock'
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                In Stock Only
              </button>
              <button
                onClick={() => setStockFilter('lowstock')}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
                  stockFilter === 'lowstock'
                    ? 'bg-amber-500 text-black font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Low Stock
              </button>

              {categories.slice(0, 2).map((c) => (
                <button
                  key={c.category_id}
                  onClick={() => setSelectedCategory(c.category_id)}
                  className={`hidden sm:inline-block px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
                    selectedCategory === c.category_id
                      ? 'bg-white text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {displayedProducts.length === 0 ? (
            <div className="py-16 text-center border border-white/10 bg-surface-900/80 rounded-2xl p-8">
              <Package className="w-8 h-8 text-neutral-500 mx-auto mb-3" />
              <p className="text-neutral-300 font-mono text-sm">No items found matching the selected filter</p>
              <button
                onClick={() => { setStockFilter('all'); setSelectedCategory('all'); }}
                className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase rounded-lg"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-neutral-400">
            <div>
              Showing <span className="text-white font-semibold">{displayedProducts.length}</span> of{' '}
              <span className="text-white font-semibold">{products.length}</span> catalog items
            </div>
            <Link
              to="/shop"
              className="flex items-center gap-1.5 text-[#00A8FF] hover:text-[#38BDF8] font-bold tracking-wider uppercase transition-colors"
            >
              <span>Explore Full Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. HOW SMARTMART WORKS (VALUE & INTEGRITY PILLARS)        */}
      {/* ======================================================== */}
      <section className="py-24 px-4 sm:px-8 lg:px-12 border-b border-white/10 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-mono text-[#00A8FF] uppercase tracking-wider block mb-2 font-semibold">
              OUR INVENTORY STANDARDS
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
              Built for reliability, from farm to kitchen.
            </h2>
            <p className="text-neutral-300 text-base leading-relaxed font-normal">
              Traditional grocery platforms frequently accept orders for items that have already sold out. SmartMart combines premium regional sourcing with deterministic inventory management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-7 rounded-2xl bg-surface-900/80 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#00A8FF]/10 flex items-center justify-center text-[#00A8FF] mb-5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-display font-semibold text-lg text-white mb-2">
                  True Stock Visibility
                </h3>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Every product status is directly synchronized with warehouse records. If an item is on our shelf, it is in stock and ready to ship.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.08] text-[11px] font-mono text-neutral-500">
                REAL-TIME DATABASE SYNC
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-surface-900/80 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-5">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="font-display font-semibold text-lg text-white mb-2">
                  Guaranteed Cart Lock
                </h3>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Checkout transactions lock stock immediately to protect your basket. You never face post-purchase cancellation emails.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.08] text-[11px] font-mono text-emerald-400/80">
                ATOMIC ORDER LOCKING
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-surface-900/80 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-5">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="font-display font-semibold text-lg text-white mb-2">
                  Cold-Chain Logistics
                </h3>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Perishable dairy, artisan breads, and farm-fresh produce are packed in temperature-controlled boxes from dispatch to your door.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.08] text-[11px] font-mono text-neutral-500">
                PRESERVED AT OPTIMAL TEMP
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-surface-900/80 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-5">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h3 className="font-display font-semibold text-lg text-white mb-2">
                  Proactive Restocking
                </h3>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  When inventory approaches threshold minimums, automated supplier notifications trigger reorders so essentials stay in stock.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.08] text-[11px] font-mono text-amber-400/80">
                SUPPLIER THRESHOLD ALERTS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. SHOPPING CTA BANNER                                    */}
      {/* ======================================================== */}
      <section className="py-24 px-6 sm:px-12 text-center bg-transparent relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-surface-900 border border-white/10 text-neutral-300 text-xs font-mono uppercase tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5 text-[#00A8FF]" />
            <span>Delivered Fresh to Your Door</span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-white mb-5">
            Ready to stock your kitchen?
          </h2>
          <p className="text-neutral-300 text-base sm:text-lg mb-8 max-w-xl mx-auto font-normal">
            Order fresh groceries, single-origin roasts, and pantry staples with guaranteed stock availability.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              to="/shop"
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Shop Products Now
            </Button>
            <Button
              to="/admin"
              variant="secondary"
              size="lg"
              icon={<ArrowUpRight className="w-4 h-4 text-[#00A8FF]" />}
            >
              Open Admin Portal
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
