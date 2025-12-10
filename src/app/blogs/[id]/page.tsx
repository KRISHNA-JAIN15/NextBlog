import React from 'react';
import { Page } from '@/components/layout/Page';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

interface Params {
  id: string;
}

export async function generateMetadata({ params }: { params: Params }) {
  const blog = await getBlogById(params.id);
  
  return {
    title: `${blog.title} | NextBlog`,
    description: blog.excerpt,
  };
}

// Function to get a blog by ID
async function getBlogById(id: string) {
  // This would be a server-side fetch in a real app
  // For now, we'll return placeholder data
  const blogs = [
    {
      id: '1',
      title: 'Getting Started with Next.js',
      excerpt: 'Learn the basics of Next.js and how to build your first app with the latest App Router features.',
      content: `
# Getting Started with Next.js

Next.js is a React framework that enables functionality such as server-side rendering and static site generation. It's a great choice for building modern web applications.

## Why Next.js?

Next.js provides several benefits out of the box:

- **Server-Side Rendering:** Improves performance and SEO
- **Static Site Generation:** Pre-render pages for faster loading
- **API Routes:** Create API endpoints easily
- **File-System Routing:** Simple and intuitive routing
- **Built-in CSS Support:** Import CSS files directly
- **Fast Refresh:** Instantly see your changes

## Setting Up Your First Project

To create a new Next.js app, run:

\`\`\`bash
npx create-next-app@latest my-next-app
\`\`\`

This command creates a new Next.js app with the default template.

## Project Structure

A typical Next.js project has the following structure:

\`\`\`
my-next-app/
  ├── app/
  │   ├── layout.tsx
  │   ├── page.tsx
  │   └── globals.css
  ├── public/
  │   └── assets
  ├── components/
  │   └── ui/
  ├── next.config.js
  └── package.json
\`\`\`

## Creating Pages

With the App Router, you create pages by adding a \`page.tsx\` file inside the app directory or its subdirectories:

\`\`\`jsx
// app/page.tsx
export default function Home() {
  return (
    <main>
      <h1>Welcome to Next.js!</h1>
      <p>This is my first Next.js application</p>
    </main>
  );
}
\`\`\`

## Conclusion

Next.js makes building React applications simple and efficient. It provides many features that improve development experience and application performance.

Start with a small project and explore the various features Next.js has to offer.
      `,
      author: {
        name: 'John Doe',
        bio: 'Frontend developer and Next.js enthusiast',
        image: 'https://i.pravatar.cc/150?u=john'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      type: 'FREE',
      tags: ['Next.js', 'React', 'Frontend'],
      readTime: '5 min read'
    },
    {
      id: '2',
      title: 'The Power of Server Components',
      excerpt: 'Explore how React Server Components are changing the way we build web applications.',
      content: `
# The Power of React Server Components

React Server Components are a new kind of component that can be rendered on the server and streamed to the client. They represent a fundamental shift in how we think about building React applications.

## What Are Server Components?

Server Components are React components that run only on the server. They:

- Can access server-side data sources directly
- Don't increase the bundle size
- Allow for better code-splitting
- Reduce client-side JavaScript

## Benefits of Server Components

### Reduced Bundle Size

Since Server Components don't run on the client, they don't contribute to the JavaScript bundle size. This leads to faster page loads and better performance.

### Direct Access to Backend Resources

Server Components can directly access databases, filesystems, and other server-only resources without additional API layers.

\`\`\`jsx
// This component runs only on the server
async function BlogPosts() {
  // Access the database directly
  const posts = await db.query('SELECT * FROM posts');
  
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
\`\`\`

### Automatic Code Splitting

Server Components help with automatic code splitting by default, which improves client performance by only sending the necessary JavaScript.

## Using Server Components in Next.js

Next.js has built-in support for React Server Components in its App Router:

\`\`\`jsx
// app/page.tsx
// This is a Server Component by default
export default async function Page() {
  const data = await fetchData();
  
  return (
    <main>
      <h1>Server Component Example</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
\`\`\`

## Client Components

When you need interactivity, you can opt into Client Components:

\`\`\`jsx
'use client'; // This directive marks this as a Client Component

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

## Conclusion

Server Components represent a significant advancement in React's capabilities. They allow developers to build applications that are more efficient, easier to maintain, and provide better user experiences.

As these patterns evolve, we'll see more sophisticated uses of Server Components in production applications.
      `,
      author: {
        name: 'Jane Smith',
        bio: 'Senior React Developer at TechCorp',
        image: 'https://i.pravatar.cc/150?u=jane'
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2',
      type: 'PAID',
      tags: ['React', 'Server Components'],
      readTime: '7 min read'
    },
  ];
  
  const blog = blogs.find(b => b.id === id);
  
  if (!blog) {
    throw new Error('Blog not found');
  }
  
  return blog;
}

export default async function BlogPage({ params }: { params: Params }) {
  const blog = await getBlogById(params.id);
  
  // Convert markdown content to HTML
  // In a real app, you would use a library like marked or remark
  const contentHtml = blog.content;
  
  return (
    <Page>
      <article>
        <div className="bg-primary-50 py-8">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="flex gap-2 mb-4">
                {blog.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                {blog.title}
              </h1>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Image
                    src={blog.author.image}
                    alt={blog.author.name}
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium text-neutral-900">{blog.author.name}</p>
                    <p className="text-sm text-neutral-600">{new Date(blog.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="text-sm text-neutral-600 flex items-center">
                  <span className="mr-4">{blog.readTime}</span>
                  {blog.type === 'PAID' && (
                    <span className="bg-secondary-500 text-white text-xs px-2 py-1 rounded">
                      PREMIUM
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </div>
        
        <Container className="py-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 relative h-80 sm:h-96 md:h-[500px]">
              <Image
                src={blog.imageUrl}
                alt={blog.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            
            <div className="prose prose-lg max-w-none">
              {/* In a real app, you would render the HTML safely */}
              <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
            </div>
            
            <div className="border-t border-neutral-200 mt-12 pt-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                About the Author
              </h2>
              <div className="flex items-start">
                <Image
                  src={blog.author.image}
                  alt={blog.author.name}
                  width={64}
                  height={64}
                  className="rounded-full mr-4"
                />
                <div>
                  <h3 className="font-medium text-lg text-neutral-900">{blog.author.name}</h3>
                  <p className="text-neutral-600">{blog.author.bio}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-12">
              <Button variant="outline" href="/blogs">
                &larr; Back to Blogs
              </Button>
              <div className="flex space-x-4">
                <button aria-label="Like this post" className="text-neutral-600 hover:text-neutral-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>
                <button aria-label="Share this post" className="text-neutral-600 hover:text-neutral-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                </button>
                <button aria-label="Bookmark this post" className="text-neutral-600 hover:text-neutral-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Container>
      </article>
    </Page>
  );
}