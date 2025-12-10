import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Page } from '@/components/layout/Page';
import { Button } from '@/components/ui/Button';

// Mock function to get featured blog posts
async function getFeaturedBlogs() {
  return [
    {
      id: '1',
      title: 'Getting Started with Next.js',
      excerpt: 'Learn the basics of Next.js and how to build your first app with the latest App Router features.',
      author: 'John Doe',
      createdAt: new Date().toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      type: 'FREE'
    },
    {
      id: '2',
      title: 'The Power of Server Components',
      excerpt: 'Explore how React Server Components are changing the way we build web applications.',
      author: 'Jane Smith',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2',
      type: 'PAID'
    },
    {
      id: '3',
      title: 'Styling Your Next.js Application',
      excerpt: 'Learn different approaches to styling your Next.js app, from CSS Modules to Tailwind CSS.',
      author: 'Alex Johnson',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613',
      type: 'FREE'
    }
  ];
}

export default async function Home() {
  const featuredBlogs = await getFeaturedBlogs();

  return (
    <Page fullWidth={true}>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight mb-4">
                Share Your Ideas with the World
              </h1>
              <p className="text-xl text-neutral-700 mb-8">
                A modern blogging platform built with Next.js, Prisma, and Tailwind CSS.
                Create, share, and discover thought-provoking content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/register" size="lg">
                  Get Started
                </Button>
                <Button href="/blogs" variant="outline" size="lg">
                  Explore Blogs
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <Image
                src="/hero-image.svg"
                alt="Blog illustration"
                width={600}
                height={400}
                className="w-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Featured Posts</h2>
            <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
              Discover the latest insights, tutorials, and stories from our community of writers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBlogs.map((blog) => (
              <Link href={`/blogs/${blog.id}`} key={blog.id} className="block group">
                <div className="bg-white rounded-lg shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={blog.imageUrl}
                      alt={blog.title}
                      width={500}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {blog.type === 'PAID' && (
                      <div className="absolute top-2 right-2 bg-secondary-500 text-white text-xs px-2 py-1 rounded">
                        PREMIUM
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2 group-hover:text-primary-600">
                      {blog.title}
                    </h3>
                    <p className="text-neutral-600 mb-4 flex-grow">{blog.excerpt}</p>
                    <div className="flex justify-between items-center text-sm text-neutral-500">
                      <span>{blog.author}</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button href="/blogs" variant="outline">
              View All Posts
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Why NextBlog?</h2>
            <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
              Our platform is designed to make blogging simple, beautiful, and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Lightning Fast</h3>
              <p className="text-neutral-600">
                Built with Next.js App Router and React Server Components for optimal performance and SEO.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Customizable</h3>
              <p className="text-neutral-600">
                Personalize your blog with custom themes, layouts, and formatting options.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Monetization</h3>
              <p className="text-neutral-600">
                Offer premium content with our built-in subscription system and payment processing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Blogging Journey Today</h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of writers who have already found their voice on NextBlog.
          </p>
          <Button href="/register" size="lg" className="bg-white text-primary-600 hover:bg-primary-50">
            Sign Up Now — It&apos;s Free
          </Button>
        </div>
      </section>
    </Page>
  );
}
