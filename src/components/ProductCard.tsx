import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import { ProductWithInventory } from '../types';
import { StockBadge } from './StockBadge';
import { mockStore } from '../services/mockStore';
import { Button } from './ui/Button';

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
      setTimeout(() => setAdded(false), 1600);
    }
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-surface-900 border border-white/[0.08] hover:border-white/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(0,168,255,0.08)] overflow-hidden">
      {/* Specular Card Top Highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none opacity-40 group-hover:opacity-100 group-hover:via-[#00A8FF]/40 transition-all duration-300" />

      {/* Product Image Area */}
      <Link to={`/product/${product.product_id}`} className="relative block aspect-square overflow-hidden bg-black/40">
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
        <div className="absolute bottom-3 left-3 text-[10px] font-mono text-neutral-300 bg-surface-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
          {product.sku}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#00A8FF] font-medium">
              {product.category_name}
            </span>
          </div>
          <Link to={`/product/${product.product_id}`} className="block">
            <h3 className="font-display font-semibold text-white text-base leading-snug line-clamp-2 hover:text-[#38BDF8] transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-neutral-400 text-xs mt-2 line-clamp-2 leading-relaxed font-light">
            {product.description}
          </p>
        </div>

        {/* Pricing & Modern Tactile Pill Button */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">Unit Price</span>
            <span className="font-display text-xl font-bold text-white tracking-tight">
              ${product.selling_price.toFixed(2)}
            </span>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            size="sm"
            variant={added ? 'accent' : isOutOfStock ? 'dark' : 'primary'}
            icon={
              added ? (
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : isOutOfStock ? undefined : (
                <ShoppingCart className="w-3.5 h-3.5" />
              )
            }
            className={added ? 'bg-emerald-400 text-black border-emerald-300' : ''}
          >
            {added ? 'ADDED' : isOutOfStock ? 'OUT OF STOCK' : 'ADD'}
          </Button>
        </div>
      </div>
    </div>
  );
};
