import React from 'react';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  href?: string;
  className?: string;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  href,
  className = '',
  ...props
}: ButtonProps) => {
  // Styles for different variants
  const variantStyles = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-400 hover:to-primary-500 focus:ring-primary-500 shadow-glow hover:shadow-glow-lg border border-primary-400/20',
    secondary: 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:from-secondary-400 hover:to-secondary-500 focus:ring-secondary-500 shadow-glow-secondary border border-secondary-400/20',
    accent: 'bg-gradient-to-r from-accent-400 to-accent-500 text-dark-500 hover:from-accent-300 hover:to-accent-400 focus:ring-accent-500 shadow-glow-accent font-semibold border border-accent-300/20',
    outline: 'bg-transparent border-2 border-primary-500 text-primary-400 hover:bg-primary-500/10 hover:border-primary-400 focus:ring-primary-500',
    ghost: 'bg-transparent text-primary-400 hover:bg-primary-500/10 hover:text-primary-300 focus:ring-primary-500',
  };

  // Styles for different sizes
  const sizeStyles = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-2.5 px-5 text-base',
    lg: 'py-3.5 px-7 text-lg',
  };

  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none btn-shine';

  const widthStyles = fullWidth ? 'w-full' : '';

  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`;

  // If href is provided, render as Link
  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {isLoading ? (
          <span className="mr-2">
            <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        ) : null}
        {children}
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <button className={buttonClasses} disabled={isLoading} {...props}>
      {isLoading ? (
        <span className="mr-2">
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      ) : null}
      {children}
    </button>
  );
};