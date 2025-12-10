import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/middleware/auth";

// Get the authenticated user's blog posts
async function handler(req) {
  try {
    const userId = req.user.id;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const published = searchParams.get("published");
    const skip = (page - 1) * limit;

    // Build the where filter
    const where = { authorId: userId };

    // Filter by published status if provided
    if (published === "true") {
      where.published = true;
    } else if (published === "false") {
      where.published = false;
    }

    // Get total count for pagination
    const totalCount = await prisma.blogPost.count({ where });

    // Get user's blog posts
    const blogPosts = await prisma.blogPost.findMany({
      where,
      include: {
        _count: {
          select: {
            Comment: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    // Format the response
    const formattedPosts = blogPosts.map((post) => ({
      ...post,
      commentCount: post._count.Comment,
      _count: undefined,
    }));

    return NextResponse.json({
      success: true,
      data: formattedPosts,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("User blogs retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve your blog posts" },
      { status: 500 }
    );
  }
}

// Apply auth middleware
export const GET = withAuth(handler);
