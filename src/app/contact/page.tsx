import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { company, formatCompanyAddress } from "@/lib/company-data";
import styles from "@/app/legal.module.css";

export const metadata: Metadata = {
  title: "Contact | WolfTours",
  description: `Contact ${company.legalName}, operator of ${company.brand}.`,
};

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <SiteHeader />
      <article className={styles.shell}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Contact</span>
        </nav>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Support</p>
          <h1>Contact WolfTours</h1>
          <p className={styles.lead}>
            Need help with a booking, ticket, refund request, or company
            information? Contact the WolfTours team using the details below.
          </p>
          <p className={styles.meta}>We usually reply within 1-2 business days.</p>
        </header>

        <div className={styles.content}>
          <section>
            <h2>Email support</h2>
            <p>
              General support and booking questions:{" "}
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </p>
            <p>
              For faster handling, include your booking reference, visit date,
              attraction name, and the email used during checkout.
            </p>
          </section>

          <section>
            <h2>Company details</h2>
            <p>
              {company.legalName}
              <br />
              {formatCompanyAddress()}
              <br />
              IČO: {company.ico}
              <br />
              DIČ: {company.dic}
              <br />
              IČ DPH: {company.icDph}
            </p>
          </section>

          <section>
            <h2>Registry information</h2>
            <p>
              {company.registry}
              <br />
              Founded: {company.founded}
              <br />
              Share capital: {company.shareCapital}
            </p>
            <p>
              External registry reference:{" "}
              <a href={company.finstatUrl} rel="noopener noreferrer" target="_blank">
                Finstat company profile
              </a>
            </p>
          </section>

          <section>
            <h2>Legal and policy pages</h2>
            <ul>
              <li>
                <Link href="/privacy">Privacy policy</Link>
              </li>
              <li>
                <Link href="/terms">Terms &amp; conditions</Link>
              </li>
              <li>
                <Link href="/refunds">Refund &amp; cancellation policy</Link>
              </li>
              <li>
                <Link href="/cookies">Cookie policy</Link>
              </li>
            </ul>
          </section>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
