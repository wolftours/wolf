import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { SiteHeader } from "@/components/SiteHeader";
import { cities, getCity, getMuseumsForCity } from "@/lib/travel-data";
import styles from "../../detail.module.css";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const routeBeats = [
  { step: "01", label: "Choose an attraction" },
  { step: "02", label: "Open the product page" },
  { step: "03", label: "Book your date and time" },
];

export function generateStaticParams() {
  return cities.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = getCity(slug);

  if (!city) {
    return {};
  }

  return {
    title: `${city.name} Tours | WolfTours`,
    description: city.copy,
  };
}

export default async function CityPage({ params }: PageProps) {
  const { slug } = await params;
  const city = getCity(slug);

  if (!city) {
    notFound();
  }

  const cityMuseums = getMuseumsForCity(city);
  const cityProducts = cityMuseums.flatMap((museum) =>
    museum.experiences.map((product) => ({
      ...product,
      museumName: museum.name,
      museumSlug: museum.slug,
    })),
  );

  return (
    <main className={styles.page}>
      <SiteHeader />

      <section
        className={styles.hero}
        style={{ "--hero-image": `url(${city.image})` } as CSSProperties}
      >
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.heroVignette} aria-hidden="true" />
        <div className={styles.heroShell}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/#cities">Cities</Link>
            <span aria-hidden="true">/</span>
            <span>{city.name}</span>
          </nav>

          <div className={styles.heroGrid}>
            <div className={styles.heroMain}>
              <p className={styles.heroEyebrow}>Signature route</p>
              <h1>{city.name}</h1>
              <p>{city.copy}</p>
            </div>

            <aside className={styles.heroAside}>
              <dl className={styles.heroStats}>
                <div>
                  <dt>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v2a2.5 2.5 0 0 0 0 5v2A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-2a2.5 2.5 0 0 0 0-5v-2Z" />
                      <path d="M9 8v8M15 9.5h-3M15 14.5h-3" />
                    </svg>
                  </dt>
                  <dd>Book your tickets</dd>
                </div>
                <div>
                  <dt>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 3.8 18.5 6v5.4c0 4.2-2.6 7.3-6.5 8.8-3.9-1.5-6.5-4.6-6.5-8.8V6L12 3.8Z" />
                      <path d="m9.5 12.2 1.7 1.7 3.4-3.8" />
                    </svg>
                  </dt>
                  <dd>Secure payment</dd>
                </div>
                <div>
                  <dt>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M7 4.5h8.5L19 8v11.5H7V4.5Z" />
                      <path d="M15 4.5V8h4M10 13l1.6 1.6L15 11.2" />
                    </svg>
                  </dt>
                  <dd>Mobile voucher</dd>
                </div>
              </dl>
              <Link className={styles.heroCta} href="#city-products">
                Book tickets
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <Reveal>
        <section className={`${styles.shell} ${styles.cityLayout}`}>
          <aside className={styles.cityIntroSticky}>
            <p className={styles.eyebrow}>How it works</p>
            <h2>Book {city.name} attractions in a few clicks</h2>
            <p>
              Browse the products available in this city, open the one that
              fits your trip, then choose the visit date, entry time, and ticket
              count.
            </p>

            <ol className={styles.routeBeats}>
              {routeBeats.map((beat) => (
                <li key={beat.label}>
                  <span>{beat.step}</span>
                  <span>{beat.label}</span>
                </li>
              ))}
            </ol>

            <Link className={styles.linkAction} href="/#contact">
              Customize this route
            </Link>
          </aside>

          <div className={styles.museumMosaic}>
            {cityMuseums.map((museum, index) => (
              <Link
                className={`${styles.museumTile} ${
                  index === 0 ? styles.museumTileFeatured : ""
                }`}
                href={`/museums/${museum.slug}`}
                key={museum.slug}
              >
                <div
                  className={styles.museumTileImage}
                  style={{ backgroundImage: `url(${museum.image})` }}
                  aria-hidden="true"
                />
                <div className={styles.museumTileBody}>
                  <span>{String(index + 1).padStart(2, "0")} · Museum</span>
                  <h3>{museum.name}</h3>
                  <p>{museum.note}</p>
                  <span className={styles.museumTileLink}>View museum page</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className={`${styles.shell} ${styles.section}`} id="city-products">
          <header className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>Check our attractions</p>
              <h2>Bookable products in {city.name}</h2>
            </div>
            <p className={styles.sectionHeaderCopy}>
              Pick the exact ticket, guided slot, or city add-on that fits this
              destination.
            </p>
          </header>

          <div className={styles.cityProductGrid}>
            {cityProducts.map((product, index) => (
              <Link
                className={styles.cityProductCard}
                href={`/book/${product.museumSlug}/${product.slug}`}
                key={`${product.museumSlug}-${product.slug}`}
              >
                <div
                  className={styles.cityProductImage}
                  style={{ backgroundImage: `url(${product.image})` }}
                  aria-hidden="true"
                />
                <div className={styles.cityProductBody}>
                  <div className={styles.experienceBadges}>
                    <span>{product.museumName}</span>
                    <span>{product.duration}</span>
                  </div>
                  <span className={styles.museumTileLink}>
                    Option {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{product.title}</h3>
                  <p>{product.meta}</p>
                  <strong>{product.price}</strong>
                  <span className={styles.cityProductCta}>Book this attraction</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      <section className={styles.ctaBand}>
        <div className={`${styles.shell} ${styles.ctaGrid}`}>
          <div>
            <p className={styles.eyebrowLight}>Ready when you are</p>
            <h2>Make {city.name} feel curated, not crowded.</h2>
          </div>
          <div className={styles.ctaActions}>
            <Link className={styles.ctaButton} href="/#contact">
              hello@wolftours.example
            </Link>
            <Link className={styles.ctaGhost} href="/#museums">
              Browse all museums
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
