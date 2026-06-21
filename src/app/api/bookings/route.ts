import { NextResponse } from "next/server";
import { formatMoney } from "@/lib/booking";
import { getStripe } from "@/lib/stripe";
import { prepareWolfToursOrder } from "@/lib/wolftours-db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await prepareWolfToursOrder({
      museumSlug: String(body.museumSlug ?? ""),
      productSlug: String(body.productSlug ?? ""),
      visitDate: String(body.visitDate ?? ""),
      entryTime: String(body.entryTime ?? ""),
      adults: Number(body.adults ?? 0),
      children: Number(body.children ?? 0),
      customerName: String(body.customerName ?? ""),
      customerEmail: String(body.customerEmail ?? ""),
      customerPhone: String(body.customerPhone ?? ""),
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const origin = request.headers.get("origin") ?? new URL(request.url).origin;
    const order = result.order;
    const stripe = await getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: order.customer_email,
      client_reference_id: order.reference,
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/book/${order.museum_slug}/${order.product_slug}?payment=cancelled#booking-calendar`,
      metadata: {
        adults: String(order.adults),
        children: String(order.children),
        customerEmail: order.customer_email,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        entryTime: order.entry_time,
        museumSlug: order.museum_slug,
        productSlug: order.product_slug,
        reference: order.reference,
        visitDate: order.visit_date,
      },
      payment_intent_data: {
        metadata: {
          reference: order.reference,
        },
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: Math.round(order.total * 100),
            product_data: {
              name: order.product_title,
              description: `${order.museum_name} · ${order.visit_date} at ${order.entry_time} · ${order.adults} adult${
                order.adults === 1 ? "" : "s"
              }${
                order.children > 0
                  ? `, ${order.children} child${order.children === 1 ? "" : "ren"}`
                  : ""
              } · ${formatMoney(order.total)}`,
              metadata: {
                reference: order.reference,
              },
            },
          },
        },
      ],
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Could not start secure payment." },
        { status: 500 },
      );
    }

    return NextResponse.json({ order, checkoutUrl: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    return NextResponse.json(
      {
        error: message.includes("ENOTFOUND")
          ? "Booking storage is not connected yet. Please contact us and we will reserve this manually."
          : message || "Could not create this booking.",
      },
      { status: 500 },
    );
  }
}
