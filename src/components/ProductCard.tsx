import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import { ProductWithInventory } from '../types';
import { StockBadge } from './StockBadge';
import { mockStore } from '../services/mockStore';

interface ProductCardProps {
  product: ProductWithInventory;
  onAddedToCart?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddedToCart }) => {
  const [added, setAdded] = useState(false);
  const isOutOfStock = product.stock_status === 'OUT_OF_STOCK';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    const res = mockStore.addToCart(product.product_id, 1);
    if (res.success) {
      setAdded(true);
      if (onAddedToCart) onAddedToCart();
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <div className="group relative flex flex-col bg-[#09090b] border border-white/[0.08] hover:border-white/[0.22] transition-all duration-300">
      {/* Product Image Area */}
      <Link to={`/product/${product.product_id}`} className="relative block aspect-square overflow-hidden bg-black">
        <img
          src={product.image_url}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            isOutOfStock ? 'opacity-35 grayscale' : 'opacity-90 group-hover:opacity-100'
          }`}
          loading="lazy"
        />
        <div className="absolute top-3 left-3 z-10">
          <StockBadge status={product.stock_status} stockCount={product.current_stock} />
        </div>
        <div className="absolute bottom-3 left-3 text-[10px] font-mono text-neutral-400 bg-black/85 px-2 py-0.5 border border-white/10">
          {product.sku}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              {product.category_name}
            </span>
          </div>
          <Link to={`/product/${product.product_id}`} className="block">
            <h3 className="font-display font-medium text-white text-base leading-snug line-clamp-2 hover:text-neutral-300 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-neutral-400 text-xs mt-2 line-clamp-2 leading-relaxed font-light">
            {product.description}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">Unit Price</span>
            <span className="font-display text-xl font-semibold text-white tracking-tight">
              ${product.selling_price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer ${
              isOutOfStock
                ? 'bg-neutral-900 text-neutral-400 border border-neutral-800 cursor-not-allowed'
                : added
                ? 'bg-emerald-400 text-black font-semibold'
                : 'bg-white text-black font-semibold hover:bg-neutral-200 active:scale-[0.98]'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>ADDED</span>
              </>
            ) : isOutOfStock ? (
              'OUT OF STOCK'
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>ADD TO CART</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
