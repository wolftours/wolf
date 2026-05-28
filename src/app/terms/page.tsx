import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { company, formatCompanyAddress } from "@/lib/company-data";
import styles from "@/app/legal.module.css";

export const metadata: Metadata = {
  title: "Terms & conditions | WolfTours",
  description: `Booking terms for museum tickets and tours sold by ${company.legalName}.`,
};

export default function TermsPage() {
  return (
    <main className={styles.page}>
      <SiteHeader />
      <article className={styles.shell}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Terms &amp; conditions</span>
        </nav>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Legal</p>
          <h1>Terms &amp; conditions</h1>
          <p className={styles.lead}>
            These terms apply when you purchase museum tickets or tour products
            through {company.brand}, operated by {company.legalName}.
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
              Registered: {company.registry}
              <br />
              Share capital: {company.shareCapital}
              <br />
              Email:{" "}
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </p>
          </section>

          <section>
            <h2>Our service</h2>
            <p>
              {company.brand} sells timed museum entry, guided experiences, and
              related travel products as an intermediary and ticket seller. Final
              admission is subject to the rules of each museum or venue.
            </p>
          </section>

          <section>
            <h2>Booking &amp; payment</h2>
            <ul>
              <li>Prices are shown in EUR and include applicable taxes where stated</li>
              <li>A booking is confirmed once payment is received and a confirmation email is sent</li>
              <li>You must provide accurate guest details and arrive on time for your entry slot</li>
              <li>Mobile tickets must be shown at the venue unless otherwise stated</li>
            </ul>
          </section>

          <section>
            <h2>Cancellation &amp; changes</h2>
            <p>
              Free cancellation is available up to 24 hours before the visit
              unless a product page states otherwise. Some partner tickets may
              have stricter rules — these are shown before checkout. Date or
              time changes depend on availability and may incur a service fee.
            </p>
            <p>
              Full refund and cancellation rules are available in our{" "}
              <Link href="/refunds">Refund &amp; cancellation policy</Link>.
            </p>
          </section>

          <section>
            <h2>Refunds</h2>
            <p>
              Approved refunds are returned to the original payment method
              within 5–10 business days. If a museum closes unexpectedly, we
              will offer rebooking or a refund in line with partner policy.
            </p>
          </section>

          <section>
            <h2>Liability</h2>
            <p>
              We are responsible for delivering the booking service we describe.
              We are not liable for delays, closures, or conduct at third-party
              venues beyond our reasonable control. Nothing in these terms limits
              your statutory consumer rights under EU and Slovak law.
            </p>
          </section>

          <section>
            <h2>Governing law</h2>
            <p>
              These terms are governed by the laws of the Slovak Republic.
              Disputes may be brought before the competent courts in Slovakia or
              resolved through approved alternative dispute resolution for
              consumers in the EU.
            </p>
          </section>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
