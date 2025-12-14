import React from 'react';
import { Page } from '@/components/layout/Page';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard | NextBlog',
  description: 'Manage your blog posts'
};

// Function to get user blogs - this would typically check auth status server-side
async function getUserBlogs() {
  // This would be a server-side fetch in a real app
  // For now, we'll return placeholder data
  return [
    {
      id: '1',
      title: 'Getting Started with Next.js',
      excerpt: 'Learn the basics of Next.js and how to build your first app.',
      createdAt: new Date().toISOString(),
      type: 'FREE'
    },
    {
      id: '2',
      title: 'Advanced React Patterns',
      excerpt: 'Dive deep into advanced React patterns and techniques.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'PAID'
    }
  ];
}

export default async function DashboardPage() {
  // In a real app, we would check auth status server-side
  // For demonstration, we'll assume the user is logged in
  
  const blogs = await getUserBlogs();
  
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
        
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{blogs.filter(b => b.type === 'FREE').length}</p>
                <p className="text-sm text-gray-400">Free Posts</p>
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
                <p className="text-sm text-gray-400">Premium Posts</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
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
                <div className="flex justify-between w-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    href={`/blogs/${blog.id}`}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      href={`/dashboard/edit/${blog.id}`}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {blogs.length === 0 && (
          <Card className="border-dashed border-2 border-gray-700">
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-primary-500/20 mx-auto flex items-center justify-center mb-4">
                <svg
                  className="h-8 w-8 text-primary-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white">No posts yet</h3>
              <p className="mt-2 text-gray-400 max-w-sm mx-auto">
                Get started by creating your first blog post. Share your ideas with the world!
              </p>
              <div className="mt-6">
                <Button href="/dashboard/new-post">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Post
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </Container>
    </Page>
  );
}