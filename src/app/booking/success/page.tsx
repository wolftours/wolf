import Link from "next/link";
import { GoogleAdsConversion } from "@/components/GoogleAdsConversion";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { fulfillStripeCheckoutBySessionId } from "@/lib/fulfill-stripe-checkout";
import styles from "@/app/legal.module.css";

const GOOGLE_ADS_PURCHASE_CONVERSION_ID = "AW-18199793120/R2JyCOas2bccEOCbq-ZD";

type PageProps = {
  searchParams?: Promise<{ session_id?: string }>;
};

export const metadata = {
  title: "Payment received | WolfTours",
  description: "Your WolfTours payment has been received.",
};

export default async function BookingSuccessPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};

  if (params.session_id) {
    try {
      await fulfillStripeCheckoutBySessionId(params.session_id);
    } catch (error) {
      console.error("Could not fulfill Stripe checkout:", error);
    }
  }

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
          <span>Payment received</span>
        </nav>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Secure payment complete</p>
          <h1>Thanks, your booking is paid.</h1>
          <p className={styles.lead}>
            We have received your payment and sent a confirmation email. Your
            voucher, arrival notes, and visit flow follow shortly after we
            confirm the ticket details.
          </p>
          {params.session_id ? (
            <p className={styles.meta}>Stripe session: {params.session_id}</p>
          ) : null}
        </header>

        <div className={styles.content}>
          <section>
            <h2>What happens next</h2>
            <ul>
              <li>WolfTours checks the selected time slot and ticket details.</li>
              <li>A payment confirmation email is sent to the email you used at checkout.</li>
              <li>Your voucher and route notes follow after the booking is processed.</li>
              <li>On visit day, arrive a little early and show the mobile voucher at the correct entrance.</li>
            </ul>
          </section>

          <section>
            <h2>Need help?</h2>
            <p>
              If anything looks wrong, contact us with your name and payment
              email so we can find the booking quickly.
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

