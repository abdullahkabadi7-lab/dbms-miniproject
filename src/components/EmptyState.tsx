import React from 'react';
import { LucideIcon, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = ShoppingBag,
  title,
  description,
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 my-8 border border-neutral-900 bg-surface-900">
      <div className="w-14 h-14 rounded-full border border-neutral-800 flex items-center justify-center mb-5 text-neutral-400">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h3 className="text-xl font-display font-medium text-white mb-2 uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-neutral-400 text-sm max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center px-6 py-2.5 text-xs font-mono tracking-widest uppercase bg-[#00A8FF] text-black font-semibold hover:bg-[#29C5FF] transition-colors"
        >
          {actionText}
        </Link>
      )}
      {actionText && onAction && !actionLink && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-6 py-2.5 text-xs font-mono tracking-widest uppercase bg-[#00A8FF] text-black font-semibold hover:bg-[#29C5FF] transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
