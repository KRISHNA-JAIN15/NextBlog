import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/middleware/auth";

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid blog post ID" },
        { status: 400 }
      );
    }

    // Get the blog post with author and comments
    const blogPost = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        Comment: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10, // Limit initial comments
        },
        _count: {
          select: {
            Comment: true,
          },
        },
      },
    });

    if (!blogPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Format the response
    const formattedPost = {
      ...blogPost,
      commentCount: blogPost._count.Comment,
      _count: undefined,
    };

    return NextResponse.json({
      success: true,
      data: formattedPost,
    });
  } catch (error) {
    console.error("Blog post retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve blog post" },
      { status: 500 }
    );
  }
}

// Update a blog post - only accessible to the author
async function updateBlogPost(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const userId = req.user.id;
    const { title, content, excerpt, coverImage, topic, type, published } =
      await req.json();

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid blog post ID" },
        { status: 400 }
      );
    }

    // Check if the blog post exists and belongs to the user
    const blogPost = await prisma.blogPost.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!blogPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Check if the user is the author
    if (blogPost.authorId !== userId) {
      return NextResponse.json(
        { error: "You are not authorized to update this blog post" },
        { status: 403 }
      );
    }

    // Build the update data
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (topic !== undefined) {
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
      updateData.topic = topic;
    }
    if (type !== undefined) {
      // Validate type is one of the enum values
      const validTypes = ["FREE", "PAID"];
      if (!validTypes.includes(type)) {
        return NextResponse.json(
          { error: "Invalid post type", validTypes },
          { status: 400 }
        );
      }
      updateData.type = type;
    }
    if (published !== undefined) updateData.published = published;

    // Update the blog post
    const updatedBlogPost = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updatedBlogPost,
    });
  } catch (error) {
    console.error("Blog post update error:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// Delete a blog post - only accessible to the author
async function deleteBlogPost(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const userId = req.user.id;

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid blog post ID" },
        { status: 400 }
      );
    }

    // Check if the blog post exists and belongs to the user
    const blogPost = await prisma.blogPost.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!blogPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Check if the user is the author
    if (blogPost.authorId !== userId) {
      return NextResponse.json(
        { error: "You are not authorized to delete this blog post" },
        { status: 403 }
      );
    }

    // Delete the blog post and related comments
    // Note: This relies on the cascade delete set up in the Prisma schema
    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Blog post deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}

// Apply auth middleware to update and delete endpoints
export const PUT = withAuth(updateBlogPost);
export const DELETE = withAuth(deleteBlogPost);
