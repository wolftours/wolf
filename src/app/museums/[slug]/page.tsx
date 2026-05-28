import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { SiteHeader } from "@/components/SiteHeader";
import {
  getMuseum,
  getProductsForMuseum,
  getStandardAdmissionProduct,
  museums,
} from "@/lib/travel-data";
import styles from "../../detail.module.css";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return museums.map((museum) => ({ slug: museum.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const museum = getMuseum(slug);

  if (!museum) {
    return {};
  }

  return {
    title: `${museum.name} | WolfTours`,
    description: museum.note,
  };
}

export default async function MuseumPage({ params }: PageProps) {
  const { slug } = await params;
  const museum = getMuseum(slug);

  if (!museum) {
    notFound();
  }

  const citySlug = museum.city.toLowerCase();
  const experiences = getProductsForMuseum(museum);
  const standardProduct = getStandardAdmissionProduct(museum);
  const planVisitHref = standardProduct
    ? `/book/${museum.slug}/${standardProduct.slug}`
    : "/#contact";

  return (
    <main className={styles.page}>
      <SiteHeader />

      <section
        className={styles.hero}
        style={{ "--hero-image": `url(${museum.heroImage})` } as CSSProperties}
      >
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.heroVignette} aria-hidden="true" />
        <div className={styles.heroShell}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/cities/${citySlug}`}>{museum.city}</Link>
            <span aria-hidden="true">/</span>
            <span>{museum.name}</span>
          </nav>

          <div className={styles.heroGrid}>
            <div className={styles.heroMain}>
              <p className={styles.heroEyebrow}>{museum.city} · Museum day</p>
              <h1>{museum.name}</h1>
              <p>{museum.note}</p>
            </div>

            <aside className={styles.heroAside}>
              <Link className={styles.heroAsideLink} href={`/cities/${citySlug}`}>
                Check {museum.city} attractions
              </Link>
              <div className={styles.heroAsideCard}>
                <span className={styles.eyebrow}>WolfTours includes</span>
                <ul>
                  <li>Timed entry support</li>
                  <li>Smart room sequence</li>
                  <li>Local pacing advice</li>
                </ul>
              </div>
              <Link className={styles.heroCta} href="#first-product">
                Booking now
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <Reveal>
        <section className={`${styles.shell} ${styles.section}`}>
          <header className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>Book your day</p>
              <h2>The best experiences</h2>
            </div>
            <p className={styles.sectionHeaderCopy}>
              Tickets, audio, or a private guide — pick the rhythm that fits your
              trip.
            </p>
          </header>

          <div className={styles.experienceGrid}>
            {experiences.map((experience, index) => (
              <article
                className={`${styles.experience} ${
                  index === 0 ? styles.experienceFeatured : ""
                }`}
                id={index === 0 ? "first-product" : undefined}
                key={experience.slug}
              >
                <div
                  className={styles.experienceImage}
                  style={{ backgroundImage: `url(${experience.image})` }}
                  aria-hidden="true"
                />
                <div className={styles.experienceBody}>
                  <div className={styles.experienceBadges}>
                    <span>{experience.duration}</span>
                    <span>{experience.meta}</span>
                  </div>
                  <h3>{experience.title}</h3>
                  <p className={styles.meta}>{experience.highlights[0]}</p>
                  <p className={styles.experienceDesc}>{experience.description}</p>
                  <p className={styles.price}>{experience.price}</p>
                  <div className={styles.experienceActions}>
                    <Link
                      className={styles.linkAction}
                      href={`/book/${museum.slug}/${experience.slug}`}
                    >
                      Details
                    </Link>
                    <Link
                      className={styles.btnSolid}
                      href={`/book/${museum.slug}/${experience.slug}`}
                    >
                      Book now
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className={`${styles.shell} ${styles.section} ${styles.story}`}>
          <header className={styles.storyHeader}>
            <p className={styles.eyebrow}>Inside the visit</p>
            <h2>What makes {museum.name} worth a full morning</h2>
            {museum.description[0] ? (
              <p className={styles.storyLead}>{museum.description[0]}</p>
            ) : null}
          </header>

          {museum.storySections && museum.storySections.length > 0 ? (
            <div className={styles.storyRows}>
              {museum.storySections.map((block, index) => (
                <article
                  className={`${styles.storyRow} ${
                    index % 2 === 1 ? styles.storyRowReverse : ""
                  }`}
                  key={block.title}
                >
                  <div
                    className={styles.storyRowImage}
                    style={{ backgroundImage: `url(${block.image})` }}
                    aria-hidden="true"
                  />
                  <div className={styles.storyRowCopy}>
                    <h3>{block.title}</h3>
                    {block.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.storyGrid}>
              <div className={styles.storyCopy}>
                {museum.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div
                className={styles.sideImage}
                style={{ backgroundImage: `url(${museum.image})` }}
                aria-hidden="true"
              />
            </div>
          )}
        </section>
      </Reveal>

      <section className={styles.recommendations}>
        <div className={styles.shell}>
          <div className={styles.recommendationGrid}>
            <div>
              <p className={styles.eyebrow}>Before you go</p>
              <ul>
                {museum.recommendations.map((recommendation) => (
                  <li key={recommendation}>{recommendation}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2>You should keep in mind the closing time</h2>
              <p>
                One hour before closing, most rooms begin to clear. WolfTours keeps
                the route realistic, so you see the highlights without rushing the
                last rooms.
              </p>
              <Link className={styles.linkAction} href="/#contact">
                Ask about timing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Reveal>
        <section className={`${styles.shell} ${styles.section} ${styles.faq}`}>
          <header className={styles.faqHeader}>
            <p className={styles.eyebrow}>Practical details</p>
            <h2>Frequently asked questions</h2>
          </header>
          <div className={styles.faqList}>
            {museum.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </Reveal>

      <section className={styles.ctaBand}>
        <div className={`${styles.shell} ${styles.ctaGrid}`}>
          <div>
            <p className={styles.eyebrowLight}>Ready when you are</p>
            <h2>Build your {museum.city} day around {museum.name}.</h2>
          </div>
          <div className={styles.ctaActions}>
              <Link className={styles.ctaButton} href={planVisitHref}>
              Start planning
            </Link>
            <Link className={styles.ctaGhost} href={`/cities/${citySlug}`}>
              Back to {museum.city}
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
