import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const userData = await getCurrentUser();

    if (!userData) {
      return NextResponse.json({
        isAuthenticated: false,
        user: null,
      });
    }

    // Get up-to-date user data from the database
    const user = await prisma.user.findUnique({
      where: { id: userData.id },
      select: {
        id: true,
        email: true,
        name: true,
        verified: true,
        credits: true,
      },
    });

    if (!user) {
      // User in token not found in database
      return NextResponse.json({
        isAuthenticated: false,
        user: null,
      });
    }

    return NextResponse.json({
      isAuthenticated: true,
      user,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      {
        isAuthenticated: false,
        user: null,
        error: "Failed to check authentication status",
      },
      { status: 500 }
    );
  }
}
