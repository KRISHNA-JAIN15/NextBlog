import React from 'react';
import { EmailVerification } from '@/components/auth/EmailVerification';
import { Container } from '@/components/layout/Container';
import { Page } from '@/components/layout/Page';

export const metadata = {
  title: 'Verify Email | NextBlog',
  description: 'Verify your email address'
};

export default function VerifyEmailPage() {
  return (
    <Page>
      <Container className="py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-neutral-900">Email Verification</h1>
          <EmailVerification />
        </div>
      </Container>
    </Page>
  );
}