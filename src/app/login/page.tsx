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
      <Container className="py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-neutral-900">Welcome Back</h1>
          <LoginForm />
        </div>
      </Container>
    </Page>
  );
}