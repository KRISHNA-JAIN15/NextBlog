'use client';

import React, { useState, useEffect } from 'react';
import { Page } from '@/components/layout/Page';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface SubscriptionData {
  hasActiveSubscription: boolean;
  subscription: {
    startDate: string;
    endDate: string;
    daysRemaining: number;
  } | null;
  credits: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('published');
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);

  // Only redirect if auth is done loading and there's no user
  // The middleware handles protection, this is just a fallback
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Only fetch data once auth is loaded and user exists
  useEffect(() => {
    if (!isLoading && user) {
      fetchBlogs();
      fetchSubscriptionStatus();
    }
  }, [isLoading, user]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/user/blogs');
      if (response.ok) {
        const data = await response.json();
        setBlogs(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/subscription/status');
      if (response.ok) {
        const data = await response.json();
        setSubscriptionData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBlogs(blogs.filter(blog => blog.id !== id));
        alert('Post deleted successfully');
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred');
    }
  };

  const handleEditDraft = (id: number) => {
    router.push(`/dashboard/new-post?edit=${id}`);
  };

  const published = blogs.filter(b => b.published);
  const drafts = blogs.filter(b => !b.published);

  // Show loading while auth is being checked
  if (isLoading) {
    return (
      <Page>
        <Container className="py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-neutral-400">Loading...</p>
            </div>
          </div>
        </Container>
      </Page>
    );
  }
  
  return (
    <Page>
      <Container className="py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Your Blog Posts</h1>
            <p className="text-gray-400">Manage and create your content</p>
          </div>
          <Button href="/dashboard/new-post" className="group">
            <svg className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Post
          </Button>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-neutral-700">
          <button
            onClick={() => setActiveTab('published')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'published'
                ? 'text-primary-400'
                : 'text-neutral-400 hover:text-neutral-300'
            }`}
          >
            Published ({published.length})
            {activeTab === 'published' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'drafts'
                ? 'text-primary-400'
                : 'text-neutral-400 hover:text-neutral-300'
            }`}
          >
            Drafts ({drafts.length})
            {activeTab === 'drafts' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
            )}
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="glass rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{blogs.length}</p>
                <p className="text-sm text-gray-400">Total Posts</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{published.length}</p>
                <p className="text-sm text-gray-400">Published</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{drafts.length}</p>
                <p className="text-sm text-gray-400">Drafts</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{blogs.filter(b => b.type === 'PAID').length}</p>
                <p className="text-sm text-gray-400">Premium</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-xl p-4 border border-accent-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent-400">{subscriptionData?.credits || 0}</p>
                <p className="text-sm text-gray-400">Credits</p>
              </div>
            </div>
          </div>
          <Link href="/subscription" className="glass rounded-xl p-4 border border-secondary-500/30 hover:border-secondary-500/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary-500/20 flex items-center justify-center">
                {subscriptionData?.hasActiveSubscription ? (
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                )}
              </div>
              <div>
                {subscriptionData?.hasActiveSubscription ? (
                  <>
                    <p className="text-sm font-bold text-emerald-400">Active</p>
                    <p className="text-xs text-gray-400">{subscriptionData.subscription?.daysRemaining} days left</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-secondary-400">Subscribe</p>
                    <p className="text-xs text-gray-400">₹100/month</p>
                  </>
                )}
              </div>
            </div>
          </Link>
        </div>
        
        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : activeTab === 'published' ? (
          published.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {published.map((blog) => (
                <Card key={blog.id} hover className="group">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white group-hover:text-primary-400 transition-colors">{blog.title}</CardTitle>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        blog.type === 'FREE' 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-secondary-500/20 text-secondary-300 border border-secondary-500/30'
                      }`}>
                        {blog.type === 'FREE' ? '🆓 Free' : '👑 Premium'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 line-clamp-2">{blog.excerpt}</p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                  Created: {new Date(blog.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full gap-2">
                  <Link href={`/blogs/${blog.id}`} className="text-sm text-primary-400 hover:underline">View</Link>
                  <button
                    onClick={() => handleDeletePost(blog.id)}
                    className="text-sm text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
          ) : (
            <Card className="border-dashed border-2 border-gray-700">
              <CardContent className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-primary-500/20 mx-auto flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">No published posts yet</h3>
                <p className="mt-2 text-gray-400 max-w-sm mx-auto">
                  Get started by creating your first blog post!
                </p>
                <div className="mt-6">
                  <Button href="/dashboard/new-post">Create New Post</Button>
                </div>
              </CardContent>
          </Card>
        )
        ) : (
          // Drafts Tab
          <>
            {drafts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {drafts.map((draft) => (
                  <Card key={draft.id} className="border-yellow-500/30">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-white">{draft.title || 'Untitled Draft'}</CardTitle>
                        <span className="text-xs px-3 py-1 rounded-full font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                          📝 Draft
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 line-clamp-2">{draft.excerpt || 'No excerpt'}</p>
                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Created: {new Date(draft.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex justify-between w-full gap-2">
                        <button
                          onClick={() => handleEditDraft(draft.id)}
                          className="text-sm text-primary-400 hover:underline"
                        >
                          Continue Editing
                        </button>
                        <button
                          onClick={() => handleDeletePost(draft.id)}
                          className="text-sm text-red-400 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2 border-gray-700">
                <CardContent className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-yellow-500/20 mx-auto flex items-center justify-center mb-4">
                    <svg className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white">No drafts</h3>
                  <p className="mt-2 text-gray-400 max-w-sm mx-auto">
                    Save your work as drafts to continue editing later
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </Container>
    </Page>
  );
}