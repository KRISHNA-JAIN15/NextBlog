import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/middleware/auth";

async function handler(request) {
  const user = request.user;
  try {
    // Get active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: "ACTIVE",
        endDate: {
          gt: new Date(),
        },
      },
      orderBy: {
        endDate: "desc",
      },
    });

    // Get user credits
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { credits: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        hasActiveSubscription: !!subscription,
        subscription: subscription
          ? {
              startDate: subscription.startDate,
              endDate: subscription.endDate,
              daysRemaining: Math.ceil(
                (new Date(subscription.endDate) - new Date()) /
                  (1000 * 60 * 60 * 24)
              ),
            }
          : null,
        credits: userData?.credits || 0,
      },
    });
  } catch (error) {
    console.error("Subscription status error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get subscription status" },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
