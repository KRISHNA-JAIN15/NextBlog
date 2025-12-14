import React from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral' | 'accent';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  glow = false,
}) => {
  // Styles for different variants - dark theme optimized
  const variantStyles = {
    primary: 'bg-primary-500/20 text-primary-300 border border-primary-500/30',
    secondary: 'bg-secondary-500/20 text-secondary-300 border border-secondary-500/30',
    success: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    error: 'bg-red-500/20 text-red-300 border border-red-500/30',
    neutral: 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
    accent: 'bg-accent-500/20 text-accent-300 border border-accent-500/30',
  };

  // Glow styles for variants
  const glowStyles = {
    primary: 'shadow-[0_0_10px_rgba(99,102,241,0.3)]',
    secondary: 'shadow-[0_0_10px_rgba(249,115,22,0.3)]',
    success: 'shadow-[0_0_10px_rgba(16,185,129,0.3)]',
    warning: 'shadow-[0_0_10px_rgba(245,158,11,0.3)]',
    error: 'shadow-[0_0_10px_rgba(239,68,68,0.3)]',
    neutral: 'shadow-[0_0_10px_rgba(156,163,175,0.3)]',
    accent: 'shadow-[0_0_10px_rgba(34,211,238,0.3)]',
  };

  // Styles for different sizes
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full backdrop-blur-sm transition-all duration-200 ${variantStyles[variant]} ${sizeStyles[size]} ${glow ? glowStyles[variant] : ''} ${className}`}
    >
      {children}
    </span>
  );
};