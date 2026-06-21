import Stripe from "stripe";
import { getActiveStripeSecretKey } from "@/lib/stripe-settings";

const stripeClients = new Map<string, Stripe>();

export async function getStripe() {
  const secretKey = await getActiveStripeSecretKey();

  if (!secretKey) {
    throw new Error("Stripe is not configured. Missing STRIPE_SECRET_KEY.");
  }

  const existingClient = stripeClients.get(secretKey);

  if (existingClient) {
    return existingClient;
  }

  const stripeClient = new Stripe(secretKey);
  stripeClients.set(secretKey, stripeClient);

  return stripeClient;
}

