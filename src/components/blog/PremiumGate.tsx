'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface PremiumGateProps {
  blogId: number;
  isPremium: boolean;
  children: React.ReactNode;
}

export function PremiumGate({ blogId, isPremium, children }: PremiumGateProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);
  const [checking, setChecking] = useState(true);
  const [viewTracked, setViewTracked] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      // If not premium, everyone has access
      if (!isPremium) {
        setHasAccess(true);
        setChecking(false);
        return;
      }

      // If not logged in, no access to premium
      if (!isLoading && !user) {
        setHasAccess(false);
        setChecking(false);
        return;
      }

      // Wait for auth to load
      if (isLoading) {
        return;
      }

      // Check subscription status
      try {
        const res = await fetch('/api/subscription/status');
        if (res.ok) {
          const data = await res.json();
          setHasAccess(data.data.hasActiveSubscription);
        } else {
          setHasAccess(false);
        }
      } catch {
        setHasAccess(false);
      } finally {
        setChecking(false);
      }
    };

    checkAccess();
  }, [isPremium, user, isLoading]);

  // Track view when user has access
  useEffect(() => {
    const trackView = async () => {
      if (hasAccess && user && !viewTracked) {
        try {
          await fetch(`/api/blog/${blogId}/view`, {
            method: 'POST',
          });
          setViewTracked(true);
        } catch (error) {
          console.error('Failed to track view:', error);
        }
      }
    };

    trackView();
  }, [hasAccess, user, blogId, viewTracked]);

  if (checking || isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!hasAccess && isPremium) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-dark-100 to-dark-200 border border-secondary-500/30">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Premium Content</h2>
          <p className="text-neutral-400 mb-6">
            This article is exclusive to premium subscribers. Subscribe now to unlock this and all other premium content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <button
                  onClick={() => router.push('/login?redirect=/blogs/' + blogId)}
                  className="px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push('/subscription')}
                  className="px-6 py-3 rounded-xl bg-secondary-500 text-white font-semibold hover:bg-secondary-600 transition-colors"
                >
                  Subscribe for ₹100/month
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push('/subscription')}
                className="px-6 py-3 rounded-xl bg-secondary-500 text-white font-semibold hover:bg-secondary-600 transition-colors"
              >
                Subscribe for ₹100/month
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
