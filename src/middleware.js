import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Paths that don't require authentication
const publicPaths = [
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/verify",
  "/api/auth/callback",
  "/api/auth/session",
  "/api/auth/csrf",
  "/api/auth/providers",
  "/",
];

// Auth pages that authenticated users shouldn't access
const authPages = ["/login", "/signup", "/register"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check for NextAuth session token
  const nextAuthToken = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check for custom JWT auth token
  const customAuthToken = request.cookies.get("auth_token")?.value;

  const isAuthenticated = !!nextAuthToken || !!customAuthToken;

  // Redirect authenticated users away from login/signup pages
  if (isAuthenticated && authPages.some((path) => pathname === path)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Check if the path is public - no auth needed
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Allow auth pages for unauthenticated users
  if (authPages.some((path) => pathname === path)) {
    return NextResponse.next();
  }

  // Check for authentication on protected routes
  if (!isAuthenticated) {
    // API routes return JSON error
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Page routes redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // User is authenticated, proceed
  return NextResponse.next();
}

// Configuration to match specific paths
export const config = {
  matcher: [
    // Auth pages (to redirect authenticated users)
    "/login",
    "/signup",
    "/register",

    // Protected API routes that require authentication
    "/api/user/:path*",
    "/api/blog/:path*",
    "/api/subscription/:path*",
    "/api/upload/:path*",

    // Protected page routes that require authentication
    "/dashboard/:path*",
    "/profile/:path*",
    "/blog/create",
    // Add more protected routes as needed
  ],
};
