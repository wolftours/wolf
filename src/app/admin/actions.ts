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

function getProductParts(formData: FormData) {
  const productKey = String(formData.get("productKey") ?? "");
  const separatorIndex = productKey.indexOf(":");

  if (separatorIndex === -1) {
    return {
      museumSlug: String(formData.get("museumSlug") ?? ""),
      productKey,
      productSlug: String(formData.get("productSlug") ?? ""),
    };
  }

  return {
    museumSlug: productKey.slice(0, separatorIndex),
    productKey,
    productSlug: productKey.slice(separatorIndex + 1),
  };
}

function revalidateAvailability(museumSlug: string, productSlug: string) {
  revalidatePath("/admin");

  if (museumSlug && productSlug) {
    revalidatePath(`/book/${museumSlug}/${productSlug}`);
    revalidatePath(`/museums/${museumSlug}`);
  }
}

function getTimesRedirectUrl(formData: FormData) {
  const productKey = String(formData.get("productKey") ?? "");
  const visitDate = String(
    formData.get("visitDate") ?? formData.get("startDate") ?? "",
  );
  const params = new URLSearchParams({ tab: "times" });

  if (productKey) {
    params.set("productKey", productKey);
  }

  if (visitDate) {
    params.set("date", visitDate);
  }

  return `/admin?${params.toString()}`;
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

  const { museumSlug, productSlug } = getProductParts(formData);

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

  revalidateAvailability(museumSlug ?? "", productSlug ?? "");
  redirect(getTimesRedirectUrl(formData));
}

export async function closeProductDaysAction(formData: FormData) {
  await assertAdmin();

  const { museumSlug, productSlug } = getProductParts(formData);

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

  revalidateAvailability(museumSlug ?? "", productSlug ?? "");
  redirect(getTimesRedirectUrl(formData));
}

export async function closeProductDayAction(formData: FormData) {
  await assertAdmin();

  const { museumSlug, productSlug } = getProductParts(formData);
  const visitDate = String(formData.get("visitDate") ?? "");

  try {
    await closeWolfToursProductDays(museumSlug, productSlug, visitDate, visitDate);
  } catch (error) {
    redirect(`/admin?tab=times&error=${encodeURIComponent(getErrorMessage(error))}`);
  }

  revalidateAvailability(museumSlug, productSlug);
  redirect(getTimesRedirectUrl(formData));
}

export async function openSlotAction(formData: FormData) {
  await assertAdmin();

  const { museumSlug, productSlug } = getProductParts(formData);

  try {
    await openWolfToursSlot(String(formData.get("closedSlotId") ?? ""));
  } catch (error) {
    redirect(`/admin?tab=times&error=${encodeURIComponent(getErrorMessage(error))}`);
  }

  revalidateAvailability(museumSlug ?? "", productSlug ?? "");
  redirect(getTimesRedirectUrl(formData));
}

export async function openProductDayAction(formData: FormData) {
  await assertAdmin();

  const museumSlug = String(formData.get("museumSlug") ?? "");
  const productSlug = String(formData.get("productSlug") ?? "");

  try {
    await openWolfToursProductDay(
      museumSlug,
      productSlug,
      String(formData.get("visitDate") ?? ""),
    );
  } catch (error) {
    redirect(`/admin?tab=times&error=${encodeURIComponent(getErrorMessage(error))}`);
  }

  revalidateAvailability(museumSlug, productSlug);
  redirect(getTimesRedirectUrl(formData));
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Admin action failed.";
}
