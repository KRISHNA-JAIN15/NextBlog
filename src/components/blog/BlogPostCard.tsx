import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatDistanceToNow } from 'date-fns';

interface BlogPostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    category?: string;
    author: {
      name: string;
      id: string;
    };
    coverImage?: string;
  };
  variant?: 'default' | 'compact' | 'featured';
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({
  post,
  variant = 'default',
}) => {
  const { title, slug, excerpt, createdAt, category, author, coverImage } = post;
  
  // Format the date to be more readable
  const formattedDate = formatDistanceToNow(
    new Date(createdAt),
    { addSuffix: true }
  );

  // Featured variant - larger card with more details
  if (variant === 'featured') {
    return (
      <Card className="overflow-hidden flex flex-col h-full hover:shadow-card-hover transition-shadow duration-200">
        <Link href={`/blogs/${slug}`} className="block">
          <div className="relative w-full h-56">
            {coverImage ? (
              <Image
                src={coverImage}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                <svg
                  className="h-12 w-12 text-neutral-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
            {category && (
              <div className="absolute top-4 left-4">
                <Badge variant="primary">{category}</Badge>
              </div>
            )}
          </div>
        </Link>
        
        <div className="p-6 flex-grow flex flex-col">
          <Link href={`/blogs/${slug}`} className="block group">
            <h2 className="text-xl font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors duration-200">
              {title}
            </h2>
          </Link>
          
          {excerpt && (
            <p className="mt-3 text-neutral-600 line-clamp-3">
              {excerpt}
            </p>
          )}
          
          <div className="flex items-center mt-4 text-sm text-neutral-500">
            <span>By {author.name}</span>
            <span className="mx-2">•</span>
            <span>{formattedDate}</span>
          </div>
          
          <div className="mt-4">
            <Link 
              href={`/blogs/${slug}`} 
              className="inline-flex items-center text-primary-600 hover:text-primary-800"
            >
              Read more
              <svg 
                className="ml-1 w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </Card>
    );
  }
  
  // Compact variant - smaller card with minimal details
  if (variant === 'compact') {
    return (
      <Card className="overflow-hidden hover:shadow-card-hover transition-shadow duration-200">
        <Link href={`/blogs/${slug}`} className="flex h-full">
          {coverImage && (
            <div className="w-1/4 flex-shrink-0 relative">
              <Image
                src={coverImage}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 200px"
                className="object-cover rounded-sm"
              />
            </div>
          )}
          
          <div className={`p-4 ${coverImage ? 'w-3/4' : 'w-full'}`}>
            <div className="flex items-center text-xs text-neutral-500 mb-2">
              {category && (
                <>
                  <Badge variant="primary" size="sm">{category}</Badge>
                  <span className="mx-1">•</span>
                </>
              )}
              <span>{formattedDate}</span>
            </div>
            
            <h3 className="font-medium text-neutral-800 hover:text-primary-600 transition-colors duration-200">
              {title}
            </h3>
            
            <div className="text-xs text-neutral-500 mt-1">
              By {author.name}
            </div>
          </div>
        </Link>
      </Card>
    );
  }
  
  // Default variant
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-card-hover transition-shadow duration-200">
      <Link href={`/blogs/${slug}`} className="block">
        {coverImage && (
          <div className="w-full h-48 relative">
            <Image
              src={coverImage}
              alt={title}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}
      </Link>
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex items-center text-xs text-neutral-500 mb-2">
          {category && (
            <>
              <Badge variant="primary" size="sm">{category}</Badge>
              <span className="mx-1">•</span>
            </>
          )}
          <span>{formattedDate}</span>
        </div>
        
        <Link href={`/blogs/${slug}`} className="block group">
          <h2 className="text-lg font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors duration-200">
            {title}
          </h2>
        </Link>
        
        {excerpt && (
          <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
            {excerpt}
          </p>
        )}
        
        <div className="flex items-center mt-auto pt-4 text-sm text-neutral-500">
          <span>By {author.name}</span>
        </div>
      </div>
    </Card>
  );
};