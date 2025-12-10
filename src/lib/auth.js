import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const TOKEN_EXPIRY = "7d"; // Token expires in 7 days

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object to encode in the token
 * @returns {string} JWT token
 */
export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      verified: user.verified,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

/**
 * Set auth token in HTTP-only cookie
 * @param {string} token - JWT token
 */
export function setAuthCookie(token) {
  cookies().set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    // 7 days expiry matching the JWT expiry
    maxAge: 7 * 24 * 60 * 60,
  });
}

/**
 * Remove auth token cookie
 */
export function removeAuthCookie() {
  cookies().delete("auth_token");
}

/**
 * Verify JWT token and return decoded data if valid
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded token data or null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return error.message;
  }
}

/**
 * Get the current authenticated user from the request
 * @returns {Promise<Object|null>} User data from token or null if not authenticated
 */
export function getCurrentUser() {
  try {
    // Use the synchronous request cookies approach instead of the async cookies() API
    // This prevents the "cookies() should be awaited" error
    const token = cookies().get("auth_token")?.value;
    
    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}
