'use client';

import React, { useState, useEffect } from 'react';
import { ScaleLoader } from 'react-spinners';

interface PageLoaderProps {
  children: React.ReactNode;
  duration?: number;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ children, duration = 3000 }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/95 backdrop-blur-sm">
        <div className="text-center">
          <ScaleLoader
            color="#8B5CF6"
            height={50}
            width={6}
            radius={4}
            margin={4}
          />
          <p className="mt-6 text-neutral-400 text-sm animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PageLoader;
