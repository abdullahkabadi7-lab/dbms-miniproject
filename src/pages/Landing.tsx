import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Database,
  Layers,
  ArrowUpRight,
  Zap,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Lock,
  ThermometerSnowflake,
  PackageCheck,
  SlidersHorizontal
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
  const [filterMode, setFilterMode] = useState<'all' | 'instock' | 'limited'>('all');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');

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
  const totalStockUnits = products.reduce((sum, p) => sum + (p.current_stock || 0), 0);

  // Filter products for curated showcase
  const displayedProducts = products
    .filter((p) => {
      if (selectedCategoryTab !== 'all' && p.category_id !== selectedCategoryTab) return false;
      if (filterMode === 'instock') return p.stock_status === 'IN_STOCK';
      if (filterMode === 'limited') return p.stock_status === 'LOW_STOCK';
      return true;
    })
    .slice(0, 8);

  return (
    <div className="w-full bg-transparent text-white selection:bg-[#00A8FF] selection:text-black">
      {/* 1. Cinematic Entrance */}
      {!hasEntered && (
        <CinematicEntrance onComplete={() => setHasEntered(true)} />
      )}

      {/* 2. Supermarket Shelf Section */}
      <ShelfSection />

      {/* ======================================================== */}
      {/* REAL-TIME WAREHOUSE TELEMETRY RIBBON                     */}
      {/* ======================================================== */}
      <div className="border-y border-white/[0.08] bg-[#08090E]/60 backdrop-blur-md overflow-hidden py-3 font-mono text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              POSTGRESQL 16 CONNECTED
            </span>
            <span className="text-neutral-700">|</span>
            <span className="text-neutral-400 hidden sm:inline">
              ACID ATOMIC ISOLATION
            </span>
            <span className="text-neutral-700 hidden sm:inline">|</span>
            <span className="text-neutral-300">
              <strong className="text-white font-medium">{totalInStock}</strong> SKUs AVAILABLE NOW
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-neutral-400">
            <span className="flex items-center gap-1 text-cyan-400">
              <ThermometerSnowflake className="w-3.5 h-3.5" />
              <span>COLD-CHAIN 3.8°C</span>
            </span>
            <span className="hidden md:flex items-center gap-1 text-neutral-400">
              <Lock className="w-3 h-3 text-[#00A8FF]" />
              <span>ZERO PHANTOM STOCK</span>
            </span>
            <span className="text-neutral-300">
              STOCK UNITS: <span className="text-white font-bold">{totalStockUnits}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. EDITORIAL HERO & CURATED RESERVE                       */}
      {/* ======================================================== */}
      <section id="store-hero-section" className="relative min-h-[85vh] flex flex-col justify-between p-6 sm:p-12 lg:p-16 border-b border-white/[0.08] bg-transparent overflow-hidden">
        {/* Subtle Radial Glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#00A8FF]/5 rounded-full blur-[140px] pointer-events-none" />

        {/* Top Editorial Meta */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-10 font-mono text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold tracking-wider">HARVEST CYCLE 2026</span>
            <span className="text-neutral-700">/</span>
            <span className="text-neutral-400">CERTIFIED REGENERATIVE PROVISIONS</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-800 border border-white/10 text-neutral-300 text-[11px] backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.8)] animate-pulse" />
            <span>REAL-TIME INVENTORY LEDGER ACTIVE</span>
          </div>
        </div>

        {/* Hero Main Content */}
        <div className="my-auto py-12 z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-md bg-[#00A8FF]/10 border border-[#00A8FF]/30 text-[#38BDF8] text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ARTISANAL PROVENANCE & STRICT DBMS VALIDATION</span>
          </div>

          <h2 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.92] mb-8 text-white">
            CURATED <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 via-neutral-100 to-neutral-400">ORGANIC</span> <br />
            RESERVE.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end pt-4">
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
              Sourced directly from certified biodynamic family estates and regenerative cooperatives. Every single product reflects atomic database inventory locking so checkout is deterministic and guaranteed.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                to="/shop"
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                EXPLORE CATALOG
              </Button>

              <Button
                to="/admin"
                variant="secondary"
                size="lg"
                icon={<ArrowUpRight className="w-4 h-4 text-cyan-400" />}
              >
                ADMIN CONSOLE
              </Button>

              <Button
                onClick={() => setHasEntered(false)}
                variant="dark"
                size="md"
                icon={<RotateCcw className="w-3.5 h-3.5" />}
                iconPosition="left"
                title="Replay entrance video"
              >
                REPLAY
              </Button>
            </div>
          </div>
        </div>

        {/* Quality & Trust Pillars */}
        <div className="pt-8 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-6 z-10 font-mono">
          <div className="border-l border-white/10 pl-4">
            <div className="text-[10px] uppercase tracking-wider text-neutral-500">PROVENANCE</div>
            <div className="text-sm font-semibold text-white mt-1">100% ORGANIC CERTIFIED</div>
          </div>
          <div className="border-l border-white/10 pl-4">
            <div className="text-[10px] uppercase tracking-wider text-neutral-500">BATCH PRODUCTION</div>
            <div className="text-sm font-semibold text-white mt-1">SMALL-ORIGIN ESTATES</div>
          </div>
          <div className="border-l border-white/10 pl-4">
            <div className="text-[10px] uppercase tracking-wider text-neutral-500">LOGISTICS INTEGRITY</div>
            <div className="text-sm font-semibold text-emerald-400 mt-1">COLD-CHAIN PRESERVED</div>
          </div>
          <div className="border-l border-white/10 pl-4">
            <div className="text-[10px] uppercase tracking-wider text-neutral-500">INVENTORY ASSURANCE</div>
            <div className="text-sm font-semibold text-cyan-400 mt-1">ATOMIC RESERVATIONS</div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. FEATURED AISLES / BENTO DEPARTMENT GRID                */}
      {/* ======================================================== */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 border-b border-white/[0.08] bg-transparent">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
              DEPARTMENTS // CURATED CATEGORIES
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              FEATURED AISLES
            </h2>
          </div>
          <Link
            to="/shop"
            className="group flex items-center gap-1.5 text-xs font-mono tracking-wider text-neutral-400 hover:text-white uppercase transition-colors"
          >
            <span>VIEW ALL DEPARTMENTS</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 text-[#00A8FF] transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((cat) => (
            <CategoryCard key={cat.category_id} category={cat} />
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. CURATED ESSENTIALS SHOWCASE WITH LIVE FILTERS          */}
      {/* ======================================================== */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 border-b border-white/[0.08] bg-transparent">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A8FF]" />
              <span className="text-[10px] font-mono text-[#00A8FF] uppercase tracking-widest">
                DAILY HARVEST // SYNCHRONIZED CATALOG
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              CURATED ESSENTIALS
            </h2>
          </div>

          {/* Quick Filter Control Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-surface-900 border border-white/10 rounded-xl">
            <button
              onClick={() => { setFilterMode('all'); setSelectedCategoryTab('all'); }}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
                filterMode === 'all' && selectedCategoryTab === 'all'
                  ? 'bg-[#00A8FF] text-black font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              ALL PROVISIONS
            </button>
            <button
              onClick={() => setFilterMode('instock')}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
                filterMode === 'instock'
                  ? 'bg-emerald-500 text-black font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              IN-STOCK ONLY
            </button>
            <button
              onClick={() => setFilterMode('limited')}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
                filterMode === 'limited'
                  ? 'bg-amber-500 text-black font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              LIMITED HARVEST
            </button>

            {categories.slice(0, 2).map((c) => (
              <button
                key={c.category_id}
                onClick={() => setSelectedCategoryTab(c.category_id)}
                className={`hidden sm:inline-block px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
                  selectedCategoryTab === c.category_id
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {displayedProducts.length === 0 ? (
          <div className="py-16 text-center border border-white/10 bg-surface-900 rounded-2xl p-8">
            <PackageCheck className="w-8 h-8 text-neutral-500 mx-auto mb-3" />
            <p className="text-neutral-400 font-mono text-sm">NO ITEMS MATCH CURRENT FILTER SELECTION</p>
            <button
              onClick={() => { setFilterMode('all'); setSelectedCategoryTab('all'); }}
              className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase rounded-lg"
            >
              RESET FILTERS
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
            SHOWING <span className="text-white font-semibold">{displayedProducts.length}</span> OF{' '}
            <span className="text-white font-semibold">{products.length}</span> REGISTERED SKUS
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-1.5 text-[#00A8FF] hover:text-[#38BDF8] font-bold tracking-wider uppercase transition-colors"
          >
            <span>ACCESS FULL AISLE CATALOG</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. THE SMARTMART STANDARD (Architectural Bento Showcase)  */}
      {/* ======================================================== */}
      <section className="py-24 px-4 sm:px-8 lg:px-12 border-b border-white/[0.08] bg-transparent">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-3">
            TECHNICAL & CULINARY EXCELLENCE
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white mb-6">
            THE SMARTMART STANDARD
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-light max-w-2xl mx-auto">
            From estate harvesting to atomic checkout validation, our architecture pairs organic purity with zero stock disappointment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Bento Card 1 */}
          <div className="p-8 rounded-2xl bg-surface-900/80 border border-white/10 hover:border-white/20 backdrop-blur-md relative transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)] flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-4">
                01 // ORIGIN
              </span>
              <h3 className="font-display font-bold text-lg uppercase text-white mb-2">
                Traceable Lineage
              </h3>
              <p className="text-neutral-400 text-xs leading-relaxed font-light">
                Every provision is cataloged with certified estate origins, harvest timestamps, and zero synthetic additive certifications.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] font-mono text-neutral-500">
              ESTATE VERIFIED: 100%
            </div>
          </div>

          {/* Bento Card 2 */}
          <div className="p-8 rounded-2xl bg-surface-900/80 border border-white/10 hover:border-white/20 backdrop-blur-md relative transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)] flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-4">
                02 // ATOMICITY
              </span>
              <h3 className="font-display font-bold text-lg uppercase text-white mb-2">
                Deterministic Stock
              </h3>
              <p className="text-neutral-400 text-xs leading-relaxed font-light">
                PostgreSQL row locks (`SELECT FOR UPDATE`) prevent race conditions. Orders and stock decrements commit synchronously.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] font-mono text-emerald-400/80">
              ISOLATION: SERIALIZABLE
            </div>
          </div>

          {/* Bento Card 3 */}
          <div className="p-8 rounded-2xl bg-surface-900/80 border border-white/10 hover:border-white/20 backdrop-blur-md relative transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)] flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-[#00A8FF] uppercase tracking-widest block mb-4">
                03 // FRESHNESS
              </span>
              <h3 className="font-display font-bold text-lg uppercase text-white mb-2">
                Cold-Chain Guarantee
              </h3>
              <p className="text-neutral-400 text-xs leading-relaxed font-light">
                Artisanal dairy, cold brews, and seasonal farm produce are preserved in monitored cold envelopes from receipt to doorstep.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] font-mono text-neutral-500">
              ENVELOPE: 3.8°C MONITORED
            </div>
          </div>

          {/* Bento Card 4 */}
          <div className="p-8 rounded-2xl bg-surface-900/80 border border-white/10 hover:border-white/20 backdrop-blur-md relative transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)] flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-4">
                04 // RESTOCKING
              </span>
              <h3 className="font-display font-bold text-lg uppercase text-white mb-2">
                Supplier Loop
              </h3>
              <p className="text-neutral-400 text-xs leading-relaxed font-light">
                When inventory approaches threshold minimums, automated replenishments log full audit trails in `stock_transactions`.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] font-mono text-amber-400/80">
              AUDIT TRAILS: AUDITABLE
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. SHOPPING CTA BANNER                                    */}
      {/* ======================================================== */}
      <section className="py-24 px-6 sm:px-12 text-center bg-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,168,255,0.08),transparent_70%)] pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-mono tracking-widest uppercase">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>INSTANT DISPATCH AVAILABLE</span>
          </div>

          <h2 className="font-display font-extrabold text-4xl sm:text-6xl uppercase tracking-tight text-white mb-6">
            ELEVATE YOUR DAILY TABLE
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mb-10 max-w-xl mx-auto font-light">
            Browse our full catalog of organic staples, single-origin roasts, and fresh bakery goods with real-time stock assurance.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              to="/shop"
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              SHOP PRODUCTS NOW
            </Button>
            <Button
              to="/admin"
              variant="secondary"
              size="lg"
              icon={<ArrowUpRight className="w-4 h-4 text-cyan-400" />}
            >
              VIEW ADMIN CONSOLE
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
