import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  Check,
  Plus,
  Minus,
  Database,
  Truck,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { ProductWithInventory } from '../types';
import { mockStore } from '../services/mockStore';
import { StockBadge } from '../components/StockBadge';
import { ProductCard } from '../components/ProductCard';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductWithInventory | undefined>();
  const [relatedProducts, setRelatedProducts] = useState<ProductWithInventory[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const current = mockStore.getProductById(id);
    if (!current) {
      navigate('/shop');
      return;
    }
    setProduct(current);
    setQuantity(1);
    setErrorMessage(null);

    // Load related products in the same category
    const all = mockStore.getProductsWithInventory();
    const related = all
      .filter((p) => p.category_id === current.category_id && p.product_id !== current.product_id)
      .slice(0, 3);
    setRelatedProducts(related);
  }, [id, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
        LOADING PRODUCT RECORD...
      </div>
    );
  }

  const isOutOfStock = product.stock_status === 'OUT_OF_STOCK';
  const maxStock = product.current_stock;

  const handleIncrement = () => {
    if (quantity < maxStock) {
      setQuantity((q) => q + 1);
      setErrorMessage(null);
    } else {
      setErrorMessage(`Maximum available stock reached (${maxStock} units).`);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
      setErrorMessage(null);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const res = mockStore.addToCart(product.product_id, quantity);
    if (res.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      setErrorMessage(null);
    } else {
      setErrorMessage(res.message || 'Unable to add to cart.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-900">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#00A8FF]" />
            BACK TO AISLES
          </Link>
          <div className="text-xs font-mono text-neutral-400">
            RECORD: <span className="text-[#00A8FF]">{product.sku}</span>
          </div>
        </div>

        {/* Main Product Details Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Dominant Product Imagery */}
          <div className="relative aspect-square w-full bg-[#050505] border border-neutral-800 overflow-hidden">
            <img
              src={product.image_url}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-700 hover:scale-105 ${
                isOutOfStock ? 'opacity-40 grayscale' : 'opacity-90 hover:opacity-100'
              }`}
            />
            <div className="absolute top-4 left-4 z-10">
              <StockBadge status={product.stock_status} stockCount={product.current_stock} />
            </div>
            <div className="absolute bottom-4 right-4 text-[10px] font-mono text-neutral-400 bg-black/80 px-2.5 py-1 border border-neutral-800">
              ID: {product.product_id}
            </div>
          </div>

          {/* Right: Purchasing Info & Relational Specs */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & Status */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-mono uppercase tracking-widest text-[#00A8FF] bg-[#00A8FF]/10 px-2 py-0.5 border border-[#00A8FF]/30">
                  {product.category_name}
                </span>
                <span className="text-neutral-700 font-mono">•</span>
                <span className="text-xs font-mono text-neutral-400">
                  SUPPLIER: {product.supplier_name}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white mb-6 leading-tight">
                {product.name}
              </h1>

              {/* Price Banner */}
              <div className="p-6 bg-[#0A0A0A] border border-neutral-900 mb-8 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                    Selling Price (USD)
                  </span>
                  <div className="font-display font-black text-4xl text-white">
                    ${product.selling_price.toFixed(2)}
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <span className="text-neutral-400 block">Inventory Ledger:</span>
                  <span className={product.current_stock > 5 ? 'text-emerald-400' : product.current_stock > 0 ? 'text-amber-400' : 'text-neutral-400'}>
                    {product.current_stock} units on hand
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4 mb-8">
                <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                  Product Specifications & Provenance
                </h3>
                <p className="text-neutral-300 text-sm leading-relaxed font-light">
                  {product.description}
                </p>
              </div>

              {/* Error Notice */}
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-950/30 border border-red-900 text-red-400 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Quantity Controls & Add To Cart Button */}
              <div className="space-y-4 mb-10">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-neutral-800 bg-[#0A0A0A] h-12">
                    <button
                      onClick={handleDecrement}
                      disabled={isOutOfStock || quantity <= 1}
                      className="w-12 h-full flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-14 text-center font-mono text-base font-bold text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      disabled={isOutOfStock || quantity >= maxStock}
                      className="w-12 h-full flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart CTA */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 h-12 flex items-center justify-center gap-2 px-8 text-xs font-mono font-bold tracking-widest uppercase transition-all duration-200 ${
                      isOutOfStock
                        ? 'bg-neutral-900 text-neutral-400 border border-neutral-800 cursor-not-allowed'
                        : added
                        ? 'bg-emerald-500 text-black'
                        : 'bg-[#00A8FF] text-black hover:bg-[#29C5FF] active:scale-95'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        ADDED TO CART
                      </>
                    ) : isOutOfStock ? (
                      'CURRENTLY OUT OF STOCK'
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        ADD TO CART (${(product.selling_price * quantity).toFixed(2)})
                      </>
                    )}
                  </button>
                </div>

                {product.stock_status === 'LOW_STOCK' && (
                  <p className="text-amber-400 text-xs font-mono">
                    Low inventory alert: Reorder threshold reached. Reserve now before exhaustion.
                  </p>
                )}
              </div>
            </div>

            {/* PostgreSQL Relational Specs Table */}
            <div className="pt-6 border-t border-neutral-900 font-mono text-xs">
              <div className="flex items-center gap-2 text-neutral-400 uppercase tracking-wider mb-4">
                <Database className="w-3.5 h-3.5 text-[#00A8FF]" />
                <span>RELATIONAL SCHEMA METADATA</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#050505] border border-neutral-900">
                <div>
                  <span className="text-[10px] text-neutral-400 block">SKU</span>
                  <span className="text-white">{product.sku}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">REORDER LEVEL</span>
                  <span className="text-white">{product.reorder_level} units</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">PRIMARY KEY</span>
                  <span className="text-white">{product.product_id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">CONSTRAINTS</span>
                  <span className="text-emerald-400">CHECK (stock &gt;= 0)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products from same aisle */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-neutral-900">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-mono text-[#00A8FF] uppercase tracking-widest block mb-1">
                  SAME DEPARTMENT
                </span>
                <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
                  RELATED AISLE ITEMS
                </h3>
              </div>
              <Link
                to={`/shop?category=${product.category_id}`}
                className="text-xs font-mono text-neutral-400 hover:text-white uppercase"
              >
                BROWSE AISLE →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.product_id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
