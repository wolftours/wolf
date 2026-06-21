import type Stripe from "stripe";
import { sendBookingConfirmationEmail } from "@/lib/email";
import { getStripe } from "@/lib/stripe";
import {
  createWolfToursOrder,
  getWolfToursOrderByReference,
  setWolfToursOrderSent,
} from "@/lib/wolftours-db";

function getRequiredMetadata(metadata: Stripe.Metadata | null, key: string) {
  const value = metadata?.[key];

  if (!value) {
    throw new Error(`Stripe session is missing ${key} metadata.`);
  }

  return value;
}

export async function fulfillStripeCheckoutSession(
  session: Stripe.Checkout.Session,
) {
  if (session.payment_status !== "paid") {
    return { fulfilled: false as const, reason: "unpaid" as const };
  }

  const reference = getRequiredMetadata(session.metadata, "reference");
  const existingOrder = await getWolfToursOrderByReference(reference);

  if (existingOrder) {
    if (!existingOrder.sent) {
      await sendBookingConfirmationEmail(existingOrder);
      await setWolfToursOrderSent(existingOrder.id, true);
    }

    return { fulfilled: true as const, order: existingOrder, created: false };
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
  await setWolfToursOrderSent(result.order.id, true);

  return { fulfilled: true as const, order: result.order, created: true };
}

export async function fulfillStripeCheckoutBySessionId(sessionId: string) {
  const stripe = await getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return fulfillStripeCheckoutSession(session);
}
