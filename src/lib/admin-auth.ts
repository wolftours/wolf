import crypto from "node:crypto";

export const ADMIN_SESSION_COOKIE = "wt_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "admin123";
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? "wt-dev-secret-change-me";
}

function signPayload(payload: string) {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");
}

function timingSafeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

export function verifyAdminPassword(password: string) {
  return timingSafeEqual(password, getAdminPassword());
}

export function createAdminSessionToken() {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = `admin:${issuedAt}`;
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

export function isAdminSessionTokenValid(token?: string) {
  if (!token) {
    return false;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return false;
  }

  const expectedSignature = signPayload(payload);
  if (!timingSafeEqual(signature, expectedSignature)) {
    return false;
  }

  const [scope, issuedAtRaw] = payload.split(":");
  if (scope !== "admin") {
    return false;
  }

  const issuedAt = Number(issuedAtRaw);
  if (!Number.isFinite(issuedAt)) {
    return false;
  }

  const age = Math.floor(Date.now() / 1000) - issuedAt;
  return age >= 0 && age <= SESSION_MAX_AGE_SECONDS;
}

export function getAdminCookieOptions() {
  return {
    name: ADMIN_SESSION_COOKIE,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
