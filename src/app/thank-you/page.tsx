import Link from "next/link";
import { GoogleAdsConversion } from "@/components/GoogleAdsConversion";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import styles from "@/app/legal.module.css";

const GOOGLE_ADS_PURCHASE_CONVERSION_ID = "AW-18236537339/LUVPCPvNmr4cEPvz7fdD";

type PageProps = {
  searchParams?: Promise<{ session_id?: string }>;
};

export const metadata = {
  title: "Thank you | WolfTours",
  description: "Thank you for booking with WolfTours.",
};

export default async function ThankYouPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};

  return (
    <main className={styles.page}>
      <GoogleAdsConversion
        currency="RON"
        sendTo={GOOGLE_ADS_PURCHASE_CONVERSION_ID}
        transactionId={params.session_id}
      />
      <SiteHeader />
      <div className={styles.shell}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Thank you</span>
        </nav>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Booking received</p>
          <h1>Thank you, your museum day is on its way.</h1>
          <p className={styles.lead}>
            Your payment has been received. A confirmation email is sent right
            away, then we check the selected slot and prepare your voucher,
            arrival notes, and visit guidance.
          </p>
          {params.session_id ? (
            <p className={styles.meta}>Stripe session: {params.session_id}</p>
          ) : null}
        </header>

        <div className={styles.content}>
          <section>
            <h2>What happens next</h2>
            <ul>
              <li>WolfTours confirms the attraction, date, entry time, and ticket count.</li>
              <li>A payment confirmation email is sent to the checkout email address.</li>
              <li>Your mobile voucher and visit notes are emailed after the booking is processed.</li>
              <li>On visit day, arrive early and follow the entrance notes in your confirmation.</li>
            </ul>
          </section>

          <section>
            <h2>Need help?</h2>
            <p>
              If anything looks wrong, send us your name and payment email so we
              can find the booking quickly.
            </p>
            <p>
              <Link href="/contact">Contact WolfTours</Link>
            </p>
          </section>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}

