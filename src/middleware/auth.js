import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

/**
 * Get the current user from either NextAuth session or custom JWT
 * @param {Request} req - The request object
 * @returns {Object|null} User object or null
 */
async function getAuthenticatedUser(req) {
  // First, try NextAuth session
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          email: true,
          name: true,
          verified: true,
          credits: true,
        },
      });
      if (user) {
        return user;
      }
    }
  } catch (error) {
    // NextAuth session check failed, try custom auth
  }

  // Fall back to custom JWT auth
  const cookies = req.cookies;
  const authToken = cookies.get("auth_token")?.value;

  if (authToken) {
    const decoded = verifyToken(authToken);
    if (decoded) {
      return decoded;
    }
  }

  return null;
}

/**
 * Authentication middleware that wraps an API route handler
 * @param {Function} handler - The API route handler to protect
 * @returns {Function} Protected API route handler
 */
export function withAuth(handler) {
  return async function (req, context) {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Add user to the request object for the handler to use
    req.user = user;

    // Call the original handler with authenticated user
    return handler(req, context);
  };
}

/**
 * Verify user is authenticated and has verified email
 * @param {Function} handler - The API route handler to protect
 * @returns {Function} Protected API route handler requiring verified email
 */
export function withVerifiedUser(handler) {
  return withAuth(async (req, context) => {
    if (!req.user.verified) {
      return NextResponse.json(
        { error: "Email verification required" },
        { status: 403 }
      );
    }
    return handler(req, context);
  });
}
