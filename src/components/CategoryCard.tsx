import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link
      to={`/shop?category=${category.category_id}`}
      className="group relative block aspect-[4/5] sm:aspect-square overflow-hidden border border-white/[0.08] hover:border-white/[0.22] bg-[#09090b] transition-all duration-300"
    >
      {/* Background Image */}
      <img
        src={category.image_url}
        alt={category.name}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-60 group-hover:opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 bg-black/60 px-2 py-0.5 border border-white/10 backdrop-blur-sm">
            {category.product_count !== undefined ? `${category.product_count} PRODUCTS` : 'AISLE'}
          </span>
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-neutral-300 group-hover:border-white group-hover:text-white group-hover:bg-white/10 transition-all">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div>
          <h3 className="font-display text-2xl font-bold uppercase text-white tracking-tight leading-tight group-hover:text-neutral-200 transition-colors">
            {category.name}
          </h3>
          <p className="text-neutral-400 text-xs mt-2 line-clamp-2 leading-relaxed font-light">
            {category.description}
          </p>
        </div>
      </div>
    </Link>
  );
};
