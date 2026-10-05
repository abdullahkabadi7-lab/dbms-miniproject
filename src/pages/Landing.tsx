import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Database, Layers, ArrowUpRight, Zap, RotateCcw } from 'lucide-react';
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

  useEffect(() => {
    const load = () => {
      setProducts(mockStore.getProductsWithInventory());
      setCategories(mockStore.getCategories());
    };
    load();
    const unsub = mockStore.subscribe(load);
    return () => unsub();
  }, []);

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="w-full bg-transparent text-white">
      {/* 1. Locked Cinematic Entrance with Fixed Video & Photo */}
      {!hasEntered && (
        <CinematicEntrance onComplete={() => setHasEntered(true)} />
      )}

      {/* 2. Supermarket Shelf Section (Image 1) - Seen immediately after entrance video ends */}
      <ShelfSection />

      {/* ======================================================== */}
      {/* 3. EDITORIAL HERO SECTION (Image 2)                      */}
      {/* Follows directly below the shelf as user scrolls down    */}
      {/* ======================================================== */}
      <section id="store-hero-section" className="relative min-h-[85vh] flex flex-col justify-between p-6 sm:p-12 lg:p-16 border-b border-white/[0.08] bg-transparent overflow-hidden">
        {/* Top Editorial Meta */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-10 font-mono text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold tracking-wider">HARVEST 2026</span>
            <span className="text-neutral-700">/</span>
            <span className="text-neutral-400">ORGANIC ARTISANAL PROVISIONS</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] backdrop-blur-md shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            <span>LIVE STOCK SYNCHRONIZATION ACTIVE</span>
          </div>
        </div>

        {/* Hero Main Content */}
        <div className="my-auto py-12 z-10 max-w-5xl">
          <h2 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tighter uppercase leading-[0.9] mb-8 text-white">
            CURATED <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 via-neutral-200 to-neutral-500">ORGANIC</span> <br />
            RESERVE.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end pt-4">
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
              Sourced directly from certified organic family estates and regenerative cooperatives. Every single item in our digital aisles reflects real-time synchronized inventory so you never face out-of-stock cancellations.
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

        {/* Quality & Trust Pillars (Replacing fake DBMS stat box) */}
        <div className="pt-8 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-6 z-10 font-mono">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-neutral-400">PROVENANCE</div>
            <div className="text-sm font-semibold text-white mt-1">100% CERTIFIED ORGANIC</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-neutral-400">BATCH PRODUCTION</div>
            <div className="text-sm font-semibold text-white mt-1">SMALL-ORIGIN ESTATES</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-neutral-400">LOGISTICS INTEGRITY</div>
            <div className="text-sm font-semibold text-emerald-400 mt-1">COLD-CHAIN PRESERVED</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-neutral-400">INVENTORY ASSURANCE</div>
            <div className="text-sm font-semibold text-white mt-1">ATOMIC RESERVATIONS</div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* FEATURED CATEGORIES / AISLES                            */}
      {/* ======================================================== */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 border-b border-white/[0.08]">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-2">
              DEPARTMENTS // CURATED CATEGORIES
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              FEATURED AISLES
            </h2>
          </div>
          <Link
            to="/shop"
            className="group flex items-center gap-1.5 text-xs font-mono tracking-wider text-neutral-400 hover:text-white uppercase"
          >
            <span>VIEW ALL DEPARTMENTS</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 text-white transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((cat) => (
            <CategoryCard key={cat.category_id} category={cat} />
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* FEATURED PRODUCTS (Curated Essentials)                   */}
      {/* ======================================================== */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 border-b border-white/[0.08] bg-transparent">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
              DAILY HARVEST // CURATED SELECTIONS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              CURATED ESSENTIALS
            </h2>
          </div>
          <Link
            to="/shop"
            className="group flex items-center gap-1.5 text-xs font-mono tracking-wider text-neutral-400 hover:text-white uppercase"
          >
            <span>FULL INVENTORY CATALOG</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 text-white transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* THE SMARTMART STANDARD (Editorial Quality Pillars)       */}
      {/* ======================================================== */}
      <section className="py-24 px-4 sm:px-8 lg:px-12 border-b border-white/[0.08] bg-transparent">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-3">
            CULINARY-GRADE EXECUTION
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white mb-6">
            THE SMARTMART STANDARD
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-light max-w-2xl mx-auto">
            From estate harvesting to atomic checkout validation, our end-to-end standard guarantees pure organic integrity and zero stock disappointment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-8 rounded-2xl bg-[#09090e]/80 border border-white/10 hover:border-white/25 backdrop-blur-md relative transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)]">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-4">
              01 // PROVENANCE
            </span>
            <h3 className="font-display font-bold text-lg uppercase text-white mb-2">
              Traceable Lineage
            </h3>
            <p className="text-neutral-400 text-xs leading-relaxed font-light">
              Every provision is cataloged with verified estate origins, harvest timestamps, and zero synthetic additive certifications.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#09090e]/80 border border-white/10 hover:border-white/25 backdrop-blur-md relative transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)]">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-4">
              02 // INVENTORY
            </span>
            <h3 className="font-display font-bold text-lg uppercase text-white mb-2">
              Deterministic Stock
            </h3>
            <p className="text-neutral-400 text-xs leading-relaxed font-light">
              Orders and inventory decrements execute atomically. If an item sells out in the warehouse, its status updates instantly across all aisles.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#09090e]/80 border border-white/10 hover:border-white/25 backdrop-blur-md relative transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)]">
            <span className="text-xs font-mono text-[#00A8FF] uppercase tracking-widest block mb-4">
              03 // FULFILLMENT
            </span>
            <h3 className="font-display font-bold text-lg uppercase text-white mb-2">
              Cold-Chain Assurance
            </h3>
            <p className="text-neutral-400 text-xs leading-relaxed font-light">
              Fresh dairy, artisanal cold brews, and seasonal produce are maintained within strict temperature envelopes from receipt to doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SHOPPING CTA BANNER                                     */}
      {/* ======================================================== */}
      <section className="py-24 px-6 sm:px-12 text-center bg-gradient-to-b from-[#070709] via-black to-[#050508] relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="font-display font-extrabold text-4xl sm:text-6xl uppercase tracking-tighter text-white mb-6">
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
