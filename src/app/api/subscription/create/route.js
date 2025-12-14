import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import prisma from "@/lib/prisma";
import { withAuth } from "@/middleware/auth";

// Initialize Razorpay only if credentials are available
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

async function handler(request) {
  const user = request.user;

  // Check if Razorpay is configured
  if (!razorpay) {
    return NextResponse.json(
      {
        success: false,
        message: "Payment gateway not configured. Please contact admin.",
      },
      { status: 503 }
    );
  }

  try {
    // Check if user already has an active subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: "ACTIVE",
        endDate: {
          gt: new Date(),
        },
      },
    });

    if (existingSubscription) {
      return NextResponse.json(
        { success: false, message: "You already have an active subscription" },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const amount = 100 * 100; // 100 INR in paise
    const options = {
      amount: amount,
      currency: "INR",
      receipt: `sub_${user.id}_${Date.now()}`,
      notes: {
        userId: user.id.toString(),
        type: "subscription",
      },
    };

    const order = await razorpay.orders.create(options);

    // Create pending subscription record
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        razorpayOrderId: order.id,
        amount: 100,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        subscriptionId: subscription.id,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error("Subscription creation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create subscription order" },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);
