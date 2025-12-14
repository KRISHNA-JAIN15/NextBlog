import React from 'react';
import { Page } from '@/components/layout/Page';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CommentSection } from '@/components/blog/CommentSection';
import { ShareButton } from '@/components/blog/ShareButton';

interface Params {
  id: string;
}

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

interface BlogResponse {
  success: boolean;
  data: BlogPost;
}

// Function to get a blog by ID from API
async function getBlogById(id: string): Promise<BlogPost | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/blog/${id}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      return null;
    }
    
    const data: BlogResponse = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Failed to fetch blog:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const resolvedParams = await params;
  const blog = await getBlogById(resolvedParams.id);
  
  if (!blog) {
    return {
      title: 'Blog Not Found | NextBlog',
      description: 'The requested blog post could not be found.',
    };
  }
  
  return {
    title: `${blog.title} | NextBlog`,
    description: blog.excerpt || 'Read this article on NextBlog',
  };
}

// Helper function to estimate read time
function calculateReadTime(content: string | null): string {
  if (!content) return '1 min read';
  // Strip HTML tags for word count
  const textContent = content.replace(/<[^>]*>/g, '');
  const wordsPerMinute = 200;
  const words = textContent.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// Helper function to render HTML content safely
function renderContent(content: string | null): React.ReactNode {
  if (!content) {
    return <p className="text-neutral-500 italic">No content available for this article.</p>;
  }
  
  // Check if content contains HTML tags
  const hasHtmlTags = /<[^>]+>/.test(content);
  
  if (hasHtmlTags) {
    return (
      <div 
        className="prose prose-invert prose-lg max-w-none
          prose-headings:text-neutral-100 prose-headings:font-bold
          prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4
          prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3
          prose-h3:text-xl prose-h3:mt-4 prose-h3:mb-2
          prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:mb-4
          prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-neutral-200
          prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
          prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
          prose-li:text-neutral-300 prose-li:mb-2
          prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-neutral-400
          prose-code:bg-dark-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-primary-400
          prose-pre:bg-dark-100 prose-pre:p-4 prose-pre:rounded-xl prose-pre:overflow-x-auto
          prose-img:rounded-xl prose-img:my-6"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  
  // Plain text content
  return (
    <div className="prose prose-invert prose-lg max-w-none">
      <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
}

export default async function BlogPage({ params }: { params: Promise<Params> }) {
  const resolvedParams = await params;
  const blog = await getBlogById(resolvedParams.id);
  
  if (!blog) {
    notFound();
  }
  
  const readTime = calculateReadTime(blog.content);
  const authorInitial = blog.author.name?.charAt(0).toUpperCase() || blog.author.email.charAt(0).toUpperCase();
  
  return (
    <Page>
      <article>
        {/* Header Section */}
        <div className="relative py-16 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-mesh-gradient opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background"></div>
          
          <Container className="relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Topic Badge */}
              <div className="flex gap-2 mb-6 flex-wrap">
                <span className="text-sm bg-primary-500/10 text-primary-400 px-4 py-1.5 rounded-full border border-primary-500/20">
                  {topicLabels[blog.topic] || blog.topic}
                </span>
              </div>
              
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-100 mb-6 leading-tight">
                {blog.title}
              </h1>
              
              {/* Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg">
                    {authorInitial}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-200">{blog.author.name || 'Anonymous'}</p>
                    <p className="text-sm text-neutral-500">{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm text-neutral-400 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {readTime}
                  </span>
                  <span className="text-sm text-neutral-400 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {blog.commentCount} comments
                  </span>
                  {blog.type === 'PAID' && (
                    <span className="premium-badge text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      PREMIUM
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </div>
        
        {/* Featured Image */}
        {blog.coverImage && (
          <Container className="relative -mt-8 z-20">
            <div className="max-w-4xl mx-auto">
              <div className="relative h-80 sm:h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-card border border-dark-100">
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-100/50 via-transparent to-transparent"></div>
              </div>
            </div>
          </Container>
        )}
        
        {/* Content */}
        <Container className="py-12">
          <div className="max-w-4xl mx-auto">
            {/* Article Content */}
            <div className="blog-content text-neutral-300">
              {renderContent(blog.content)}
            </div>
            
            {/* Author Card */}
            <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-dark-100 to-dark-200 border border-primary-500/20">
              <h2 className="text-lg font-bold text-neutral-300 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                About the Author
              </h2>
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                  {authorInitial}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-neutral-100 mb-2">{blog.author.name || 'Anonymous'}</h3>
                  <p className="text-neutral-400 leading-relaxed">{blog.author.email}</p>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-12 pt-8 border-t border-dark-100">
              <Button variant="outline" href="/blogs">
                ← Back to Blogs
              </Button>
              
              <ShareButton title={blog.title} />
            </div>
            
            {/* Comments Section */}
            <CommentSection blogId={blog.id} initialCommentCount={blog.commentCount} />
          </div>
        </Container>
      </article>
    </Page>
  );
}