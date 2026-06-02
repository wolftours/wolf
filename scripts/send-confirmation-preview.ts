import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { sendBookingConfirmationPreview } from "../src/lib/email";
import type { BookingConfirmationEmailInput } from "../src/lib/booking-confirmation-email";

function loadLocalEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) {
    return;
  }

  const content = readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    process.env[key] ??= valueParts.join("=").replace(/^["']|["']$/g, "");
  }
}

loadLocalEnv();

const recipients = process.argv.slice(2);

if (recipients.length === 0) {
  recipients.push("dznswish41@gmail.com", "puskygabi@proton.me");
}

const previewOrder: BookingConfirmationEmailInput = {
  reference: "WT-PREVIEW",
  museum_name: "Louvre Museum",
  product_title: "Louvre Museum standard admission ticket",
  city: "Paris",
  visit_date: "2026-07-18",
  entry_time: "10:30",
  adults: 2,
  children: 0,
  customer_name: "WolfTours Guest",
  customer_email: recipients[0],
  total: 79.8,
};

async function main() {
  await sendBookingConfirmationPreview(recipients, previewOrder);

  console.log(`Preview confirmation email sent to ${recipients.join(", ")}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
