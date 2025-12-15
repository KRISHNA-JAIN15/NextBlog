# Google OAuth Setup Guide

This document explains the Google OAuth implementation in the NextBlog application.

## What Has Been Added

### 1. Dependencies
- `next-auth` - Authentication library for Next.js
- `@auth/prisma-adapter` - Prisma adapter for NextAuth.js

### 2. Database Schema Updates
The Prisma schema has been updated with new models to support OAuth:

- **Account**: Stores OAuth provider account information
- **Session**: Stores user sessions
- **VerificationToken**: Stores verification tokens
- **User** model updated: `password` field is now optional to support OAuth-only accounts

### 3. NextAuth Configuration
Created `/src/app/api/auth/[...nextauth]/route.js` with:
- Google OAuth provider configuration
- Prisma adapter for database persistence
- Custom callbacks for user verification and session management

### 4. UI Components Updated
- **LoginForm**: Added "Continue with Google" button
- **SignupForm**: Added "Continue with Google" button
- **AuthProvider**: Created wrapper component for NextAuth SessionProvider

### 5. Environment Variables
Added to `.env.local`:
```
GOOGLE_CLIENT_ID=244010351844-5ljffgptgju2qt08k56ebnhh91m61ne2.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=/AhOoACk3kLlhzZv2UodBLdYmdsA/IhcsFnJjfHKsrQ=
```

## How It Works

### OAuth Flow
1. User clicks "Continue with Google" on login or signup page
2. NextAuth redirects to Google's OAuth consent screen
3. User authenticates with Google and grants permissions
4. Google redirects back to the application with an authorization code
5. NextAuth exchanges the code for user information
6. User is created/updated in the database and marked as verified
7. User is redirected to the dashboard

### Account Linking
- If a user signs up with email/password first and later uses Google OAuth with the same email, the Google account is automatically linked to the existing user
- Users authenticated via Google OAuth are automatically marked as verified (no email verification needed)

## Google Cloud Console Setup

To use Google OAuth, you need to configure it in Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`

## Usage

### In Your Application

Users can now:
- Sign up using Google OAuth (no email verification required)
- Log in using Google OAuth
- Link their Google account to an existing email/password account

### NextAuth Session

After authentication, you can access the session in your components:

```tsx
import { useSession } from 'next-auth/react';

function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'authenticated') {
    return <div>Signed in as {session.user.email}</div>;
  }
  return <div>Not signed in</div>;
}
```

### Server-Side

```tsx
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  // Your protected logic here
}
```

## Security Notes

1. **NEXTAUTH_SECRET**: Change this in production. Generate a new one using:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

2. **Authorized Redirect URIs**: Make sure to add your production domain to Google Cloud Console

3. **HTTPS**: Always use HTTPS in production for OAuth

## Database Migration

The database has already been updated with the new schema. If you need to apply the changes again:

```bash
npx prisma db push
```

## Troubleshooting

### "Error: redirect_uri_mismatch"
- Make sure the redirect URI in Google Cloud Console matches exactly: `http://localhost:3000/api/auth/callback/google`

### Session not persisting
- Make sure the `NEXTAUTH_SECRET` is set in `.env.local`
- Check that cookies are enabled in the browser

### User not being created
- Check database connection
- Verify Prisma schema is up to date
- Check server logs for errors

## Next Steps

To add more OAuth providers (GitHub, Facebook, etc.), add them to the `providers` array in `/src/app/api/auth/[...nextauth]/route.js`:

```javascript
import GitHubProvider from "next-auth/providers/github";

providers: [
  GoogleProvider({ ... }),
  GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  }),
]
```
