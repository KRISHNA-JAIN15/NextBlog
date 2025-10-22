import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

/**
 * Authentication middleware that wraps an API route handler
 * @param {Function} handler - The API route handler to protect
 * @returns {Function} Protected API route handler
 */
export function withAuth(handler) {
  return async function (req, context) {
    // Get token from cookies
    const cookies = req.cookies;
    const authToken = cookies.get("auth_token")?.value;

    if (!authToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = verifyToken(authToken);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
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
