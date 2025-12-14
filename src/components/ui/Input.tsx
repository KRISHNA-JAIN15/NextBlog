import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, leftIcon, rightIcon, className = '', ...props }, ref) => {
    const inputId = `input-${Math.random().toString(36).substring(2, 9)}`;
    
    return (
      <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-neutral-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative group">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-primary-400 transition-colors">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`
              block rounded-xl shadow-sm 
              ${leftIcon ? 'pl-12' : 'pl-4'} 
              ${rightIcon ? 'pr-12' : 'pr-4'} 
              py-3 
              bg-dark-100 
              border-2
              text-neutral-100
              placeholder-neutral-500
              ${error 
                ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500' 
                : 'border-dark-100 focus:ring-primary-500/50 focus:border-primary-500 hover:border-primary-500/30'
              } 
              ${fullWidth ? 'w-full' : ''} 
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-offset-0
              focus:bg-dark-200
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-primary-400 transition-colors">
              {rightIcon}
            </div>
          )}
          {/* Subtle glow effect on focus */}
          <div className="absolute inset-0 rounded-xl bg-primary-500/0 group-focus-within:bg-primary-500/5 pointer-events-none transition-all duration-300" />
        </div>
        {error && <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>}
      </div>
    );
  }
);

Input.displayName = 'Input';