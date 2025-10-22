import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/middleware/auth";

// Protected route - only accessible to authenticated users
async function handler(req) {
  try {
    const userId = req.user.id;

    // Get fresh user data from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        verified: true,
        credits: true,
        createdAt: true,
        // Include post count but not the posts themselves
        _count: {
          select: {
            Posts: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Format the response
    return NextResponse.json({
      success: true,
      user: {
        ...user,
        postCount: user._count.Posts,
        _count: undefined,
      },
    });
  } catch (error) {
    console.error("Profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// Apply auth middleware
export const GET = withAuth(handler);
