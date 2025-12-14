import React from 'react';
import { Page } from '@/components/layout/Page';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

interface Params {
  id: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const resolvedParams = await params;
  const blog = await getBlogById(resolvedParams.id);
  
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

export default async function BlogPage({ params }: { params: Promise<Params> }) {
  const resolvedParams = await params;
  const blog = await getBlogById(resolvedParams.id);
  
  // Convert markdown content to HTML
  // In a real app, you would use a library like marked or remark
  const contentHtml = blog.content;
  
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
              {/* Tags */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {blog.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="text-sm bg-primary-500/10 text-primary-400 px-4 py-1.5 rounded-full border border-primary-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-100 mb-6 leading-tight">
                {blog.title}
              </h1>
              
              {/* Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Image
                      src={blog.author.image}
                      alt={blog.author.name}
                      width={48}
                      height={48}
                      className="rounded-full border-2 border-primary-500/30"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-accent-400 rounded-full border-2 border-dark-100"></div>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-200">{blog.author.name}</p>
                    <p className="text-sm text-neutral-500">{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm text-neutral-400 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {blog.readTime}
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
        <Container className="relative -mt-8 z-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative h-80 sm:h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-card border border-dark-100">
              <Image
                src={blog.imageUrl}
                alt={blog.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-100/50 via-transparent to-transparent"></div>
            </div>
          </div>
        </Container>
        
        {/* Content */}
        <Container className="py-12">
          <div className="max-w-4xl mx-auto">
            {/* Article Content */}
            <div className="prose prose-lg prose-invert max-w-none 
              prose-headings:text-neutral-100 prose-headings:font-bold
              prose-p:text-neutral-300 prose-p:leading-relaxed
              prose-a:text-primary-400 prose-a:no-underline hover:prose-a:text-primary-300
              prose-strong:text-neutral-200
              prose-code:text-accent-400 prose-code:bg-dark-100 prose-code:px-2 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-dark-100 prose-pre:border prose-pre:border-dark-100 prose-pre:rounded-xl
              prose-blockquote:border-l-primary-500 prose-blockquote:bg-dark-100/50 prose-blockquote:rounded-r-xl prose-blockquote:py-1
              prose-li:text-neutral-300
              prose-hr:border-dark-100
            ">
              <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
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
                <div className="relative flex-shrink-0">
                  <Image
                    src={blog.author.image}
                    alt={blog.author.name}
                    width={80}
                    height={80}
                    className="rounded-2xl border-2 border-primary-500/30"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-neutral-100 mb-2">{blog.author.name}</h3>
                  <p className="text-neutral-400 leading-relaxed">{blog.author.bio}</p>
                  <div className="mt-4 flex gap-3">
                    <button title="Follow on Twitter" className="p-2 rounded-lg bg-dark-100 text-neutral-400 hover:text-primary-400 hover:bg-primary-500/10 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                    </button>
                    <button title="Connect on LinkedIn" className="p-2 rounded-lg bg-dark-100 text-neutral-400 hover:text-primary-400 hover:bg-primary-500/10 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-12 pt-8 border-t border-dark-100">
              <Button variant="outline" href="/blogs">
                ← Back to Blogs
              </Button>
              
              <div className="flex items-center gap-2">
                <button aria-label="Like this post" className="p-3 rounded-xl bg-dark-100 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>
                <button aria-label="Share this post" className="p-3 rounded-xl bg-dark-100 text-neutral-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all duration-300 group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                </button>
                <button aria-label="Bookmark this post" className="p-3 rounded-xl bg-dark-100 text-neutral-400 hover:text-accent-400 hover:bg-accent-500/10 transition-all duration-300 group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
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