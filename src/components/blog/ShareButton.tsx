'use client';

import React, { useState } from 'react';

interface ShareButtonProps {
  title: string;
  url?: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    
    // Try native share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // User cancelled or error, fall back to clipboard
      }
    }
    
    // Fall back to copying to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setShowTooltip(true);
      setTimeout(() => {
        setCopied(false);
        setShowTooltip(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={handleShare}
        aria-label="Share this post" 
        className="p-3 rounded-xl bg-dark-100 text-neutral-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all duration-300 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
        </svg>
      </button>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-dark-100 border border-dark-100 rounded-lg text-sm text-neutral-200 whitespace-nowrap animate-fade-in">
          {copied ? 'Link copied!' : 'Share'}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-dark-100"></div>
        </div>
      )}
    </div>
  );
}
