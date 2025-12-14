'use client';

import React, { useState, useEffect } from 'react';
import { Page } from '@/components/layout/Page';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export default function SubscriptionPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    hasActiveSubscription: boolean;
    subscription: {
      startDate: string;
      endDate: string;
      daysRemaining: number;
    } | null;
    credits: number;
  } | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/subscription');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchSubscriptionStatus();
    }
  }, [user]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const res = await fetch('/api/subscription/status');
      if (res.ok) {
        const data = await res.json();
        setSubscriptionStatus(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch subscription status:', err);
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create order
      const orderRes = await fetch('/api/subscription/create', {
        method: 'POST',
      });

      if (!orderRes.ok) {
        const data = await orderRes.json();
        throw new Error(data.message || 'Failed to create order');
      }

      const orderData = await orderRes.json();

      // Open Razorpay checkout
      const options = {
        key: orderData.data.keyId,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'NextBlog',
        description: 'Premium Subscription - 1 Month',
        order_id: orderData.data.orderId,
        handler: async function (response: RazorpayResponse) {
          // Verify payment
          try {
            const verifyRes = await fetch('/api/subscription/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verifyRes.ok) {
              setSuccess('Subscription activated successfully! You now have access to premium content.');
              fetchSubscriptionStatus();
            } else {
              const data = await verifyRes.json();
              throw new Error(data.message || 'Payment verification failed');
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Payment verification failed');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#8B5CF6',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Page>
        <Container className="py-12">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        </Container>
      </Page>
    );
  }

  return (
    <Page>
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-500/10 border border-secondary-500/20 text-secondary-400 text-sm font-medium mb-4">
              Premium Membership
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-100 mb-4">
              Unlock Premium Content
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Get access to exclusive premium articles from our top writers with a monthly subscription.
            </p>
          </div>

          {/* Success/Error Messages */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              {success}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Subscription Status Card */}
            <Card className="border-primary-500/30">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Your Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                {subscriptionStatus?.hasActiveSubscription ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                      <span className="font-semibold">Active Subscription</span>
                    </div>
                    <div className="space-y-2 text-neutral-400">
                      <p>
                        <span className="text-neutral-500">Started:</span>{' '}
                        {new Date(subscriptionStatus.subscription!.startDate).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="text-neutral-500">Expires:</span>{' '}
                        {new Date(subscriptionStatus.subscription!.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-lg font-semibold text-white mt-4">
                        {subscriptionStatus.subscription!.daysRemaining} days remaining
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <div className="w-3 h-3 rounded-full bg-neutral-500"></div>
                      <span>No active subscription</span>
                    </div>
                    <p className="text-neutral-500 text-sm">
                      Subscribe now to access all premium content!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Credits Card */}
            <Card className="border-accent-500/30">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <svg className="w-6 h-6 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Your Credits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-5xl font-bold text-accent-400 mb-2">
                    {subscriptionStatus?.credits || 0}
                  </p>
                  <p className="text-neutral-400">Total Credits Earned</p>
                  <p className="text-sm text-neutral-500 mt-4">
                    Earn 1 credit for each unique view on your blogs!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Card */}
          <Card className="mt-8 border-secondary-500/30 bg-gradient-to-br from-dark-100 to-dark-200">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Premium Monthly</h3>
                  <ul className="space-y-2 text-neutral-400">
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Access all premium articles
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Exclusive content from top writers
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Ad-free reading experience
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Cancel anytime
                    </li>
                  </ul>
                </div>
                <div className="text-center">
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-white">₹100</span>
                    <span className="text-neutral-400">/month</span>
                  </div>
                  <Button
                    onClick={handleSubscribe}
                    disabled={loading || subscriptionStatus?.hasActiveSubscription}
                    variant="accent"
                    size="lg"
                    className="w-full md:w-auto"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </span>
                    ) : subscriptionStatus?.hasActiveSubscription ? (
                      'Already Subscribed'
                    ) : (
                      'Subscribe Now'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Page>
  );
}
