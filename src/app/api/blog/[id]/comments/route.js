import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/middleware/auth";

// Add a comment to a blog post - only accessible to logged-in users
async function addComment(req, { params }) {
  try {
    const postId = parseInt(params.id);
    const userId = req.user.id;
    const { content } = await req.json();

    if (isNaN(postId)) {
      return NextResponse.json(
        { error: "Invalid blog post ID" },
        { status: 400 }
      );
    }

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    // Check if the blog post exists
    const blogPost = await prisma.blogPost.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!blogPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: comment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Comment creation error:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}

// Get comments for a blog post
export async function GET(req, { params }) {
  try {
    const postId = parseInt(params.id);
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    if (isNaN(postId)) {
      return NextResponse.json(
        { error: "Invalid blog post ID" },
        { status: 400 }
      );
    }

    // Check if the blog post exists
    const blogPost = await prisma.blogPost.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!blogPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Get total count for pagination
    const totalCount = await prisma.comment.count({
      where: { postId },
    });

    // Get comments
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: comments,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Comments retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve comments" },
      { status: 500 }
    );
  }
}

// Apply auth middleware to POST endpoint
export const POST = withAuth(addComment);
