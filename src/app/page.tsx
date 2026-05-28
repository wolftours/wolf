import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Marquee } from "@/components/Marquee";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { company } from "@/lib/company-data";
import { cities, museums } from "@/lib/travel-data";
import styles from "./page.module.css";

const wolfRoute = [
  {
    time: "09:10",
    title: "Enter before the rush",
    copy: "Start with the rooms that lose their magic once the crowds arrive.",
  },
  {
    time: "11:40",
    title: "One masterpiece, properly",
    copy: "Slow down around the work that gives the day its centre of gravity.",
  },
  {
    time: "13:15",
    title: "Local pause",
    copy: "A cafe, a street, a courtyard, something that belongs to the city.",
  },
  {
    time: "16:30",
    title: "Golden-hour finish",
    copy: "End with a view, not another queue.",
  },
];

type PageProps = {
  searchParams?: Promise<{ search?: string }>;
};

function normalizeSearch(value: string | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

export default async function Home({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const searchTerm = normalizeSearch(params.search);
  const filteredMuseums = searchTerm
    ? museums.filter((museum) => {
        const haystack = [
          museum.name,
          museum.city,
          museum.note,
          ...museum.description,
          ...museum.experiences.flatMap((experience) => [
            experience.title,
            experience.description,
            experience.meta,
          ]),
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(searchTerm);
      })
    : museums;
  const filteredCities = searchTerm
    ? cities.filter((city) => {
        const cityMuseums = museums.filter((museum) =>
          city.museumSlugs.includes(museum.slug),
        );
        const haystack = [
          city.name,
          city.copy,
          ...cityMuseums.flatMap((museum) => [
            museum.name,
            museum.note,
            ...museum.experiences.map((experience) => experience.title),
          ]),
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(searchTerm);
      })
    : cities;

  return (
    <main className={styles.page}>
      <SiteHeader />

      <section id="top" className={styles.hero}>
        <div className={`${styles.shell} ${styles.heroPremium}`}>
          <div className={styles.heroPremiumCopy}>
            <p className={styles.heroEyebrow}>WolfTours ticket concierge</p>
            <h1>Global tickets for memorable museum days.</h1>
            <p>
              Curated entry, smart timing, and city routes across Europe&apos;s
              most iconic attractions.
            </p>
            <form className={styles.searchBar} action="/#museums" method="get">
              <label className={styles.srOnly} htmlFor="tour-search">
                Search tours
              </label>
              <input
                id="tour-search"
                name="search"
                placeholder="Search museums, cities, or experiences..."
                type="search"
                defaultValue={params.search ?? ""}
              />
              <button type="submit" aria-label="Search">
                Find tours
              </button>
            </form>
            <div className={styles.heroChips} aria-label="Popular route styles">
              <span>Timed entry</span>
              <span>Private routes</span>
              <span>City rhythm</span>
            </div>
          </div>

          <div className={styles.heroImageFrame}>
            <div className={styles.heroImageBadge}>
              <span>2026</span>
              <strong>Wolf Pack Route</strong>
            </div>
            <Image
              src="/wolftours-hero-brand.png"
              alt="Explore the world's pack - WolfTours"
              width={1024}
              height={434}
              className={styles.heroBannerImage}
              priority
            />
            <div className={styles.heroImageCaption}>
              <span>Paris</span>
              <span>Rome</span>
              <span>Barcelona</span>
            </div>
          </div>
        </div>
      </section>

      <Marquee />

      <Reveal>
        <section
          className={`${styles.shell} ${styles.wolfRoute}`}
          aria-label="WolfTours route style"
        >
          <aside className={styles.routeIntro}>
            <p className={styles.eyebrow}>The Wolf Route</p>
            <h2>We build the day like a good story, not a checklist.</h2>
            <p className={styles.routeIntroCopy}>
              Four beats, one rhythm — entry, focus, pause, and a finish that
              still feels like vacation.
            </p>
          </aside>

          <ol className={styles.routeLine}>
            {wolfRoute.map((stop, index) => (
              <li key={stop.title}>
                <span className={styles.routeIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <time>{stop.time}</time>
                <strong>{stop.title}</strong>
                <p>{stop.copy}</p>
              </li>
            ))}
          </ol>
        </section>
      </Reveal>

      <Reveal className={styles.revealMuseums} delay={80}>
        <section
          id="museums"
          className={`${styles.shell} ${styles.museumSection}`}
        >
          <header className={styles.museumHeader}>
            <div>
              <p className={styles.eyebrow}>Curated picks</p>
              <h2>Top Museums</h2>
            </div>
            <p className={styles.museumHeaderCopy}>
              {searchTerm
                ? `${filteredMuseums.length} result${
                    filteredMuseums.length === 1 ? "" : "s"
                  } for "${params.search}".`
                : "Standard tickets and sharp alternatives — each with a route that respects your time in the gallery."}
            </p>
            <Link className={styles.linkAction} href="#cities">
              Plan by city
            </Link>
          </header>

          <div className={styles.museumGrid}>
            {filteredMuseums.map((museum, index) => (
              <article
                className={`${styles.museumCard} ${
                  index === 0 ? styles.museumFeatured : ""
                }`}
                key={museum.name}
                style={
                  {
                    "--stagger": `${100 + index * 85}ms`,
                  } as CSSProperties
                }
              >
                <div
                  className={styles.museumImage}
                  style={{ backgroundImage: `url(${museum.image})` }}
                  aria-hidden="true"
                />
                <div className={styles.museumInfo}>
                  <span>
                    {String(index + 1).padStart(2, "0")} / {museum.city}
                  </span>
                  <h3>{museum.name}</h3>
                  <Link
                    className={styles.linkAction}
                    href={`/museums/${museum.slug}`}
                  >
                    More info
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className={styles.quoteBand}>
          <div className={`${styles.shell} ${styles.quoteGrid}`}>
            <p className={styles.quoteText}>
              Good tours should feel like a clever friend opened the city for
              you, not like you joined a queue with a headset.
            </p>
            <aside className={styles.quoteAside}>
              <span className={styles.eyebrow}>The Wolf standard</span>
              <p>Small groups. Smart pacing. No checklist tourism.</p>
            </aside>
          </div>
        </section>
      </Reveal>

      <Reveal className={styles.revealCities} delay={100}>
        <section id="cities" className={`${styles.shell} ${styles.citySection}`}>
          <div className={styles.cityTop}>
            <p className={styles.eyebrow}>Signature routes</p>
            <h2>Choose the mood of the trip, not just the city.</h2>
            <p>
              Each destination is shaped around one perfect museum day, a
              beautiful walk, and enough free time to make it feel like yours.
            </p>
          </div>

          <div className={styles.cityMosaic}>
            {filteredCities.map((city, index) => (
              <Link
                className={styles.cityTile}
                href={`/cities/${city.slug}`}
                key={city.name}
                style={
                  {
                    "--stagger": `${120 + index * 110}ms`,
                  } as CSSProperties
                }
              >
                <div
                  className={styles.cityTileImage}
                  style={{ backgroundImage: `url(${city.image})` }}
                  aria-hidden="true"
                />
                <div className={styles.cityTileBody}>
                  <span>Route {String(index + 1).padStart(2, "0")}</span>
                  <h3>{city.name}</h3>
                  <p>{city.copy}</p>
                  <span className={styles.cityTileLink}>Check our attractions</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="contact" className={styles.ctaBand}>
          <div className={`${styles.shell} ${styles.ctaGrid}`}>
            <div>
              <p className={styles.eyebrow}>Ready when you are</p>
              <h2>Build a museum-first European trip with a local rhythm.</h2>
            </div>
            <div className={styles.ctaActions}>
              <a className={styles.ctaButton} href={`mailto:${company.email}`}>
                {company.email}
              </a>
              <Link className={styles.ctaGhost} href="#museums">
                Browse museums
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      <SiteFooter />
    </main>
  );
}
