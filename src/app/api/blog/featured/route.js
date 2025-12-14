import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get featured blogs (most viewed blogs)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "3");

    // Get top blogs by view count
    const featuredBlogs = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
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
            BlogViews: true,
          },
        },
      },
      orderBy: {
        viewCount: "desc",
      },
      take: limit,
    });

    // Format the response
    const formattedPosts = featuredBlogs.map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      topic: post.topic,
      type: post.type,
      author: post.author.name || "Anonymous",
      authorId: post.author.id,
      createdAt: post.createdAt.toISOString(),
      viewCount: post.viewCount,
      commentCount: post._count.Comment,
    }));

    return NextResponse.json({
      success: true,
      data: formattedPosts,
    });
  } catch (error) {
    console.error("Featured blogs error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to retrieve featured blogs" },
      { status: 500 }
    );
  }
}
