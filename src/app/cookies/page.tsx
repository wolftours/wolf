import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { company, formatCompanyAddress } from "@/lib/company-data";
import styles from "@/app/legal.module.css";

export const metadata: Metadata = {
  title: "Cookie policy | WolfTours",
  description: `How ${company.brand} uses cookies and similar technologies on this website.`,
};

export default function CookiesPage() {
  return (
    <main className={styles.page}>
      <SiteHeader />
      <article className={styles.shell}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Cookie policy</span>
        </nav>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Legal</p>
          <h1>Cookie policy</h1>
          <p className={styles.lead}>
            This page describes how {company.legalName} uses cookies and similar
            technologies on the {company.brand} website.
          </p>
          <p className={styles.meta}>Last updated: June 2026</p>
        </header>

        <div className={styles.content}>
          <section>
            <h2>What are cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit a
              website. They help the site function, remember preferences, and
              understand how pages are used.
            </p>
          </section>

          <section>
            <h2>How we use cookies</h2>
            <ul>
              <li>
                <strong>Essential cookies</strong> — required for navigation,
                security, and booking flow
              </li>
              <li>
                <strong>Preference cookies</strong> — remember choices such as
                language, form state, or your cookie consent choice
              </li>
              <li>
                <strong>Analytics cookies</strong> — help us measure traffic and
                improve the site (only with consent where required)
              </li>
              <li>
                <strong>Advertising cookies</strong> — help measure Google Ads
                performance, limit repeated ads, and show more relevant
                advertising where you have consented
              </li>
            </ul>
          </section>

          <section>
            <h2>Google Ads and analytics cookies</h2>
            <p>
              We may use Google Ads, Google Analytics, conversion tracking,
              remarketing, and similar technologies. These tools can set cookies
              or read identifiers to understand which pages were visited, whether
              an enquiry or booking happened, and how advertising campaigns
              perform.
            </p>
            <p>
              Google advertising and analytics storage is disabled by default.
              If you accept optional cookies in the cookie banner, we update
              Google Consent Mode to allow analytics, advertising measurement,
              ad user data, and ad personalization where permitted by law.
            </p>
            <p>
              Google may combine this information with other data if you are
              signed in to a Google account or have allowed ad personalization.
              You can manage Google ad personalization at{" "}
              <a href="https://adssettings.google.com" rel="noopener noreferrer" target="_blank">
                adssettings.google.com
              </a>{" "}
              and read more at{" "}
              <a href="https://policies.google.com/technologies/cookies" rel="noopener noreferrer" target="_blank">
                Google cookie technologies
              </a>
              .
            </p>
          </section>

          <section>
            <h2>Managing cookies</h2>
            <p>
              You can control cookies through your browser settings. Blocking
              essential cookies may affect booking and site functionality. Where
              required by law, we will ask for consent before placing
              non-essential cookies.
            </p>
            <p>
              Our cookie banner lets you accept or reject optional analytics and
              advertising cookies. We store your choice in your browser so the
              banner does not keep reappearing. You can reopen Cookie settings
              from the site, change your choice, or clear cookies at any time in
              your browser.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              {company.legalName}
              <br />
              {formatCompanyAddress()}
              <br />
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </p>
          </section>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
