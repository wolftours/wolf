import { formatDisplayDate, formatMoney } from "@/lib/booking";
import { company } from "@/lib/company-data";
import type { WolfToursOrder } from "@/lib/wolftours-db";

export type BookingConfirmationEmailInput = Pick<
  WolfToursOrder,
  | "reference"
  | "museum_name"
  | "product_title"
  | "city"
  | "visit_date"
  | "entry_time"
  | "adults"
  | "children"
  | "customer_name"
  | "customer_email"
  | "total"
>;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getGuestLabel(order: BookingConfirmationEmailInput) {
  const childLabel =
    order.children > 0
      ? `, ${order.children} child${order.children === 1 ? "" : "ren"}`
      : "";

  return `${order.adults} adult${order.adults === 1 ? "" : "s"}${childLabel}`;
}

export function getBookingConfirmationSubject(order: BookingConfirmationEmailInput) {
  return `Payment received for ${order.product_title} (${order.reference})`;
}

export function renderBookingConfirmationText(order: BookingConfirmationEmailInput) {
  return [
    `Hi ${order.customer_name},`,
    "",
    "Your WolfTours payment has been received. We are checking the selected slot and preparing your voucher and visit notes.",
    "",
    `Reference: ${order.reference}`,
    `Experience: ${order.product_title}`,
    `Museum: ${order.museum_name}`,
    `City: ${order.city}`,
    `Visit date: ${formatDisplayDate(order.visit_date)}`,
    `Entry time: ${order.entry_time}`,
    `Guests: ${getGuestLabel(order)}`,
    `Total paid: ${formatMoney(order.total)}`,
    "",
    `Need help? Reply to this email or contact ${company.email}.`,
    "",
    `${company.brand}`,
  ].join("\n");
}

export function renderBookingConfirmationHtml(order: BookingConfirmationEmailInput) {
  const rows = [
    ["Reference", order.reference],
    ["Experience", order.product_title],
    ["Museum", order.museum_name],
    ["City", order.city],
    ["Visit date", formatDisplayDate(order.visit_date)],
    ["Entry time", order.entry_time],
    ["Guests", getGuestLabel(order)],
    ["Total paid", formatMoney(order.total)],
  ];

  const summaryRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding: 13px 0; color: #667085; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; border-bottom: 1px solid #ece4d7;">${escapeHtml(label)}</td>
          <td style="padding: 13px 0; color: #102033; font-size: 15px; font-weight: 800; text-align: right; border-bottom: 1px solid #ece4d7;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(getBookingConfirmationSubject(order))}</title>
  </head>
  <body style="margin: 0; padding: 0; background: #f6efe4; color: #102033; font-family: Arial, Helvetica, sans-serif;">
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">
      Your WolfTours payment has been received. Your voucher and visit notes are being prepared.
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #f6efe4;">
      <tr>
        <td align="center" style="padding: 32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 640px; overflow: hidden; border-radius: 28px; background: #fffaf2; box-shadow: 0 24px 60px rgba(16, 32, 51, .16);">
            <tr>
              <td style="padding: 34px 34px 28px; background: linear-gradient(135deg, #071827 0%, #1a3557 68%, #b78a2c 140%); color: #ffffff;">
                <p style="margin: 0 0 18px; color: #f5d48c; font-size: 12px; font-weight: 900; letter-spacing: .18em; text-transform: uppercase;">Payment received</p>
                <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 38px; line-height: 1.02; font-weight: 400; letter-spacing: -.04em;">Your museum day is on its way.</h1>
                <p style="margin: 18px 0 0; max-width: 520px; color: rgba(255,255,255,.82); font-size: 16px; line-height: 1.65;">Hi ${escapeHtml(order.customer_name)}, your payment is complete. We are checking the selected slot and preparing your voucher, arrival notes, and visit guidance.</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px 34px 8px;">
                <div style="padding: 18px 20px; border: 1px solid #eadfcd; border-radius: 18px; background: #ffffff;">
                  <p style="margin: 0 0 6px; color: #9a721f; font-size: 12px; font-weight: 900; letter-spacing: .14em; text-transform: uppercase;">Booking reference</p>
                  <p style="margin: 0; color: #102033; font-size: 26px; font-weight: 900; letter-spacing: .04em;">${escapeHtml(order.reference)}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding: 18px 34px 4px;">
                <h2 style="margin: 0; color: #1d3557; font-family: Georgia, 'Times New Roman', serif; font-size: 27px; line-height: 1.12; font-weight: 400;">Booking summary</h2>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 12px; border-collapse: collapse;">
                  ${summaryRows}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 24px 34px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-radius: 18px; background: #faead6;">
                  <tr>
                    <td style="padding: 20px;">
                      <p style="margin: 0 0 10px; color: #1d3557; font-size: 16px; font-weight: 900;">What happens next</p>
                      <ol style="margin: 0; padding-left: 20px; color: #405166; font-size: 14px; line-height: 1.7;">
                        <li>WolfTours confirms the attraction, date, entry time, and ticket count.</li>
                        <li>Your final mobile voucher and route notes are sent to this email address.</li>
                        <li>On visit day, arrive early and follow the entrance notes in your confirmation.</li>
                      </ol>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 4px 34px 34px;">
                <p style="margin: 0; color: #405166; font-size: 14px; line-height: 1.7;">Need help or spotted a mistake? Reply to this email or contact <a href="mailto:${escapeHtml(company.email)}" style="color: #9a721f; font-weight: 800;">${escapeHtml(company.email)}</a> with your booking reference.</p>
                <p style="margin: 22px 0 0; color: #667085; font-size: 12px; line-height: 1.6;">${escapeHtml(company.legalName)} · ${escapeHtml(company.website)} · Independent ticket concierge.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
