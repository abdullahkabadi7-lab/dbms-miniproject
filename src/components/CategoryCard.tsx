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
      className="group relative block aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 bg-[#09090e] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(0,168,255,0.15)]"
    >
      {/* Top Edge Specular Reflection */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity z-20" />

      {/* Background Image */}
      <img
        src={category.image_url}
        alt={category.name}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 opacity-65 group-hover:opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-10">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-300 bg-black/70 px-3 py-1 rounded-full border border-white/15 backdrop-blur-md shadow-sm">
            {category.product_count !== undefined ? `${category.product_count} PRODUCTS` : 'AISLE'}
          </span>
          <div className="w-9 h-9 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-neutral-300 group-hover:border-cyan-400 group-hover:text-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,168,255,0.5)] group-hover:scale-110 transition-all duration-300">
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        <div>
          <h3 className="font-display text-2xl font-bold uppercase text-white tracking-tight leading-tight group-hover:text-[#29C5FF] transition-colors">
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
