import React from 'react';
import { Page } from '@/components/layout/Page';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';

export default function BlogNotFound() {
  return (
    <Page>
      <Container>
        <div className="py-20 text-center">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-primary-500/10 flex items-center justify-center">
            <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-neutral-100 mb-4">Blog Not Found</h1>
          <p className="text-lg text-neutral-400 mb-8 max-w-md mx-auto">
            The blog post you&apos;re looking for doesn&apos;t exist or may have been removed.
          </p>
          <div className="flex gap-4 justify-center">
            <Button href="/blogs" variant="primary">
              Browse All Blogs
            </Button>
            <Button href="/" variant="outline">
              Go Home
            </Button>
          </div>
        </div>
      </Container>
    </Page>
  );
}
