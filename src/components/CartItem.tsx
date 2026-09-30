import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../types';
import { mockStore } from '../services/mockStore';

interface CartItemProps {
  item: CartItemType;
  onUpdate?: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, onUpdate }) => {
  const { product, quantity } = item;
  const isMaxStock = quantity >= product.current_stock;

  const handleIncrement = () => {
    if (!isMaxStock) {
      mockStore.updateCartQuantity(product.product_id, quantity + 1);
      if (onUpdate) onUpdate();
    }
  };

  const handleDecrement = () => {
    mockStore.updateCartQuantity(product.product_id, quantity - 1);
    if (onUpdate) onUpdate();
  };

  const handleRemove = () => {
    mockStore.removeFromCart(product.product_id);
    if (onUpdate) onUpdate();
  };

  const lineTotal = (product.selling_price * quantity).toFixed(2);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-[#0A0A0A] border border-neutral-900 hover:border-neutral-800 transition-colors">
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 flex-1">
        <Link to={`/product/${product.product_id}`} className="shrink-0 w-20 h-20 bg-black overflow-hidden border border-neutral-800">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </Link>
        <div className="min-w-0">
          <span className="text-[10px] font-mono text-[#00A8FF] uppercase tracking-wider block">
            {product.category_name} • {product.sku}
          </span>
          <Link
            to={`/product/${product.product_id}`}
            className="text-white font-medium hover:text-[#00A8FF] transition-colors line-clamp-1 text-sm sm:text-base font-display"
          >
            {product.name}
          </Link>
          <div className="text-neutral-400 text-xs mt-1">
            ${product.selling_price.toFixed(2)} each
            {product.current_stock < 10 && (
              <span className="ml-2 text-amber-400 font-mono text-[11px]">
                ({product.current_stock} available)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-900">
        <div className="flex items-center border border-neutral-800 bg-black">
          <button
            onClick={handleDecrement}
            className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center font-mono text-sm font-semibold text-white">
            {quantity}
          </span>
          <button
            onClick={handleIncrement}
            disabled={isMaxStock}
            className={`w-8 h-8 flex items-center justify-center transition-colors ${
              isMaxStock
                ? 'text-neutral-600 cursor-not-allowed'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-right min-w-[80px]">
          <span className="text-xs font-mono text-neutral-400 block sm:hidden">Total</span>
          <span className="font-display font-semibold text-lg text-white">
            ${lineTotal}
          </span>
        </div>

        <button
          onClick={handleRemove}
          className="text-neutral-400 hover:text-red-400 p-2 transition-colors"
          title="Remove item"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
