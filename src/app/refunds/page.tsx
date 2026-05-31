import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { company, formatCompanyAddress } from "@/lib/company-data";
import styles from "@/app/legal.module.css";

export const metadata: Metadata = {
  title: "Refund & cancellation policy | WolfTours",
  description: `Refund, cancellation, and booking change rules for ${company.brand} museum tickets and tours.`,
};

export default function RefundsPage() {
  return (
    <main className={styles.page}>
      <SiteHeader />
      <article className={styles.shell}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Refund &amp; cancellation policy</span>
        </nav>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Legal</p>
          <h1>Refund &amp; cancellation policy</h1>
          <p className={styles.lead}>
            This policy explains cancellation, refund, and date-change rules for
            museum tickets, attraction tickets, and guided experiences sold by{" "}
            {company.brand}.
          </p>
          <p className={styles.meta}>Last updated: May 2026</p>
        </header>

        <div className={styles.content}>
          <section>
            <h2>Seller</h2>
            <p>
              {company.legalName}
              <br />
              {formatCompanyAddress()}
              <br />
              IČO: {company.ico} · DIČ: {company.dic} · IČ DPH: {company.icDph}
              <br />
              Email: <a href={`mailto:${company.email}`}>{company.email}</a>
            </p>
          </section>

          <section>
            <h2>Standard cancellation window</h2>
            <p>
              Unless the product page or checkout states a stricter rule, most
              WolfTours products can be cancelled free of charge up to 24 hours
              before the scheduled visit time. Cancellation requests made after
              that deadline may be non-refundable because museum and supplier
              tickets are often date-specific.
            </p>
          </section>

          <section>
            <h2>Non-refundable or restricted tickets</h2>
            <p>
              Some museums, attractions, special exhibitions, peak-date tickets,
              and partner-supplied products may be non-refundable or may allow
              changes only under strict conditions. Any stricter rule will be
              shown on the product page, during checkout, or in your booking
              confirmation.
            </p>
          </section>

          <section>
            <h2>Date and time changes</h2>
            <p>
              We will try to help with date or time changes when supplier
              availability allows it. Changes are not guaranteed and may require
              paying a price difference, venue fee, or service fee. Requests made
              close to the visit time may not be possible.
            </p>
          </section>

          <section>
            <h2>No-shows and late arrival</h2>
            <p>
              If you miss your entry time, arrive late, forget required ID, fail
              to meet venue dress-code/security rules, or do not use your ticket,
              the booking may be treated as a no-show and may not be refundable.
            </p>
          </section>

          <section>
            <h2>Venue closure or cancelled tour</h2>
            <p>
              If a venue closes unexpectedly or a tour is cancelled by the
              supplier, we will offer a rebooking where possible or process a
              refund in line with the supplier policy and applicable consumer
              law.
            </p>
          </section>

          <section>
            <h2>How refunds are paid</h2>
            <p>
              Approved refunds are returned to the original payment method.
              Banks and payment providers usually process refunds within 5-10
              business days, although timing can vary by provider.
            </p>
          </section>

          <section>
            <h2>How to request cancellation or refund</h2>
            <p>
              Email <a href={`mailto:${company.email}`}>{company.email}</a> with
              your booking reference, visit date, product name, and the reason
              for the request. We recommend contacting us as early as possible.
            </p>
          </section>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
