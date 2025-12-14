import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Container } from '@/components/layout/Container';
import { Page } from '@/components/layout/Page';

export const metadata = {
  title: 'Login | NextBlog',
  description: 'Sign in to your account'
};

export default function LoginPage() {
  return (
    <Page>
      <Container className="py-16 md:py-24">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 mx-auto flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-gray-400 mt-2">Sign in to continue your journey</p>
          </div>
          <LoginForm />
        </div>
      </Container>
    </Page>
  );
}