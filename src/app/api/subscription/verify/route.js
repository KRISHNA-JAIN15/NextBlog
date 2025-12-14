import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { withAuth } from "@/middleware/auth";

async function handler(request) {
  const user = request.user;
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Missing payment details" },
        { status: 400 }
      );
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Find the subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        razorpayOrderId: razorpay_order_id,
        userId: user.id,
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { success: false, message: "Subscription not found" },
        { status: 404 }
      );
    }

    // Calculate subscription dates (1 month)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    // Update subscription to active
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        status: "ACTIVE",
        startDate: startDate,
        endDate: endDate,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Subscription activated successfully",
      data: {
        startDate,
        endDate,
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify payment" },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);
