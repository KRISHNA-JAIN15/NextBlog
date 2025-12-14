import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, glow = false }) => {
  const hoverClass = hover ? 'card-glow hover:scale-[1.02] hover:border-primary-500/50' : '';
  const glowClass = glow ? 'shadow-glow' : '';
  
  return (
    <div className={`bg-gradient-to-br from-dark-100 to-dark-200 rounded-2xl border border-dark-100/50 overflow-hidden backdrop-blur-sm transition-all duration-300 ${hoverClass} ${glowClass} ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-6 border-b border-primary-500/20 bg-gradient-to-r from-primary-500/5 to-transparent ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <h3 className={`text-xl font-bold text-neutral-100 ${className}`}>
      {children}
    </h3>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-6 border-t border-primary-500/10 bg-dark-200/50 ${className}`}>
      {children}
    </div>
  );
};