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

export default async function BlogsPage({ searchParams }: { searchParams: SearchParams }) {
  const search = searchParams.q || '';
  const blogs = await getBlogs(search);
  
  return (
    <Page>
      <Container>
        <div className="py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">Explore Blogs</h1>
            <p className="text-lg text-neutral-700 mb-6">
              Discover insights, tutorials, and stories from our community of writers.
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <Input
                type="search"
                placeholder="Search articles..."
                name="q"
                defaultValue={search}
                className="flex-grow"
              />
              <Button type="submit">
                Search
              </Button>
            </form>
          </div>
          
          {blogs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-neutral-700">No articles found matching your search.</p>
              <Button href="/blogs" variant="outline" className="mt-4">
                Clear Search
              </Button>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {blogs.map(blog => (
              <div key={blog.id} className="bg-white rounded-lg shadow-card overflow-hidden flex flex-col">
                <div className="relative h-48">
                  <Image
                    src={blog.imageUrl}
                    alt={blog.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                  {blog.type === 'PAID' && (
                    <div className="absolute top-2 right-2 bg-secondary-500 text-white text-xs px-2 py-1 rounded">
                      PREMIUM
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {blog.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                    <Link href={`/blogs/${blog.id}`} className="hover:text-primary-600">
                      {blog.title}
                    </Link>
                  </h2>
                  <p className="text-neutral-600 mb-4 flex-grow">{blog.excerpt}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <Image
                        src={blog.author.image}
                        alt={blog.author.name}
                        width={32}
                        height={32}
                        className="rounded-full mr-2"
                      />
                      <span className="text-sm text-neutral-700">{blog.author.name}</span>
                    </div>
                    <span className="text-xs text-neutral-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <Button href={`/blogs/${blog.id}`} fullWidth>
                    Read Article
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {blogs.length > 0 && (
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center">
                <Button variant="outline" className="mr-2" disabled>
                  &laquo; Previous
                </Button>
                <div className="flex items-center space-x-1">
                  <span className="px-3 py-1 bg-primary-600 text-white rounded">1</span>
                  <Button variant="ghost" className="px-3 py-1">2</Button>
                  <Button variant="ghost" className="px-3 py-1">3</Button>
                </div>
                <Button variant="outline" className="ml-2">
                  Next &raquo;
                </Button>
              </nav>
            </div>
          )}
        </div>
      </Container>
    </Page>
  );
}