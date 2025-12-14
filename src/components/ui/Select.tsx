import React, { forwardRef } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  options?: Option[];
  children?: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, fullWidth = true, options, children, className = '', ...props }, ref) => {
    const selectId = `select-${Math.random().toString(36).substring(2, 9)}`;
    
    return (
      <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative group">
          <select
            id={selectId}
            ref={ref}
            className={`
              block rounded-xl
              pl-4 pr-10 py-3 border appearance-none
              bg-dark-100 text-white
              transition-all duration-200 cursor-pointer
              ${error 
                ? 'border-red-500/50 focus:ring-2 focus:ring-red-500/30 focus:border-red-500' 
                : 'border-dark-100 hover:border-gray-600 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500'} 
              ${fullWidth ? 'w-full' : ''} 
              focus:outline-none
              ${className}
            `}
            {...props}
          >
            {options ? options.map((option) => (
              <option key={option.value} value={option.value} className="bg-dark-100 text-white">
                {option.label}
              </option>
            )) : children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 group-hover:text-gray-300 transition-colors">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';