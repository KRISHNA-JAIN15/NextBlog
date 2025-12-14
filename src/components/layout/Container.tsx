import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  className = '',
  size = 'lg'
}) => {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };
  
  return (
    <div className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${maxWidthClasses[size]} ${className}`}>
      {children}
    </div>
  );
};