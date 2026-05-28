import Link from "next/link";
import Image from "next/image";
import { company, formatCompanyAddress } from "@/lib/company-data";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.shell}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <Image
              src="/wolftours-logo.png"
              alt={company.brand}
              width={180}
              height={72}
              className={styles.footerLogo}
            />
            <p>
              {company.subtitle}. Curated museum days in Paris, Rome, and
              Barcelona.
            </p>
            <address className={styles.footerAddress}>
              <strong>{company.legalName}</strong>
              <span>{formatCompanyAddress()}</span>
              <span>
                IČO {company.ico} · DIČ {company.dic}
              </span>
              <span>IČ DPH {company.icDph}</span>
            </address>
          </div>

          <nav className={styles.footerNav} aria-label="Explore">
            <span className={styles.footerNavLabel}>Explore</span>
            <Link href="/#museums">Museums</Link>
            <Link href="/#cities">Cities</Link>
            <Link href="/contact">Contact</Link>
          </nav>

          <nav className={styles.footerNav} aria-label="Legal">
            <span className={styles.footerNavLabel}>Legal</span>
            <Link href="/privacy">Privacy policy</Link>
            <Link href="/terms">Terms &amp; conditions</Link>
            <Link href="/refunds">Refunds &amp; cancellations</Link>
            <Link href="/cookies">Cookie policy</Link>
          </nav>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.footerCopy}>
            © {new Date().getFullYear()} {company.legalName} ({company.brand})
          </p>
          <a
            className={styles.footerRegistry}
            href={company.finstatUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Company registry
          </a>
        </div>
      </div>
    </footer>
  );
}
