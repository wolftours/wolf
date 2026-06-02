"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, isAdminSessionTokenValid } from "@/lib/admin-auth";
import {
  closeWolfToursProductDays,
  closeWolfToursSlot,
  openWolfToursProductDay,
  openWolfToursSlot,
  setWolfToursOrderSent,
} from "@/lib/wolftours-db";

async function assertAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!isAdminSessionTokenValid(session)) {
    throw new Error("Unauthorized");
  }
}

export async function setOrderSentAction(formData: FormData) {
  await assertAdmin();

  const orderId = String(formData.get("orderId") ?? "");
  const sent = String(formData.get("sent") ?? "") === "true";

  try {
    await setWolfToursOrderSent(orderId, sent);
  } catch (error) {
    redirect(`/admin?tab=orders&error=${encodeURIComponent(getErrorMessage(error))}`);
  }

  revalidatePath("/admin");
}

export async function closeSlotAction(formData: FormData) {
  await assertAdmin();

  const [museumSlug, productSlug] = String(formData.get("productKey") ?? "").split(
    ":",
  );

  try {
    await closeWolfToursSlot(
      museumSlug ?? "",
      productSlug ?? "",
      String(formData.get("visitDate") ?? ""),
      String(formData.get("entryTime") ?? ""),
    );
  } catch (error) {
    redirect(`/admin?tab=times&error=${encodeURIComponent(getErrorMessage(error))}`);
  }

  revalidatePath("/admin");
  redirect("/admin?tab=times");
}

export async function closeProductDaysAction(formData: FormData) {
  await assertAdmin();

  const [museumSlug, productSlug] = String(formData.get("productKey") ?? "").split(
    ":",
  );

  try {
    await closeWolfToursProductDays(
      museumSlug ?? "",
      productSlug ?? "",
      String(formData.get("startDate") ?? ""),
      String(formData.get("endDate") || formData.get("startDate") || ""),
    );
  } catch (error) {
    redirect(`/admin?tab=times&error=${encodeURIComponent(getErrorMessage(error))}`);
  }

  revalidatePath("/admin");
  redirect("/admin?tab=times");
}

export async function openSlotAction(formData: FormData) {
  await assertAdmin();

  try {
    await openWolfToursSlot(String(formData.get("closedSlotId") ?? ""));
  } catch (error) {
    redirect(`/admin?tab=times&error=${encodeURIComponent(getErrorMessage(error))}`);
  }

  revalidatePath("/admin");
  redirect("/admin?tab=times");
}

export async function openProductDayAction(formData: FormData) {
  await assertAdmin();

  try {
    await openWolfToursProductDay(
      String(formData.get("museumSlug") ?? ""),
      String(formData.get("productSlug") ?? ""),
      String(formData.get("visitDate") ?? ""),
    );
  } catch (error) {
    redirect(`/admin?tab=times&error=${encodeURIComponent(getErrorMessage(error))}`);
  }

  revalidatePath("/admin");
  redirect("/admin?tab=times");
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Admin action failed.";
}
