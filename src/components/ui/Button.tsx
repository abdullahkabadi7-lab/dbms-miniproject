import React from 'react';
import { Link } from 'react-router-dom';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'dark' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  to?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  pill?: boolean;
  glow?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  to,
  icon,
  iconPosition = 'right',
  isLoading = false,
  pill = true,
  glow = true,
  className = '',
  disabled,
  ...props
}) => {
  // Base classes with tactile physics, refined typography, and anti-slop smooth transitions
  const baseClasses = `
    group relative inline-flex items-center justify-center font-mono font-semibold tracking-wider uppercase
    transition-all duration-300 ease-out select-none cursor-pointer overflow-hidden
    active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8FF]/50
    disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100 disabled:shadow-none
    ${pill ? 'rounded-full' : 'rounded-2xl'}
  `;

  // Size variations
  const sizeClasses = {
    sm: 'text-[11px] px-4 py-2 gap-1.5',
    md: 'text-xs px-6 py-2.5 gap-2',
    lg: 'text-xs sm:text-sm px-8 py-3.5 gap-2.5',
  }[size];

  // Variant styling with multi-layer depth & specular highlights
  const variantClasses = {
    primary: `
      bg-white text-black hover:bg-neutral-100 border border-white/60
      ${glow ? 'shadow-[0_0_20px_rgba(255,255,255,0.22)] hover:shadow-[0_0_30px_rgba(255,255,255,0.45)]' : ''}
    `,
    secondary: `
      bg-white/[0.05] hover:bg-white/[0.12] text-white
      border border-white/15 hover:border-white/40
      backdrop-blur-md
      ${glow ? 'hover:shadow-[0_0_25px_rgba(255,255,255,0.12)]' : ''}
    `,
    accent: `
      bg-gradient-to-r from-[#00A8FF] via-[#29C5FF] to-[#00A8FF] bg-[length:200%_auto] hover:bg-right
      text-black font-bold border border-cyan-300/40
      ${glow ? 'shadow-[0_0_25px_rgba(0,168,255,0.4)] hover:shadow-[0_0_35px_rgba(0,168,255,0.7)]' : ''}
    `,
    dark: `
      bg-[#0e0e12]/90 hover:bg-[#181820] text-neutral-200 hover:text-white
      border border-white/10 hover:border-white/25
      backdrop-blur-sm
      ${glow ? 'hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)]' : ''}
    `,
    ghost: `
      bg-transparent hover:bg-white/[0.08] text-neutral-400 hover:text-white
      border border-transparent
    `,
    danger: `
      bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300
      border border-red-500/25 hover:border-red-500/50
      ${glow ? 'hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]' : ''}
    `,
  }[variant];

  const content = (
    <>
      {/* Subtle top edge specular highlight for high-end tactile feel */}
      <span
        className="absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"
        aria-hidden="true"
      />

      {/* Micro Shimmer Light Sweep on Hover */}
      <span
        className="absolute -inset-full bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none"
        aria-hidden="true"
      />

      {/* Icon (Left) */}
      {icon && iconPosition === 'left' && !isLoading && (
        <span className="shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5">
          {icon}
        </span>
      )}

      {/* Loading Spinner */}
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : null}

      {/* Label Content */}
      <span className="relative z-10">{children}</span>

      {/* Icon (Right) */}
      {icon && iconPosition === 'right' && !isLoading && (
        <span className="shrink-0 transition-transform duration-300 group-hover:translate-x-1">
          {icon}
        </span>
      )}
    </>
  );

  const combinedClasses = `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`.trim().replace(/\s+/g, ' ');

  if (to) {
    return (
      <Link to={to} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} disabled={disabled || isLoading} {...props}>
      {content}
    </button>
  );
};
