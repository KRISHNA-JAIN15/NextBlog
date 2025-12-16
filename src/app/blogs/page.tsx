import React from 'react';
import { Page } from '@/components/layout/Page';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import { SearchBar } from '@/components/blog/SearchBar';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'Blogs | NextBlog',
  description: 'Discover articles on NextBlog'
};

// Topic labels for display
const topicLabels: Record<string, string> = {
  TECHNOLOGY: 'Technology',
  HEALTH: 'Health',
  LIFESTYLE: 'Lifestyle',
  EDUCATION: 'Education',
  ENTERTAINMENT: 'Entertainment',
};

interface BlogPost {
  id: number;
  title: string;
  content: string | null;
  excerpt: string | null;
  coverImage: string | null;
  topic: string;
  published: boolean;
  type: 'FREE' | 'PAID';
  authorId: number;
  createdAt: string;
  author: {
    id: number;
    name: string | null;
    email: string;
  };
  commentCount: number;
}

interface BlogsResponse {
  success: boolean;
  data: BlogPost[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Function to get blogs - Direct database query
async function getBlogs(page: number = 1, limit: number = 9, topic?: string, type?: string, search?: string): Promise<BlogsResponse> {
  try {
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {
      published: true,
    };
    
    if (topic) {
      where.topic = topic;
    }
    
    if (type) {
      where.type = type;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // Get total count and blogs
    const [total, blogs] = await Promise.all([
      prisma.blogPost.count({ where }),
      prisma.blogPost.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              Comment: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
    ]);
    
    const formattedBlogs = blogs.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      topic: post.topic,
      published: post.published,
      type: post.type,
      authorId: post.authorId,
      createdAt: post.createdAt.toISOString(),
      author: {
        id: post.author.id,
        name: post.author.name,
        email: post.author.email,
      },
      commentCount: post._count.Comment,
    }));
    
    const pages = Math.ceil(total / limit);
    
    return {
      success: true,
      data: formattedBlogs,
      pagination: {
        total,
        page,
        limit,
        pages,
      },
    };
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return {
      success: false,
      data: [],
      pagination: { total: 0, page: 1, limit: 9, pages: 0 }
    };
  }
}

interface SearchParams {
  page?: string;
  topic?: string;
  type?: string;
  search?: string;
}

export default async function BlogsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || '1');
  const topic = resolvedParams.topic;
  const type = resolvedParams.type;
  const search = resolvedParams.search;
  
  const { data: blogs, pagination } = await getBlogs(currentPage, 9, topic, type, search);
  
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
            
            {/* Search Bar */}
            <div className="mb-8">
              <SearchBar defaultValue={search || ''} />
            </div>
            
            {/* Active Search */}
            {search && (
              <div className="mb-6 flex items-center gap-2">
                <span className="text-neutral-400">Searching for:</span>
                <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium">
                  &quot;{search}&quot;
                </span>
                <Link 
                  href={`/blogs${topic ? `?topic=${topic}` : ''}${type ? `${topic ? '&' : '?'}type=${type}` : ''}`}
                  className="text-sm text-neutral-500 hover:text-neutral-300 underline"
                >
                  Clear search
                </Link>
              </div>
            )}
            
            {/* Filters */}
            <div className="flex flex-col gap-6">
              {/* Topic Filter */}
              <div>
                <p className="text-sm text-neutral-500 mb-3 font-medium">Filter by Topic</p>
                <div className="flex flex-wrap gap-3">
                  <Link 
                    href={`/blogs${search ? `?search=${search}` : ''}${type ? `${search ? '&' : '?'}type=${type}` : ''}`}
                    className={`relative group px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      !topic 
                        ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]' 
                        : 'bg-dark-100 text-neutral-400 border border-primary-500/20 hover:border-primary-500/60 hover:text-neutral-200 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                    }`}
                  >
                    {!topic && <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 opacity-50 blur-md -z-10"></span>}
                    All Topics
                  </Link>
                  {Object.entries(topicLabels).map(([value, label]) => (
                    <Link
                      key={value}
                      href={`/blogs?topic=${value}${type ? `&type=${type}` : ''}${search ? `&search=${search}` : ''}`}
                      className={`relative group px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                        topic === value 
                          ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]' 
                          : 'bg-dark-100 text-neutral-400 border border-primary-500/20 hover:border-primary-500/60 hover:text-neutral-200 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                      }`}
                    >
                      {topic === value && <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 opacity-50 blur-md -z-10"></span>}
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Type Filter */}
              <div>
                <p className="text-sm text-neutral-500 mb-3 font-medium">Filter by Access</p>
                <div className="flex gap-3">
                  <Link 
                    href={`/blogs${topic ? `?topic=${topic}` : ''}${search ? `${topic ? '&' : '?'}search=${search}` : ''}`}
                    className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      !type 
                        ? 'bg-gradient-to-r from-accent-500 to-green-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]' 
                        : 'bg-dark-100 text-neutral-400 border border-accent-500/20 hover:border-accent-500/60 hover:text-neutral-200 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    }`}
                  >
                    {!type && <span className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-500 to-green-500 opacity-50 blur-md -z-10"></span>}
                    All
                  </Link>
                  <Link
                    href={`/blogs?${topic ? `topic=${topic}&` : ''}type=FREE${search ? `&search=${search}` : ''}`}
                    className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      type === 'FREE' 
                        ? 'bg-gradient-to-r from-accent-500 to-green-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]' 
                        : 'bg-dark-100 text-neutral-400 border border-accent-500/20 hover:border-accent-500/60 hover:text-neutral-200 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    }`}
                  >
                    {type === 'FREE' && <span className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-500 to-green-500 opacity-50 blur-md -z-10"></span>}
                    🆓 Free
                  </Link>
                  <Link
                    href={`/blogs?${topic ? `topic=${topic}&` : ''}type=PAID${search ? `&search=${search}` : ''}`}
                    className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      type === 'PAID' 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.5)]' 
                        : 'bg-dark-100 text-neutral-400 border border-yellow-500/20 hover:border-yellow-500/60 hover:text-neutral-200 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    }`}
                  >
                    {type === 'PAID' && <span className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 opacity-50 blur-md -z-10"></span>}
                    👑 Premium
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Empty State */}
          {blogs.length === 0 && (
            <div className="text-center py-20 rounded-2xl bg-dark-100 border border-dark-100">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary-500/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg text-neutral-400 mb-4">
                {search ? `No articles found for "${search}".` : 'No articles found.'}
              </p>
              <Button href="/blogs" variant="outline">
                {search ? 'Clear Search' : 'View All Blogs'}
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
                  {blog.coverImage ? (
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                      <svg className="w-16 h-16 text-primary-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-transparent to-transparent opacity-60"></div>
                  {blog.type === 'PAID' && (
                    <div className="absolute top-4 right-4 premium-badge text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      PREMIUM
                    </div>
                  )}
                  
                  {/* Topic overlay */}
                  <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                    <span className="text-xs bg-dark-100/80 backdrop-blur-sm text-neutral-300 px-3 py-1.5 rounded-full border border-primary-500/20">
                      {topicLabels[blog.topic] || blog.topic}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-neutral-100 mb-3 group-hover:text-primary-400 transition-colors">
                    <Link href={`/blogs/${blog.id}`}>
                      {blog.title}
                    </Link>
                  </h2>
                  <p className="text-neutral-400 mb-6 flex-grow line-clamp-2">{blog.excerpt || 'No excerpt available'}</p>
                  
                  {/* Author & Date */}
                  <div className="flex items-center justify-between pt-4 border-t border-dark-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-medium">
                        {blog.author.name?.charAt(0).toUpperCase() || blog.author.email.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-neutral-300">{blog.author.name || 'Anonymous'}</span>
                    </div>
                    <span className="text-sm text-neutral-500">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="px-6 pb-6 flex items-center justify-between">
                  <span className="text-sm text-neutral-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {blog.commentCount} comments
                  </span>
                  <Button href={`/blogs/${blog.id}`} variant="outline" size="sm">
                    Read →
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-16 flex justify-center">
              <nav className="flex items-center gap-2 p-2 rounded-xl bg-dark-100 border border-dark-100">
                {/* Previous Button */}
                {currentPage > 1 ? (
                  <Link 
                    href={`/blogs?page=${currentPage - 1}${topic ? `&topic=${topic}` : ''}${type ? `&type=${type}` : ''}${search ? `&search=${search}` : ''}`}
                    className="px-4 py-2 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-dark-200 transition-colors"
                  >
                    ← Previous
                  </Link>
                ) : (
                  <span className="px-4 py-2 rounded-lg text-neutral-600 cursor-not-allowed">
                    ← Previous
                  </span>
                )}
                
                <div className="flex items-center gap-1 px-2">
                  {/* Generate page numbers */}
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first page, last page, current page, and pages around current
                      if (page === 1 || page === pagination.pages) return true;
                      if (Math.abs(page - currentPage) <= 1) return true;
                      return false;
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there's a gap
                      const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;
                      return (
                        <React.Fragment key={page}>
                          {showEllipsisBefore && (
                            <span className="px-2 text-neutral-500">...</span>
                          )}
                          <Link
                            href={`/blogs?page=${page}${topic ? `&topic=${topic}` : ''}${type ? `&type=${type}` : ''}${search ? `&search=${search}` : ''}`}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
                              page === currentPage
                                ? 'bg-primary-500 text-white'
                                : 'text-neutral-400 hover:text-neutral-200 hover:bg-dark-200'
                            }`}
                          >
                            {page}
                          </Link>
                        </React.Fragment>
                      );
                    })}
                </div>
                
                {/* Next Button */}
                {currentPage < pagination.pages ? (
                  <Link 
                    href={`/blogs?page=${currentPage + 1}${topic ? `&topic=${topic}` : ''}${type ? `&type=${type}` : ''}${search ? `&search=${search}` : ''}`}
                    className="px-4 py-2 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-dark-200 transition-colors"
                  >
                    Next →
                  </Link>
                ) : (
                  <span className="px-4 py-2 rounded-lg text-neutral-600 cursor-not-allowed">
                    Next →
                  </span>
                )}
              </nav>
            </div>
          )}
          
          {/* Results info */}
          {blogs.length > 0 && (
            <div className="mt-6 text-center text-neutral-500 text-sm">
              Showing {blogs.length} of {pagination.total} articles (Page {currentPage} of {pagination.pages})
            </div>
          )}
        </div>
      </Container>
    </Page>
  );
}