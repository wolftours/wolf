import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { fulfillStripeCheckoutSession } from "@/lib/fulfill-stripe-checkout";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

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
    try {
      await fulfillStripeCheckoutSession(
        event.data.object as Stripe.Checkout.Session,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Checkout fulfillment failed.";
      console.error("Stripe checkout fulfillment failed:", message);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
