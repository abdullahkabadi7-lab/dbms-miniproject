import React from 'react';
import { Link } from 'react-router-dom';
import { Database, ShieldCheck, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/[0.08] text-neutral-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Purpose */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                SMART<span className="text-neutral-400">MART</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mb-2"></span>
            </Link>
            <p className="text-xs leading-relaxed text-neutral-400 font-light">
              Curated organic provisions, small-estate harvests, and deterministic live inventory fulfillment. Sourced with integrity, delivered fresh.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Real-Time Inventory Active</span>
            </div>
          </div>

          {/* Catalog & Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono tracking-widest uppercase text-white font-semibold">
              CURATED AISLES
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shop?category=cat-01" className="hover:text-white transition-colors">
                  Groceries &amp; Staples
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cat-02" className="hover:text-white transition-colors">
                  Beverages &amp; Cold Brews
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cat-03" className="hover:text-white transition-colors">
                  Dairy &amp; Chilled Foods
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cat-04" className="hover:text-white transition-colors">
                  Artisanal Bakery
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-white hover:underline font-mono">
                  Browse All Aisles &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Standards & Provenance */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono tracking-widest uppercase text-white font-semibold">
              ESTATE STANDARDS
            </h4>
            <ul className="space-y-2 text-xs font-mono text-neutral-400">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-neutral-600 rounded-full" />
                <span>100% Certified Organic</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-neutral-600 rounded-full" />
                <span>Small-Batch Cooperatives</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-neutral-600 rounded-full" />
                <span>Cold-Chain Integrity</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-neutral-600 rounded-full" />
                <span>Zero Synthetic Preservatives</span>
              </li>
            </ul>
          </div>

          {/* Portals & Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono tracking-widest uppercase text-white font-semibold">
              MANAGEMENT
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/admin" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Admin Control Console</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/inventory" className="hover:text-white transition-colors">
                  Live Stock Ledger
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Customer Order History
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Current Basket
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-12 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <div>
            &copy; 2026 SMARTMART ORGANIC PROVISIONS. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              ENGINE STATUS: OPERATIONAL
            </span>
            <span className="text-neutral-700">|</span>
            <span>POSTGRESQL RELATIONAL DESIGN</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
