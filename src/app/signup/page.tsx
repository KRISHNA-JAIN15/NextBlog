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
      <Container className="py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-neutral-900">Create an Account</h1>
          <SignupForm />
        </div>
      </Container>
    </Page>
  );
}