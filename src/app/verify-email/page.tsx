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
      <Container className="py-16 md:py-24">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 mx-auto flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">Email Verification</h1>
            <p className="text-gray-400 mt-2">Complete your account setup</p>
          </div>
          <EmailVerification />
        </div>
      </Container>
    </Page>
  );
}