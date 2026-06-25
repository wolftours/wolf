import { getSupabaseAdmin, hasSupabaseAdminEnv } from "@/lib/supabase-server";

const SETTINGS_TABLE = "wolftours_settings";
const STRIPE_SECRET_KEY = "stripe_secret_key";
const STRIPE_PUBLISHABLE_KEY = "stripe_publishable_key";

type SettingRow = {
  key: string;
  value: string;
};

export type StripeSettingsStatus = {
  source: "database" | "environment" | "missing";
  secretKey: string | null;
  publishableKey: string | null;
  maskedSecretKey: string | null;
  maskedPublishableKey: string | null;
  hasSavedSecretKey: boolean;
  hasSavedPublishableKey: boolean;
  setupError: string | null;
};

function maskKey(key: string | undefined) {
  if (!key) {
    return null;
  }

  if (key.length <= 14) {
    return `${key.slice(0, 4)}...`;
  }

  return `${key.slice(0, 8)}...${key.slice(-4)}`;
}

function getSetupError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error && "message" in error
        ? String(error.message)
        : String(error);

  if (
    message.includes(SETTINGS_TABLE) ||
    message.includes("relation") ||
    message.includes("schema cache")
  ) {
    return `Create the ${SETTINGS_TABLE} table before saving Stripe keys.`;
  }

  return message || "Could not load Stripe settings.";
}

function validateStripeKey(value: string, prefix: "sk" | "pk") {
  if (!value) {
    return;
  }

  const pattern = prefix === "sk" ? /^sk_(test|live)_/ : /^pk_(test|live)_/;

  if (!pattern.test(value)) {
    throw new Error(
      prefix === "sk"
        ? "Stripe secret key must start with sk_test_ or sk_live_."
        : "Stripe publishable key must start with pk_test_ or pk_live_.",
    );
  }
}

async function getSavedStripeRows() {
  if (!hasSupabaseAdminEnv()) {
    return { rows: [] as SettingRow[], error: "Supabase admin environment is missing." };
  }

  try {
    const { data, error } = await getSupabaseAdmin()
      .from(SETTINGS_TABLE)
      .select("key,value")
      .in("key", [STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY]);

    if (error) {
      return { rows: [] as SettingRow[], error: getSetupError(error) };
    }

    return { rows: (data ?? []) as SettingRow[], error: null };
  } catch (error) {
    return { rows: [] as SettingRow[], error: getSetupError(error) };
  }
}

function rowValue(rows: SettingRow[], key: string) {
  return rows.find((row) => row.key === key)?.value.trim() || "";
}

export async function getStripeSettingsStatus(): Promise<StripeSettingsStatus> {
  const { rows, error } = await getSavedStripeRows();
  const savedSecretKey = rowValue(rows, STRIPE_SECRET_KEY);
  const savedPublishableKey = rowValue(rows, STRIPE_PUBLISHABLE_KEY);
  const envSecretKey = process.env.STRIPE_SECRET_KEY?.trim() ?? "";
  const envPublishableKey =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ?? "";

  return {
    source: savedSecretKey ? "database" : envSecretKey ? "environment" : "missing",
    secretKey: savedSecretKey || envSecretKey || null,
    publishableKey: savedPublishableKey || envPublishableKey || null,
    maskedSecretKey: maskKey(savedSecretKey || envSecretKey),
    maskedPublishableKey: maskKey(savedPublishableKey || envPublishableKey),
    hasSavedSecretKey: Boolean(savedSecretKey),
    hasSavedPublishableKey: Boolean(savedPublishableKey),
    setupError: error,
  };
}

export async function getActiveStripeSecretKey() {
  const { rows } = await getSavedStripeRows();
  const savedSecretKey = rowValue(rows, STRIPE_SECRET_KEY);

  return savedSecretKey || process.env.STRIPE_SECRET_KEY?.trim() || "";
}

export async function saveStripeSettings(input: {
  secretKey?: string;
  publishableKey?: string;
}) {
  if (!hasSupabaseAdminEnv()) {
    throw new Error("Supabase admin environment is missing.");
  }

  const secretKey = input.secretKey?.trim() ?? "";
  const publishableKey = input.publishableKey?.trim() ?? "";
  const rows: SettingRow[] = [];

  validateStripeKey(secretKey, "sk");
  validateStripeKey(publishableKey, "pk");

  if (secretKey) {
    rows.push({ key: STRIPE_SECRET_KEY, value: secretKey });
  }

  if (publishableKey) {
    rows.push({ key: STRIPE_PUBLISHABLE_KEY, value: publishableKey });
  }

  if (rows.length === 0) {
    throw new Error("Enter at least one Stripe key to save.");
  }

  const { error } = await getSupabaseAdmin()
    .from(SETTINGS_TABLE)
    .upsert(rows, { onConflict: "key" });

  if (error) {
    throw new Error(getSetupError(error));
  }
}

export async function clearSavedStripeSettings() {
  if (!hasSupabaseAdminEnv()) {
    throw new Error("Supabase admin environment is missing.");
  }

  const { error } = await getSupabaseAdmin()
    .from(SETTINGS_TABLE)
    .delete()
    .in("key", [STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY]);

  if (error) {
    throw new Error(getSetupError(error));
  }
}
