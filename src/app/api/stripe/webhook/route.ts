import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { sendBookingConfirmationEmail } from "@/lib/email";
import { getStripe } from "@/lib/stripe";
import {
  createWolfToursOrder,
  getWolfToursOrderByReference,
} from "@/lib/wolftours-db";

export const runtime = "nodejs";

function getRequiredMetadata(
  metadata: Stripe.Metadata | null,
  key: string,
) {
  const value = metadata?.[key];

  if (!value) {
    throw new Error(`Stripe session is missing ${key} metadata.`);
  }

  return value;
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") {
    return;
  }

  const reference = getRequiredMetadata(session.metadata, "reference");
  const existingOrder = await getWolfToursOrderByReference(reference);

  if (existingOrder) {
    return;
  }

  const result = await createWolfToursOrder(
    {
      adults: Number(getRequiredMetadata(session.metadata, "adults")),
      children: Number(getRequiredMetadata(session.metadata, "children")),
      customerEmail: getRequiredMetadata(session.metadata, "customerEmail"),
      customerName: getRequiredMetadata(session.metadata, "customerName"),
      customerPhone: getRequiredMetadata(session.metadata, "customerPhone"),
      entryTime: getRequiredMetadata(session.metadata, "entryTime"),
      museumSlug: getRequiredMetadata(session.metadata, "museumSlug"),
      productSlug: getRequiredMetadata(session.metadata, "productSlug"),
      reference,
      visitDate: getRequiredMetadata(session.metadata, "visitDate"),
    },
    { skipAvailabilityCheck: true },
  );

  if (!result.ok) {
    throw new Error(result.error);
  }

  await sendBookingConfirmationEmail(result.order);
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
