import React from 'react';
import { SignupForm } from '@/components/auth/SignupForm';
import { Container } from '@/components/layout/Container';
import { Page } from '@/components/layout/Page';

export const metadata = {
  title: 'Sign Up | NextBlog',
  description: 'Create a new account'
};

export default function SignupPage() {
  return (
    <Page>
      <Container className="py-16 md:py-24">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 mx-auto flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">Create an Account</h1>
            <p className="text-gray-400 mt-2">Join our community of writers</p>
          </div>
          <SignupForm />
        </div>
      </Container>
    </Page>
  );
}