import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, withVerifiedUser } from "@/middleware/auth";

// Get all blog posts with optional filtering - accessible to anyone
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const topic = searchParams.get("topic");
    const type = searchParams.get("type");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build the where filter
    const where = {
      published: true, // Only return published posts
    };

    // Filter by topic if provided
    if (topic) {
      where.topic = topic;
    }

    // Filter by type if provided
    if (type) {
      where.type = type;
    }

    // Search functionality
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count for pagination
    const totalCount = await prisma.blogPost.count({ where });

    // Get blog posts with author info
    const blogPosts = await prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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
    console.error("Blog retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve blog posts" },
      { status: 500 }
    );
  }
}

// Create a new blog post - only accessible to verified users
async function handler(req) {
  try {
    const {
      title,
      content,
      excerpt,
      coverImage,
      tags = [],
      type = "FREE",
      topic = "TECHNOLOGY",
      published = true,
    } = await req.json();
    const userId = req.user.id;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Validate type is one of the enum values
    const validTypes = ["FREE", "PAID"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid post type", validTypes },
        { status: 400 }
      );
    }

    // Validate topic is one of the enum values
    const validTopics = [
      "TECHNOLOGY",
      "HEALTH",
      "LIFESTYLE",
      "EDUCATION",
      "ENTERTAINMENT",
    ];
    if (!validTopics.includes(topic)) {
      return NextResponse.json(
        { error: "Invalid topic", validTopics },
        { status: 400 }
      );
    }

    // Create new blog post
    const blogPost = await prisma.blogPost.create({
      data: {
        title,
        content,
        excerpt: excerpt || content.substring(0, 200),
        coverImage: coverImage || null,
        topic,
        type,
        published,
        authorId: userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        ...blogPost,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Blog creation error:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}

// Apply verified user middleware
export const POST = withVerifiedUser(handler);
