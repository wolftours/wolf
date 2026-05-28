import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  getAdminCookieOptions,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");

  const redirectUrl = new URL("/admin", request.url);

  if (!verifyAdminPassword(password)) {
    redirectUrl.searchParams.set("error", "1");
    return NextResponse.redirect(redirectUrl);
  }

  const response = NextResponse.redirect(redirectUrl);
  const options = getAdminCookieOptions();

  response.cookies.set({
    ...options,
    value: createAdminSessionToken(),
  });

  return response;
}
