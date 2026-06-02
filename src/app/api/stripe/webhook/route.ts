import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { sendBookingConfirmationEmail } from "@/lib/email";
import { getStripe } from "@/lib/stripe";
import { getWolfToursOrderById } from "@/lib/wolftours-db";

export const runtime = "nodejs";

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") {
    return;
  }

  const orderId = session.metadata?.orderId;
  if (!orderId) {
    throw new Error("Stripe session is missing orderId metadata.");
  }

  const order = await getWolfToursOrderById(orderId);
  if (!order) {
    throw new Error(`Order not found for Stripe session metadata: ${orderId}`);
  }

  await sendBookingConfirmationEmail(order);
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = (await headers()).get("stripe-signature");

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 500 },
    );
  }

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 },
    );
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    await handleCheckoutSessionCompleted(
      event.data.object as Stripe.Checkout.Session,
    );
  }

  return NextResponse.json({ received: true });
}
