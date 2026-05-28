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
  { time: "09:30", label: "Quiet entry window" },
  { time: "12:00", label: "One room, properly" },
  { time: "15:30", label: "Neighborhood pause" },
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
                  <dt>{cityMuseums.length}</dt>
                  <dd>Museum stops</dd>
                </div>
                <div>
                  <dt>1</dt>
                  <dd>Day rhythm</dd>
                </div>
                <div>
                  <dt>AM</dt>
                  <dd>Best entry</dd>
                </div>
              </dl>
              <Link className={styles.heroCta} href="/#contact">
                Start planning
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <Reveal>
        <section className={`${styles.shell} ${styles.cityLayout}`}>
          <aside className={styles.cityIntroSticky}>
            <p className={styles.eyebrow}>Your museums</p>
            <h2>{city.name} museum route</h2>
            <p>
              A focused day built around the museums WolfTours runs here — tickets,
              pacing, and local rhythm included.
            </p>

            <ol className={styles.routeBeats}>
              {routeBeats.map((beat) => (
                <li key={beat.label}>
                  <time>{beat.time}</time>
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
        <section className={`${styles.shell} ${styles.section}`}>
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
