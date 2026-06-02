import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { company, formatCompanyAddress } from "@/lib/company-data";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact | WolfTours",
  description: `Contact ${company.legalName}, operator of ${company.brand}.`,
};

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <SiteHeader />
      <article>
        <section className={styles.hero}>
          <div className={styles.shell}>
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
                information? Send us the details and we will help you find the
                cleanest next step.
              </p>
              <div className={styles.heroActions}>
                <a className={styles.primaryCta} href={`mailto:${company.email}`}>
                  Email {company.email}
                </a>
                <Link className={styles.secondaryCta} href="/refunds">
                  Refund policy
                </Link>
              </div>
            </header>
          </div>
        </section>

        <div className={`${styles.shell} ${styles.content}`}>
          <section className={styles.supportGrid} aria-label="Support options">
            <div className={styles.supportCard}>
              <span>01</span>
              <h2>Booking support</h2>
              <p>
                For paid bookings, include your booking reference, visit date,
                attraction name, and checkout email.
              </p>
              <a href={`mailto:${company.email}`}>Get booking help</a>
            </div>

            <div className={styles.supportCard}>
              <span>02</span>
              <h2>Ticket changes</h2>
              <p>
                If a date, time, or guest count is wrong, contact us as early as
                possible so we can check supplier options.
              </p>
              <a href={`mailto:${company.email}`}>Request a change</a>
            </div>

            <div className={styles.supportCard}>
              <span>03</span>
              <h2>Refund questions</h2>
              <p>
                Refund timing depends on attraction rules, supplier status, and
                how close the request is to the visit date.
              </p>
              <Link href="/refunds">Read refund rules</Link>
            </div>
          </section>

          <section className={styles.infoPanel}>
            <div>
              <p className={styles.eyebrow}>How to reach us</p>
              <h2>Email support</h2>
              <p>
                General support and booking questions:{" "}
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </p>
              <p className={styles.responseTime}>
                We usually reply within 1-2 business days. Urgent visit-day
                issues are prioritized.
              </p>
            </div>
            <div className={styles.checklist}>
              <h3>Include these details</h3>
              <ul>
                <li>Booking reference, if you have one</li>
                <li>Visit date and attraction name</li>
                <li>Email address used at checkout</li>
                <li>Short description of what changed or what you need</li>
              </ul>
            </div>
          </section>

          <section className={styles.companyPanel}>
            <div>
              <p className={styles.eyebrow}>Company</p>
              <h2>{company.legalName}</h2>
              <p>
                {formatCompanyAddress()}
                <br />
                IČO: {company.ico}
                <br />
                DIČ: {company.dic}
                <br />
                IČ DPH: {company.icDph}
              </p>
            </div>
            <div>
              <p className={styles.eyebrow}>Registry</p>
              <p>
                {company.registry}
                <br />
                Founded: {company.founded}
                <br />
                Share capital: {company.shareCapital}
              </p>
              <a href={company.finstatUrl} rel="noopener noreferrer" target="_blank">
                Finstat company profile
              </a>
            </div>
          </section>

          <section className={styles.policyLinks}>
            <h2>Legal and policy pages</h2>
            <div>
              <Link href="/privacy">Privacy policy</Link>
              <Link href="/terms">Terms &amp; conditions</Link>
              <Link href="/refunds">Refund &amp; cancellation policy</Link>
              <Link href="/cookies">Cookie policy</Link>
            </div>
          </section>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
