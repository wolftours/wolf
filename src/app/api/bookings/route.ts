import { NextResponse } from "next/server";
import { createWolfToursOrder } from "@/lib/wolftours-db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createWolfToursOrder({
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

    return NextResponse.json({ order: result.order });
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
