import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateToken, setAuthCookie } from "@/lib/auth";
import { sendWelcomeEmail, sendVerificationEmail } from "@/utils/Email/email";

export async function POST(req) {
  try {
    const { email, verificationCode } = await req.json();

    if (!email || !verificationCode) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      );
    }

    // Find user with matching email and verification token
    const user = await prisma.user.findFirst({
      where: {
        email,
        verificationToken: verificationCode,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Update user to verified status
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        verificationToken: null,
      },
    });

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name || "User");

    // Generate auth token
    const token = generateToken(updatedUser);

    // Set auth cookie
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        verified: updatedUser.verified,
        credits: updatedUser.credits,
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

// Resend verification code
export async function PUT(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.verified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    // Generate new verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Update user with new verification token
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken: verificationCode },
    });

    // Send new verification email
    await sendVerificationEmail(email, verificationCode);

    return NextResponse.json({
      success: true,
      message: "Verification code resent successfully",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification code" },
      { status: 500 }
    );
  }
}
