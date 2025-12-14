import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Page } from '@/components/layout/Page';
import { Button } from '@/components/ui/Button';
import { LottieAnimation } from '@/components/ui/LottieAnimation';
import animationData from '@/../public/lottie.json';

interface FeaturedBlog {
  id: number;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  topic: string;
  type: 'FREE' | 'PAID';
  author: string;
  createdAt: string;
  viewCount: number;
}

// Function to get featured blog posts (most viewed)
async function getFeaturedBlogs(): Promise<FeaturedBlog[]> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/blog/featured?limit=3`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      return [];
    }
    
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Failed to fetch featured blogs:', error);
    return [];
  }
}

// Fallback default image for blogs without cover
const defaultCoverImage = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97';

export default async function Home() {
  const featuredBlogs = await getFeaturedBlogs();

  return (
    <Page fullWidth={true}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-mesh-gradient mt-[-80px]">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl animate-float animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 text-center md:text-left">
              {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse"></span>
                <span className="text-sm font-medium text-primary-300">Built with Next.js 15</span>
              </div> */}
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                <span className="text-neutral-100">Share Your Ideas</span>
                <br />
                <span className="gradient-text">with the World</span>
              </h1>
              
              <p className="text-xl text-neutral-400 mb-8 max-w-lg">
                A modern blogging platform built with Next.js, Prisma, and Tailwind CSS.
                Create, share, and discover thought-provoking content.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button href="/register" size="lg">
                  Get Started Free
                </Button>
                <Button href="/blogs" variant="outline" size="lg">
                  Explore Blogs
                </Button>
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-8 mt-12 justify-center md:justify-start">
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-100">10K+</div>
                  <div className="text-sm text-neutral-500">Articles</div>
                </div>
                <div className="w-px h-10 bg-neutral-700"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-100">5K+</div>
                  <div className="text-sm text-neutral-500">Writers</div>
                </div>
                <div className="w-px h-10 bg-neutral-700"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-100">50K+</div>
                  <div className="text-sm text-neutral-500">Readers</div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 relative">
              <div className="relative z-10">
                <LottieAnimation
                  animationData={animationData}
                  width={600}
                  height={400}
                  className="w-full drop-shadow-2xl"
                />
              </div>
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/30 via-accent-500/20 to-secondary-500/30 blur-3xl -z-10 scale-110"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-100/50 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm font-medium mb-4">
              Featured Content
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-100 mb-4">Featured Posts</h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Discover the latest insights, tutorials, and stories from our community of writers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBlogs.length > 0 ? (
              featuredBlogs.map((blog, index) => (
                <Link href={`/blogs/${blog.id}`} key={blog.id} className="block group">
                  <div 
                    className={`bg-gradient-to-br from-dark-100 to-dark-200 rounded-2xl border border-dark-100 overflow-hidden transition-all duration-500 hover:border-primary-500/50 card-glow h-full flex flex-col ${
                      index === 1 ? 'animation-delay-500' : index === 2 ? 'animation-delay-1000' : ''
                    }`}
                  >
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        src={blog.coverImage || defaultCoverImage}
                        alt={blog.title}
                        width={500}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-transparent to-transparent opacity-60"></div>
                      {blog.type === 'PAID' && (
                        <div className="absolute top-3 right-3 premium-badge text-white text-xs font-bold px-3 py-1.5 rounded-full">
                          PREMIUM
                        </div>
                      )}
                      {/* View count badge */}
                      <div className="absolute top-3 left-3 bg-dark-100/80 backdrop-blur-sm text-neutral-300 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {blog.viewCount} views
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-neutral-100 mb-3 group-hover:text-primary-400 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-neutral-400 mb-4 flex-grow line-clamp-2">{blog.excerpt || 'No excerpt available'}</p>
                      <div className="flex justify-between items-center text-sm pt-4 border-t border-dark-100">
                        <span className="text-neutral-500">{blog.author}</span>
                        <span className="text-neutral-600">{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Fallback when no featured blogs
              <div className="col-span-3 text-center py-12">
                <p className="text-neutral-400 mb-4">No featured blogs yet. Be the first to write!</p>
                <Button href="/dashboard/new-post" variant="outline">
                  Create a Blog Post
                </Button>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Button href="/blogs" variant="outline" size="lg">
              View All Posts
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-500/10 border border-secondary-500/20 text-secondary-400 text-sm font-medium mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-100 mb-4">Why NextBlog?</h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Our platform is designed to make blogging simple, beautiful, and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-dark-100 to-dark-200 border border-dark-100 hover:border-primary-500/30 transition-all duration-300 card-glow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white mb-6 group-hover:shadow-glow transition-shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-100 mb-3">Lightning Fast</h3>
              <p className="text-neutral-400">
                Built with Next.js App Router and React Server Components for optimal performance and SEO.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-dark-100 to-dark-200 border border-dark-100 hover:border-accent-500/30 transition-all duration-300 card-glow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center text-dark-500 mb-6 group-hover:shadow-glow-accent transition-shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-100 mb-3">Customizable</h3>
              <p className="text-neutral-400">
                Personalize your blog with custom themes, layouts, and formatting options.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-dark-100 to-dark-200 border border-dark-100 hover:border-secondary-500/30 transition-all duration-300 card-glow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center text-white mb-6 group-hover:shadow-glow-secondary transition-shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-100 mb-3">Monetization</h3>
              <p className="text-neutral-400">
                Offer premium content with our built-in subscription system and payment processing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-accent-500/10 to-secondary-500/20"></div>
        <div className="absolute inset-0 bg-mesh-gradient opacity-50"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-dark-100/80 to-dark-200/80 backdrop-blur-xl border border-primary-500/20">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-100 mb-4">
              Start Your Blogging Journey Today
            </h2>
            <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
              Join thousands of writers who have already found their voice on NextBlog.
            </p>
            <Button href="/register" size="lg" variant="accent">
              Sign Up Now — It&apos;s Free
            </Button>
          </div>
        </div>
      </section>
    </Page>
  );
}
