import React from 'react';
import { Page } from '@/components/layout/Page';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Blogs | NextBlog',
  description: 'Discover articles on NextBlog'
};

// Function to get blogs with optional filtering
async function getBlogs(search = '') {
  // This would be a server-side fetch in a real app
  // For now, we'll return placeholder data
  const blogs = [
    {
      id: '1',
      title: 'Getting Started with Next.js',
      excerpt: 'Learn the basics of Next.js and how to build your first app with the latest App Router features.',
      author: {
        name: 'John Doe',
        image: 'https://i.pravatar.cc/150?u=john'
      },
      createdAt: new Date().toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      type: 'FREE',
      tags: ['Next.js', 'React', 'Frontend']
    },
    {
      id: '2',
      title: 'The Power of Server Components',
      excerpt: 'Explore how React Server Components are changing the way we build web applications.',
      author: {
        name: 'Jane Smith',
        image: 'https://i.pravatar.cc/150?u=jane'
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2',
      type: 'PAID',
      tags: ['React', 'Server Components']
    },
    {
      id: '3',
      title: 'Styling Your Next.js Application',
      excerpt: 'Learn different approaches to styling your Next.js app, from CSS Modules to Tailwind CSS.',
      author: {
        name: 'Alex Johnson',
        image: 'https://i.pravatar.cc/150?u=alex'
      },
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613',
      type: 'FREE',
      tags: ['CSS', 'Tailwind', 'Styling']
    },
    {
      id: '4',
      title: 'Building a Blog with Prisma and Next.js',
      excerpt: 'A comprehensive guide to creating a full-featured blog using Prisma ORM and Next.js.',
      author: {
        name: 'Emily Chen',
        image: 'https://i.pravatar.cc/150?u=emily'
      },
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
      type: 'PAID',
      tags: ['Prisma', 'Next.js', 'Full-stack']
    },
    {
      id: '5',
      title: 'Authentication in Modern Web Apps',
      excerpt: 'Implementing secure authentication in your Next.js applications with JWT and Cookies.',
      author: {
        name: 'Michael Brown',
        image: 'https://i.pravatar.cc/150?u=michael'
      },
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe',
      type: 'FREE',
      tags: ['Authentication', 'Security', 'JWT']
    }
  ];

  if (search) {
    const searchLower = search.toLowerCase();
    return blogs.filter(
      blog => 
        blog.title.toLowerCase().includes(searchLower) || 
        blog.excerpt.toLowerCase().includes(searchLower) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  return blogs;
}

interface SearchParams {
  q?: string;
}

export default async function BlogsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.q || '';
  const blogs = await getBlogs(search);
  
  return (
    <Page>
      <Container>
        <div className="py-12">
          {/* Header */}
          <div className="mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-4">
              Explore Content
            </span>
            <h1 className="text-4xl font-bold text-neutral-100 mb-4">Explore Blogs</h1>
            <p className="text-lg text-neutral-400 mb-8 max-w-2xl">
              Discover insights, tutorials, and stories from our community of writers.
            </p>
            
            {/* Search Form */}
            <form className="flex flex-col sm:flex-row gap-4 max-w-2xl">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <Input
                  type="search"
                  placeholder="Search articles, topics, authors..."
                  name="q"
                  defaultValue={search}
                  className="pl-12"
                />
              </div>
              <Button type="submit" size="lg">
                Search
              </Button>
            </form>
          </div>
          
          {/* Empty State */}
          {blogs.length === 0 && (
            <div className="text-center py-20 rounded-2xl bg-dark-100 border border-dark-100">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary-500/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg text-neutral-400 mb-4">No articles found matching your search.</p>
              <Button href="/blogs" variant="outline">
                Clear Search
              </Button>
            </div>
          )}
          
          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, index) => (
              <div 
                key={blog.id} 
                className={`group bg-gradient-to-br from-dark-100 to-dark-200 rounded-2xl border border-dark-100 overflow-hidden flex flex-col transition-all duration-500 hover:border-primary-500/30 card-glow animate-fade-in ${
                  index % 2 === 1 ? 'animation-delay-500' : ''
                }`}
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={blog.imageUrl}
                    alt={blog.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-transparent to-transparent opacity-60"></div>
                  {blog.type === 'PAID' && (
                    <div className="absolute top-4 right-4 premium-badge text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      PREMIUM
                    </div>
                  )}
                  
                  {/* Tags overlay */}
                  <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                    {blog.tags.slice(0, 3).map(tag => (
                      <span 
                        key={tag} 
                        className="text-xs bg-dark-100/80 backdrop-blur-sm text-neutral-300 px-3 py-1.5 rounded-full border border-primary-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-neutral-100 mb-3 group-hover:text-primary-400 transition-colors">
                    <Link href={`/blogs/${blog.id}`}>
                      {blog.title}
                    </Link>
                  </h2>
                  <p className="text-neutral-400 mb-6 flex-grow line-clamp-2">{blog.excerpt}</p>
                  
                  {/* Author & Date */}
                  <div className="flex items-center justify-between pt-4 border-t border-dark-100">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Image
                          src={blog.author.image}
                          alt={blog.author.name}
                          width={40}
                          height={40}
                          className="rounded-full border-2 border-primary-500/30"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent-400 rounded-full border-2 border-dark-100"></div>
                      </div>
                      <span className="text-sm font-medium text-neutral-300">{blog.author.name}</span>
                    </div>
                    <span className="text-sm text-neutral-500">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="px-6 pb-6">
                  <Button href={`/blogs/${blog.id}`} fullWidth variant="outline">
                    Read Article →
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {blogs.length > 0 && (
            <div className="mt-16 flex justify-center">
              <nav className="flex items-center gap-2 p-2 rounded-xl bg-dark-100 border border-dark-100">
                <Button variant="ghost" className="px-4" disabled>
                  ← Previous
                </Button>
                <div className="flex items-center gap-1 px-2">
                  <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-500 text-white font-medium">1</span>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-dark-200 transition-colors">2</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-dark-200 transition-colors">3</button>
                  <span className="px-2 text-neutral-500">...</span>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-dark-200 transition-colors">10</button>
                </div>
                <Button variant="ghost" className="px-4">
                  Next →
                </Button>
              </nav>
            </div>
          )}
        </div>
      </Container>
    </Page>
  );
}