import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, fullWidth = true, className = '', ...props }, ref) => {
    const textareaId = `textarea-${Math.random().toString(36).substring(2, 9)}`;
    
    return (
      <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            id={textareaId}
            ref={ref}
            className={`
              block rounded-xl
              px-4 py-3 border
              bg-dark-100 text-white placeholder-gray-500
              transition-all duration-200
              ${error 
                ? 'border-red-500/50 focus:ring-2 focus:ring-red-500/30 focus:border-red-500' 
                : 'border-dark-100 hover:border-gray-600 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500'} 
              ${fullWidth ? 'w-full' : ''} 
              min-h-[120px] resize-y
              focus:outline-none
              ${className}
            `}
            {...props}
          />
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

Textarea.displayName = 'Textarea';