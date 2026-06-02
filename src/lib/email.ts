import nodemailer from "nodemailer";
import {
  getBookingConfirmationSubject,
  renderBookingConfirmationHtml,
  renderBookingConfirmationText,
  type BookingConfirmationEmailInput,
} from "@/lib/booking-confirmation-email";
import { company } from "@/lib/company-data";

type EmailAddress = {
  address: string;
  name: string;
};

function getSmtpPort() {
  return Number(process.env.SMTP_PORT ?? 587);
}

function getFromAddress(): EmailAddress {
  return {
    address:
      process.env.SMTP_FROM_EMAIL ??
      process.env.SMTP_USER ??
      company.email,
    name: process.env.SMTP_FROM_NAME ?? company.brand,
  };
}

export function hasEmailEnv() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_APP_PASSWORD,
  );
}

function getTransporter() {
  if (!hasEmailEnv()) {
    throw new Error(
      "Email is not configured. Missing SMTP_HOST, SMTP_USER, or SMTP_APP_PASSWORD.",
    );
  }

  const port = getSmtpPort();

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_APP_PASSWORD,
    },
  });
}

export async function sendBookingConfirmationEmail(
  order: BookingConfirmationEmailInput,
) {
  const from = getFromAddress();

  await getTransporter().sendMail({
    from,
    to: {
      address: order.customer_email,
      name: order.customer_name,
    },
    replyTo: from,
    subject: getBookingConfirmationSubject(order),
    text: renderBookingConfirmationText(order),
    html: renderBookingConfirmationHtml(order),
  });
}

export async function sendBookingConfirmationPreview(
  recipients: string[],
  order: BookingConfirmationEmailInput,
) {
  const from = getFromAddress();

  await getTransporter().sendMail({
    from,
    to: recipients,
    replyTo: from,
    subject: `[Preview] ${getBookingConfirmationSubject(order)}`,
    text: renderBookingConfirmationText(order),
    html: renderBookingConfirmationHtml(order),
  });
}
