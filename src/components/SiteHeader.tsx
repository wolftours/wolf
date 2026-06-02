"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { company } from "@/lib/company-data";
import { cities } from "@/lib/travel-data";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}
    >
      <Link className={styles.brand} href="/#top" aria-label="WolfTours home">
        <Image
          src="/wolftours-logo.png"
          alt="WolfTours"
          width={168}
          height={56}
          className={styles.brandLogo}
          priority
        />
      </Link>
      <p className={styles.siteNotice}>
        {company.website} is managed by {company.legalName} (IČO {company.ico}) ·
        Independent ticket concierge, not affiliated with featured museums or
        attractions.
      </p>
      <nav className={styles.navLinks} aria-label="Main navigation">
        <Link href="/#top">Home</Link>
        <Link href="/#museums">Museums</Link>
        <div className={styles.dropdown}>
          <button type="button" className={styles.dropdownTrigger}>
            Cities
          </button>
          <div className={styles.dropdownMenu}>
            {cities.map((city) => (
              <Link href={`/cities/${city.slug}`} key={city.slug}>
                {city.name}
              </Link>
            ))}
          </div>
        </div>
        <Link href="/#contact">FAQ</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </header>
  );
}
