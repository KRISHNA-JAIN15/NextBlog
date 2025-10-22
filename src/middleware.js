import { NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

// Paths that don't require authentication
const publicPaths = [
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/verify",
  "/",
  "/login",
  "/signup",
  "/verify",
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if the path is public - no auth needed
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for authentication on protected routes
  const authToken = request.cookies.get("auth_token")?.value;

  if (!authToken || !verifyToken(authToken)) {
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
    // Protected API routes that require authentication
    "/api/user/:path*",
    "/api/blog/:path*",

    // Protected page routes that require authentication
    "/dashboard/:path*",
    "/profile/:path*",
    "/blog/create",
    // Add more protected routes as needed
  ],
};
