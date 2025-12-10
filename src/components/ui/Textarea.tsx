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
          <label htmlFor={textareaId} className="block text-sm font-medium text-neutral-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            id={textareaId}
            ref={ref}
            className={`
              block rounded-md shadow-sm 
              px-4 py-2 border
              ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'} 
              ${fullWidth ? 'w-full' : ''} 
              min-h-[100px] resize-y
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';