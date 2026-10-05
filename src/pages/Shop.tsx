import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, PackageSearch } from 'lucide-react';
import { ProductWithInventory, Category, StockStatus } from '../types';
import { mockStore } from '../services/mockStore';
import { ProductCard } from '../components/ProductCard';
import { SearchBar } from '../components/SearchBar';
import { EmptyState } from '../components/EmptyState';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const [products, setProducts] = useState<ProductWithInventory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  useEffect(() => {
    const load = () => {
      setProducts(mockStore.getProductsWithInventory());
      setCategories(mockStore.getCategories());
    };
    load();
    const unsub = mockStore.subscribe(load);
    return () => unsub();
  }, []);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category_id !== selectedCategory) {
        return false;
      }
      // Stock status filter
      if (stockFilter !== 'all' && item.stock_status !== stockFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesSku = item.sku.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCat = item.category_name?.toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesDesc && !matchesCat) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.selling_price - b.selling_price;
      if (sortBy === 'price-desc') return b.selling_price - a.selling_price;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0; // featured/default
    });
  }, [products, selectedCategory, stockFilter, searchQuery, sortBy]);

  return (
    <div className="w-full min-h-screen bg-transparent text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-10 pb-8 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2">
            <span>CATALOG</span>
            <span>&bull;</span>
            <span>CURATED AISLES &amp; PROVISIONS</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-white">
            STORE AISLES
          </h1>
          <p className="text-neutral-400 text-sm mt-2 font-light max-w-2xl">
            Browse our full selection of certified organic provisions. Real-time stock counts indicate immediate warehouse readiness.
          </p>
        </div>

        {/* Search & Global Controls */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search catalog by name, brand, SKU..."
            className="flex-1 max-w-xl"
          />

          <div className="flex flex-wrap items-center gap-3">
            {/* Stock State Filter Pill */}
            <div className="flex items-center rounded-full bg-white/[0.04] border border-white/15 backdrop-blur-md text-xs font-mono px-3 py-1 shadow-sm">
              <span className="pr-2 text-neutral-400 border-r border-white/10 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                STOCK:
              </span>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="bg-transparent text-white px-2 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-[#09090b] text-white">All Items</option>
                <option value="IN_STOCK" className="bg-[#09090b] text-emerald-400">In Stock Only</option>
                <option value="LOW_STOCK" className="bg-[#09090b] text-amber-400">Low Stock Only</option>
                <option value="OUT_OF_STOCK" className="bg-[#09090b] text-neutral-400">Out of Stock</option>
              </select>
            </div>

            {/* Sort Filter Pill */}
            <div className="flex items-center rounded-full bg-white/[0.04] border border-white/15 backdrop-blur-md text-xs font-mono px-3 py-1 shadow-sm">
              <span className="pr-2 text-neutral-400 border-r border-white/10">
                SORT:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-white px-2 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-[#09090b] text-white">Default / Featured</option>
                <option value="price-asc" className="bg-[#09090b] text-white">Price: Low to High</option>
                <option value="price-desc" className="bg-[#09090b] text-white">Price: High to Low</option>
                <option value="name-asc" className="bg-[#09090b] text-white">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills / Tabs */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 border-b border-white/[0.08] scrollbar-none">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-5 py-2 text-xs font-mono uppercase tracking-wider whitespace-nowrap rounded-full transition-all duration-300 cursor-pointer active:scale-95 ${
              selectedCategory === 'all'
                ? 'bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.35)] scale-105'
                : 'bg-white/[0.04] text-neutral-400 border border-white/10 hover:text-white hover:bg-white/[0.08] hover:border-white/25'
            }`}
          >
            All Aisles ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.category_id}
              onClick={() => handleCategoryChange(cat.category_id)}
              className={`px-5 py-2 text-xs font-mono uppercase tracking-wider whitespace-nowrap rounded-full transition-all duration-300 cursor-pointer active:scale-95 ${
                selectedCategory === cat.category_id
                  ? 'bg-gradient-to-r from-[#00A8FF] to-[#29C5FF] text-black font-bold shadow-[0_0_20px_rgba(0,168,255,0.45)] scale-105'
                  : 'bg-white/[0.04] text-neutral-400 border border-white/10 hover:text-white hover:bg-white/[0.08] hover:border-white/25'
              }`}
            >
              {cat.name} ({cat.product_count ?? 0})
            </button>
          ))}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-6">
          <span>SHOWING {filteredProducts.length} OF {products.length} PRODUCTS</span>
          {stockFilter !== 'all' && (
            <span className="text-white font-semibold">FILTERED BY: {stockFilter.replace('_', ' ')}</span>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={PackageSearch}
            title="NO PRODUCTS FOUND"
            description="We could not find any products matching your active search query or filter selection."
            actionText="CLEAR FILTERS"
            onAction={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setStockFilter('all');
              searchParams.delete('category');
              setSearchParams(searchParams);
            }}
          />
        )}
      </div>
    </div>
  );
};
