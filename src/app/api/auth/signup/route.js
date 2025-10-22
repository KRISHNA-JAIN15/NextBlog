import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/utils/Email/email";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Validate inputs
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password and name are required" },
        { status: 400 }
      );
    }

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token (6-digit code)
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verified: false,
        verificationToken: verificationCode,
        credits: 0,
      },
    });

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    return NextResponse.json(
      {
        success: true,
        message:
          "User registered successfully. Please check your email for verification.",
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
