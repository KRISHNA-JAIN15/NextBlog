import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/middleware/auth";

async function handler(request, context) {
  const user = request.user;
  const { id } = await context.params;
  const blogId = parseInt(id);

  if (isNaN(blogId)) {
    return NextResponse.json(
      { success: false, message: "Invalid blog ID" },
      { status: 400 }
    );
  }

  try {
    // Check if the blog exists
    const blog = await prisma.blogPost.findUnique({
      where: { id: blogId },
      include: { author: true },
    });

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    // Don't count views for the author viewing their own blog
    if (blog.authorId === user.id) {
      return NextResponse.json({
        success: true,
        message: "Own blog view, not counted",
        credited: false,
      });
    }

    // Check if user has already viewed this blog
    const existingView = await prisma.blogView.findUnique({
      where: {
        postId_userId: {
          postId: blogId,
          userId: user.id,
        },
      },
    });

    if (existingView) {
      return NextResponse.json({
        success: true,
        message: "Already viewed",
        credited: false,
      });
    }

    // Create view and update count + credit author in a transaction
    await prisma.$transaction([
      // Create view record
      prisma.blogView.create({
        data: {
          postId: blogId,
          userId: user.id,
        },
      }),
      // Increment view count on blog
      prisma.blogPost.update({
        where: { id: blogId },
        data: {
          viewCount: { increment: 1 },
        },
      }),
      // Add credit to author (1 credit per unique view)
      prisma.user.update({
        where: { id: blog.authorId },
        data: {
          credits: { increment: 1 },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "View recorded, author credited",
      credited: true,
    });
  } catch (error) {
    console.error("View tracking error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to record view" },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);
