"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';

export const EmailVerification: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verificationCode, setVerificationCode] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  // Define verifyEmail function with useCallback
  const verifyEmail = React.useCallback(async (verificationToken: string) => {
    setIsVerifying(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify email');
      }

      setVerified(true);
      
      // Redirect to login after verification
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'An error occurred during verification');
      } else {
        setError('An error occurred during verification');
      }
    } finally {
      setIsVerifying(false);
    }
  }, [router]);

  useEffect(() => {
    // If we have a token, verify the email
    if (token) {
      verifyEmail(token);
    }
  }, [token, verifyEmail]);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    setError('');
    
    try {
      // Get email from URL params or use a stored value
      const email = searchParams.get('email');
      
      if (!email) {
        setError('Email is required to resend verification');
        return;
      }
      
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification email');
      }

      // Set cooldown timer
      setResendCooldown(60);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'An error occurred');
      } else {
        setError('An error occurred');
      }
    }
  };

  // Use token if provided in URL (backwards compatibility)
  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token, verifyEmail]);
  
  const handleSubmitVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }
    
    setIsVerifying(true);
    
    try {
      await verifyEmail(verificationCode);
    } catch {
      // Error is handled in verifyEmail function
    }
  };

  // If no token, show verification code form
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <svg 
            className="mx-auto h-16 w-16 text-primary-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
            />
          </svg>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-neutral-800 mb-2 text-center">Check your inbox</h3>
          <p className="text-neutral-600 mb-6 text-center">
            We&apos;ve sent a 6-digit verification code to{' '}
            <span className="font-medium">{email || 'your email'}</span>.
            Please enter the code below to verify your account.
          </p>
          
          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}

          {verified ? (
            <Alert variant="success" className="mb-4">
              <p>Your email has been verified successfully!</p>
              <p className="mt-2">You will be redirected to the login page shortly.</p>
            </Alert>
          ) : (
            <form onSubmit={handleSubmitVerificationCode}>
              <Input
                label="Verification Code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                className="mb-6 text-center text-lg tracking-widest"
              />
              
              <Button 
                type="submit" 
                fullWidth 
                isLoading={isVerifying}
                className="mb-4"
              >
                Verify Email
              </Button>
            </form>
          )}
          
          <p className="text-sm text-neutral-500 mb-6 text-center">
            If you don&apos;t see the email, check your spam folder.
          </p>
          
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={handleResendVerification}
              disabled={resendCooldown > 0 || verified}
            >
              {resendCooldown > 0 
                ? `Resend in ${resendCooldown}s` 
                : 'Resend verification code'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};