'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchBarProps {
  defaultValue?: string;
}

export function SearchBar({ defaultValue = '' }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchValue.trim()) {
      params.set('search', searchValue.trim());
      params.set('page', '1'); // Reset to first page on new search
    } else {
      params.delete('search');
    }
    
    startTransition(() => {
      router.push(`/blogs?${params.toString()}`);
    });
  };

  const handleClear = () => {
    setSearchValue('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.set('page', '1');
    
    startTransition(() => {
      router.push(`/blogs?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl">
      <div className="relative group">
        {/* Neon glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 rounded-xl opacity-30 group-hover:opacity-60 blur transition-all duration-500"></div>
        <div className="relative bg-dark-200 rounded-xl">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-primary-400">
            {isPending ? (
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
          <input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search articles, topics..."
            className="w-full pl-12 pr-24 py-4 bg-dark-100 border border-primary-500/30 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/40 focus:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300"
          />
        <div className="absolute inset-y-0 right-2 flex items-center gap-1">
          {searchValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-neutral-500 hover:text-neutral-300 transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-1.5 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white text-sm font-medium rounded-lg transition-all duration-300 disabled:opacity-50 shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_20px_rgba(99,102,241,0.6)]"
          >
            Search
          </button>
        </div>
        </div>
      </div>
    </form>
  );
}
