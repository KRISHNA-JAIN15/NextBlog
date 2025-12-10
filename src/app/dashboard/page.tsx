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
      <Container className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">Your Blog Posts</h1>
          <Button href="/dashboard/new-post">
            Create New Post
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <Card key={blog.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{blog.title}</CardTitle>
                  <div className={`text-xs px-2 py-1 rounded ${
                    blog.type === 'FREE' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {blog.type}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 line-clamp-2">{blog.excerpt}</p>
                <p className="text-xs text-neutral-500 mt-2">
                  Created: {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    href={`/blogs/${blog.id}`}
                  >
                    View
                  </Button>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      href={`/dashboard/edit/${blog.id}`}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {blogs.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-neutral-400"
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
              <h3 className="mt-2 text-sm font-medium text-neutral-900">No posts yet</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Get started by creating your first blog post.
              </p>
              <div className="mt-6">
                <Button href="/dashboard/new-post">
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