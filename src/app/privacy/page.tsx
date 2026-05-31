import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { company, formatCompanyAddress } from "@/lib/company-data";
import styles from "@/app/legal.module.css";

export const metadata: Metadata = {
  title: "Privacy policy | WolfTours",
  description: `How ${company.legalName} processes personal data when you book museum tickets and tours.`,
};

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <SiteHeader />
      <article className={styles.shell}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Privacy policy</span>
        </nav>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Legal</p>
          <h1>Privacy policy</h1>
          <p className={styles.lead}>
            This policy explains how {company.legalName} ({company.brand})
            collects and uses personal data when you browse our website or book
            museum tickets and tours.
          </p>
          <p className={styles.meta}>Last updated: May 2026</p>
        </header>

        <div className={styles.content}>
          <section>
            <h2>Data controller</h2>
            <p>
              {company.legalName}
              <br />
              {formatCompanyAddress()}
              <br />
              IČO: {company.ico} · DIČ: {company.dic} · IČ DPH: {company.icDph}
              <br />
              Email:{" "}
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </p>
          </section>

          <section>
            <h2>What we collect</h2>
            <ul>
              <li>Contact details (name, email, phone) when you enquire or book</li>
              <li>Booking details (museum, date, ticket type, guest counts)</li>
              <li>Payment confirmation references from our payment provider</li>
              <li>Technical data such as IP address, browser type, and cookies</li>
              <li>Marketing and advertising identifiers when you consent to non-essential cookies</li>
            </ul>
          </section>

          <section>
            <h2>Why we use your data</h2>
            <ul>
              <li>To process and confirm your ticket or tour booking</li>
              <li>To send booking confirmations and visit-day support</li>
              <li>To respond to customer service requests</li>
              <li>To comply with accounting, tax, and legal obligations</li>
              <li>To improve our website and measure basic usage (with consent where required)</li>
              <li>To measure advertising performance and prevent irrelevant ads where consent is given</li>
            </ul>
          </section>

          <section>
            <h2>Legal basis</h2>
            <p>
              We process personal data under the GDPR on the basis of contract
              performance (booking), legitimate interest (customer support and
              fraud prevention), legal obligation (tax and accounting), and
              consent where applicable (marketing and non-essential cookies).
            </p>
          </section>

          <section>
            <h2>Analytics, Google Ads, and advertising partners</h2>
            <p>
              We may use Google Analytics, Google Ads conversion tracking,
              remarketing tags, and similar advertising tools to understand how
              visitors find our website and whether advertising leads to bookings
              or enquiries. These tools may use cookies, pixels, device
              identifiers, IP address, browser data, page views, and conversion
              events.
            </p>
            <p>
              Non-essential analytics and advertising cookies are used only where
              required consent has been given. You can manage or withdraw consent
              through your browser or cookie settings. Google may process data
              under its own policies; you can learn more at{" "}
              <a href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank">
                Google Privacy Policy
              </a>{" "}
              and control ad personalization at{" "}
              <a href="https://adssettings.google.com" rel="noopener noreferrer" target="_blank">
                Google Ads Settings
              </a>
              .
            </p>
          </section>

          <section>
            <h2>Who we share data with</h2>
            <ul>
              <li>Ticket suppliers, museums, venues, or local operators needed to fulfil your booking</li>
              <li>Payment, fraud-prevention, email, hosting, analytics, and advertising service providers</li>
              <li>Professional advisers, accountants, authorities, or courts where required by law</li>
            </ul>
            <p>
              We do not sell your personal data. Where providers process data
              outside the European Economic Area, we rely on appropriate
              safeguards such as standard contractual clauses or adequacy
              decisions where applicable.
            </p>
          </section>

          <section>
            <h2>Retention</h2>
            <p>
              Booking and invoice records are kept for the period required by
              Slovak accounting and tax law. Marketing consent can be withdrawn
              at any time. Technical logs are retained only as long as needed
              for security and troubleshooting.
            </p>
          </section>

          <section>
            <h2>Your rights</h2>
            <p>
              You may request access, correction, deletion, restriction,
              portability, or objection to processing. You may also lodge a
              complaint with the Office for Personal Data Protection of the
              Slovak Republic (Úrad na ochranu osobných údajov SR).
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              For privacy requests, email{" "}
              <a href={`mailto:${company.email}`}>{company.email}</a> with the
              subject line &ldquo;Privacy request&rdquo;.
            </p>
          </section>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
