import {
  TIME_SLOTS,
  createBookingReference,
  getAvailableTimeSlots,
  toIsoDate,
} from "@/lib/booking";
import { getServiceFee } from "@/lib/pricing";
import { getProduct } from "@/lib/travel-data";
import { getSupabaseAdmin, hasSupabaseAdminEnv } from "./supabase-server";

export type WolfToursOrder = {
  id: string;
  reference: string;
  museum_slug: string;
  museum_name: string;
  product_slug: string;
  product_title: string;
  city: string;
  visit_date: string;
  entry_time: string;
  adults: number;
  children: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  subtotal: number;
  service_fee: number;
  total: number;
  sent: boolean;
  sent_at: string | null;
  created_at: string;
};

export type WolfToursClosedSlot = {
  id: string;
  museum_slug: string;
  product_slug: string;
  visit_date: string;
  entry_time: string;
  reason: string | null;
  created_at: string;
};

export type CreateOrderInput = {
  museumSlug: string;
  productSlug: string;
  visitDate: string;
  entryTime: string;
  adults: number;
  children: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
};

function getDatabaseErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "";

  if (
    message.includes("ENOTFOUND") ||
    message.includes("ECONNREFUSED") ||
    message.includes("Connection terminated") ||
    message.includes("DATABASE_URL")
  ) {
    return "Booking storage is not connected yet. Please contact us and we will reserve this manually.";
  }

  return message || "Could not create order.";
}

function getBookingTimezoneNow() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bratislava",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const getPart = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "00";

  return {
    date: `${getPart("year")}-${getPart("month")}-${getPart("day")}`,
    time: `${getPart("hour")}:${getPart("minute")}`,
  };
}

export function isPastSlot(visitDate: string, entryTime: string) {
  const now = getBookingTimezoneNow();

  if (visitDate < now.date) {
    return true;
  }

  if (visitDate > now.date) {
    return false;
  }

  return entryTime <= now.time;
}

export async function getClosedSlotsForProduct(
  museumSlug: string,
  productSlug: string,
  visitDate?: string,
) {
  if (!hasSupabaseAdminEnv()) {
    return [];
  }

  try {
    let query = getSupabaseAdmin()
      .from("wolftours_closed_slots")
      .select("*")
      .eq("museum_slug", museumSlug)
      .eq("product_slug", productSlug)
      .order("visit_date", { ascending: true })
      .order("entry_time", { ascending: true });

    if (visitDate) {
      query = query.eq("visit_date", visitDate);
    }

    const { data, error } = await query;

    if (error) {
      return [];
    }

    return (data ?? []) as WolfToursClosedSlot[];
  } catch {
    return [];
  }
}

export async function getAvailableSlotsForProduct(
  museumSlug: string,
  productSlug: string,
  visitDate: string,
) {
  const closedSlots = await getClosedSlotsForProduct(
    museumSlug,
    productSlug,
    visitDate,
  );
  const closed = new Set(closedSlots.map((slot) => slot.entry_time));

  return getAvailableTimeSlots(visitDate).filter(
    (slot) => !closed.has(slot) && !isPastSlot(visitDate, slot),
  );
}

export async function createWolfToursOrder(input: CreateOrderInput) {
  const product = getProduct(input.museumSlug, input.productSlug);

  if (!product) {
    return { ok: false as const, error: "Unknown product." };
  }

  if (product.isClosed) {
    return { ok: false as const, error: "This product is currently unavailable." };
  }

  const adults = Math.trunc(input.adults);
  const children = Math.trunc(input.children);

  if (adults < 1) {
    return { ok: false as const, error: "At least one adult ticket is required." };
  }

  if (children < 0) {
    return { ok: false as const, error: "Child ticket count is invalid." };
  }

  if (!input.customerName.trim()) {
    return { ok: false as const, error: "Please enter your name." };
  }

  if (!input.customerEmail.trim() || !input.customerEmail.includes("@")) {
    return { ok: false as const, error: "Please enter a valid email address." };
  }

  if (!input.customerPhone.trim()) {
    return { ok: false as const, error: "Please enter your phone number." };
  }

  const availableSlots = await getAvailableSlotsForProduct(
    input.museumSlug,
    input.productSlug,
    input.visitDate,
  );

  if (!availableSlots.includes(input.entryTime)) {
    return { ok: false as const, error: "This entry time is no longer available." };
  }

  const serviceFee = getServiceFee(product);
  const subtotal = adults * product.adultPrice + children * product.childPrice;
  const total = subtotal + serviceFee;
  const reference = createBookingReference();

  try {
    const { data: order, error } = await getSupabaseAdmin()
      .from("wolftours_orders")
      .insert({
        reference,
        museum_slug: input.museumSlug,
        museum_name: product.museumName,
        product_slug: input.productSlug,
        product_title: product.title,
        city: product.city,
        visit_date: input.visitDate,
        entry_time: input.entryTime,
        adults,
        children,
        customer_name: input.customerName.trim(),
        customer_email: input.customerEmail.trim(),
        customer_phone: input.customerPhone.trim(),
        subtotal,
        service_fee: serviceFee,
        total,
      })
      .select("*")
      .single();

    if (error) {
      return { ok: false as const, error: getDatabaseErrorMessage(error) };
    }

    return { ok: true as const, order: order as WolfToursOrder };
  } catch (error) {
    return {
      ok: false as const,
      error: getDatabaseErrorMessage(error),
    };
  }
}

export async function listWolfToursOrders() {
  if (!hasSupabaseAdminEnv()) {
    return [];
  }

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("wolftours_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return [];
    }

    return (data ?? []) as WolfToursOrder[];
  } catch {
    return [];
  }
}

export async function getWolfToursOrderById(orderId: string) {
  if (!orderId || !hasSupabaseAdminEnv()) {
    return null;
  }

  const { data, error } = await getSupabaseAdmin()
    .from("wolftours_orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (error) {
    throw new Error(getDatabaseErrorMessage(error));
  }

  return data ? (data as WolfToursOrder) : null;
}

export async function setWolfToursOrderSent(orderId: string, sent: boolean) {
  const { error } = await getSupabaseAdmin()
    .from("wolftours_orders")
    .update({
      sent,
      sent_at: sent ? new Date().toISOString() : null,
    })
    .eq("id", orderId);

  if (error) {
    throw new Error(getDatabaseErrorMessage(error));
  }
}

export async function listWolfToursClosedSlots() {
  if (!hasSupabaseAdminEnv()) {
    return [];
  }

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("wolftours_closed_slots")
      .select("*")
      .order("visit_date", { ascending: true })
      .order("entry_time", { ascending: true });

    if (error) {
      return [];
    }

    return (data ?? []) as WolfToursClosedSlot[];
  } catch {
    return [];
  }
}

export async function closeWolfToursSlot(
  museumSlug: string,
  productSlug: string,
  visitDate: string,
  entryTime: string,
) {
  if (!museumSlug || !productSlug || !visitDate) {
    throw new Error("Product and visit date are required.");
  }

  if (!TIME_SLOTS.includes(entryTime)) {
    throw new Error("Invalid time slot.");
  }

  const { error } = await getSupabaseAdmin().from("wolftours_closed_slots").upsert(
    {
      museum_slug: museumSlug,
      product_slug: productSlug,
      visit_date: visitDate,
      entry_time: entryTime,
    },
    { onConflict: "museum_slug,product_slug,visit_date,entry_time" },
  );

  if (error) {
    throw new Error(getDatabaseErrorMessage(error));
  }
}

function getDateRange(startDate: string, endDate: string) {
  if (!startDate || !endDate) {
    throw new Error("Start and end date are required.");
  }

  const start = new Date(`${startDate}T12:00:00`);
  const end = new Date(`${endDate}T12:00:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error("Invalid date range.");
  }

  if (start > end) {
    throw new Error("Start date must be before end date.");
  }

  const dates: string[] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    dates.push(toIsoDate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  if (dates.length > 90) {
    throw new Error("You can close up to 90 days at once.");
  }

  return dates;
}

export async function closeWolfToursProductDays(
  museumSlug: string,
  productSlug: string,
  startDate: string,
  endDate: string,
) {
  if (!museumSlug || !productSlug) {
    throw new Error("Product is required.");
  }

  const rows = getDateRange(startDate, endDate).flatMap((visitDate) =>
    getAvailableTimeSlots(visitDate).map((entryTime) => ({
      museum_slug: museumSlug,
      product_slug: productSlug,
      visit_date: visitDate,
      entry_time: entryTime,
    })),
  );

  if (rows.length === 0) {
    throw new Error("No bookable slots found for this date range.");
  }

  const { error } = await getSupabaseAdmin()
    .from("wolftours_closed_slots")
    .upsert(rows, {
      onConflict: "museum_slug,product_slug,visit_date,entry_time",
    });

  if (error) {
    throw new Error(getDatabaseErrorMessage(error));
  }
}

export async function openWolfToursProductDay(
  museumSlug: string,
  productSlug: string,
  visitDate: string,
) {
  if (!museumSlug || !productSlug || !visitDate) {
    throw new Error("Product and visit date are required.");
  }

  const { error } = await getSupabaseAdmin()
    .from("wolftours_closed_slots")
    .delete()
    .eq("museum_slug", museumSlug)
    .eq("product_slug", productSlug)
    .eq("visit_date", visitDate);

  if (error) {
    throw new Error(getDatabaseErrorMessage(error));
  }
}

export async function openWolfToursSlot(closedSlotId: string) {
  const { error } = await getSupabaseAdmin()
    .from("wolftours_closed_slots")
    .delete()
    .eq("id", closedSlotId);

  if (error) {
    throw new Error(getDatabaseErrorMessage(error));
  }
}
