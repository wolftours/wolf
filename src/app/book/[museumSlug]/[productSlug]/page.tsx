import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingWidget } from "@/components/BookingWidget";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { formatMoney } from "@/lib/booking";
import { getAdultPackagePrice, getServiceFee } from "@/lib/pricing";
import { getEnrichedProduct } from "@/lib/product-content";
import {
  getAllBookableProducts,
  getMuseum,
  getProductsForMuseum,
} from "@/lib/travel-data";
import { getClosedSlotsForProduct } from "@/lib/wolftours-db";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ museumSlug: string; productSlug: string }>;
};

export function generateStaticParams() {
  return getAllBookableProducts().map((product) => ({
    museumSlug: product.museumSlug,
    productSlug: product.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { museumSlug, productSlug } = await params;
  const product = getEnrichedProduct(museumSlug, productSlug);

  if (!product) {
    return {};
  }

  return {
    title: `Book ${product.title} | WolfTours`,
    description: product.description,
  };
}

export default async function ProductBookingPage({ params }: PageProps) {
  const { museumSlug, productSlug } = await params;
  const product = getEnrichedProduct(museumSlug, productSlug);

  if (!product) {
    notFound();
  }

  const citySlug = product.city.toLowerCase();
  const museum = getMuseum(museumSlug);
  const related = museum
    ? getProductsForMuseum(museum).filter((item) => item.slug !== productSlug)
    : [];
  const closedSlots = await getClosedSlotsForProduct(museumSlug, productSlug);
  const closedSlotKeys = closedSlots.map(
    (slot) => `${slot.visit_date}:${slot.entry_time}`,
  );
  const adultPackagePrice = getAdultPackagePrice(product);
  const serviceFee = getServiceFee(product);

  return (
    <main className={styles.page}>
      <SiteHeader />

      <section
        className={styles.hero}
        style={
          {
            "--hero-image": `url(${product.image})`,
          } as CSSProperties
        }
      >
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.heroVignette} aria-hidden="true" />
        <div className={styles.shell}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/museums/${museumSlug}`}>{product.museumName}</Link>
            <span aria-hidden="true">/</span>
            <span>Book</span>
          </nav>
          <p className={styles.heroEyebrow}>
            {product.city} · {product.meta}
          </p>
          <h1>{product.title}</h1>
          <p className={styles.heroSummary}>
            {product.description} · from {formatMoney(adultPackagePrice)} per
            adult package
          </p>
        </div>
      </section>

      <section className={styles.galleryBand}>
        <div className={styles.shell}>
          <p className={styles.eyebrow}>On the day</p>
          <div className={styles.gallery}>
            {product.gallery.map((src, index) => (
              <div
                className={`${styles.galleryItem} ${
                  index === 0 ? styles.galleryItemLarge : ""
                }`}
                key={src}
                style={{ backgroundImage: `url(${src})` }}
                role="img"
                aria-label={`${product.museumName} visit photo ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.content}>
        <div className={`${styles.shell} ${styles.layout}`}>
          <div className={styles.productMain}>
            <ul className={styles.highlights}>
              {product.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <section className={styles.block}>
              <h2>What&apos;s included</h2>
              <ul className={styles.includedList}>
                {product.included.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className={styles.block}>
              <h2>How your visit flows</h2>
              <ol className={styles.itinerary}>
                {product.itinerary.map((step) => (
                  <li key={step.title}>
                    <span>{step.label}</span>
                    <strong>{step.title}</strong>
                    <p>{step.copy}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className={styles.block}>
              <h2>About this experience</h2>
              <div className={styles.details}>
                {product.details.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            <dl className={styles.metaGrid}>
              <div>
                <dt>Duration</dt>
                <dd>{product.duration}</dd>
              </div>
              <div>
                <dt>Adult package</dt>
                <dd>{formatMoney(adultPackagePrice)}</dd>
              </div>
              <div>
                <dt>Official adult ticket</dt>
                <dd>{formatMoney(product.adultPrice)}</dd>
              </div>
              <div>
                <dt>Service fee</dt>
                <dd>{formatMoney(serviceFee)}</dd>
              </div>
              <div>
                <dt>City</dt>
                <dd>
                  <Link href={`/cities/${citySlug}`}>{product.city}</Link>
                </dd>
              </div>
            </dl>

            <blockquote className={styles.testimonial}>
              <p>&ldquo;{product.testimonial.quote}&rdquo;</p>
              <cite>{product.testimonial.author}</cite>
            </blockquote>

            <div className={styles.policy}>
              <h2>Good to know</h2>
              <ul>
                <li>Mobile tickets accepted — show your confirmation on arrival.</li>
                <li>Arrive 15 minutes before your selected entry time.</li>
                <li>Child tickets are for ages 4-17; under 4 travel free.</li>
                <li>Free cancellation up to 24 hours before your visit.</li>
              </ul>
            </div>

          </div>

          <aside className={styles.bookingAside}>
            <BookingWidget product={product} closedSlots={closedSlotKeys} />
          </aside>
        </div>
      </section>

      {museum?.storySections && museum.storySections.length > 0 ? (
        <section className={styles.visitStoryBand}>
          <div className={styles.shell}>
            <header className={styles.visitStoryHeader}>
              <p className={styles.eyebrow}>Inside the visit</p>
              <h2>What makes {product.museumName} worth your time</h2>
              <p>
                Before you choose a date and ticket count, get a feel for the
                actual route: the building, the atmosphere, the rooms worth
                slowing down for, and the moments that make this visit more than
                a quick entry scan.
              </p>
            </header>

            <div className={styles.visitStoryRows}>
              {museum.storySections.map((block, index) => (
                <article
                  className={`${styles.visitStoryRow} ${
                    index % 2 === 1 ? styles.visitStoryRowReverse : ""
                  }`}
                  key={block.title}
                >
                  <div
                    className={styles.visitStoryImage}
                    style={{ backgroundImage: `url(${block.image})` }}
                    aria-hidden="true"
                  />
                  <div className={styles.visitStoryCopy}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{block.title}</h3>
                    {block.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className={styles.relatedBand}>
          <div className={styles.shell}>
            <div className={styles.relatedHeader}>
              <p className={styles.eyebrow}>Also at this museum</p>
              <h2>More at {product.museumName}</h2>
              <p className={styles.relatedIntro}>
                Other ways to experience {product.museumName} — combine tickets,
                guides, and pacing that fit your trip.
              </p>
            </div>
            <div className={styles.relatedGrid}>
              {related.map((item, index) => (
                <Link
                  className={styles.relatedCard}
                  href={`/book/${museumSlug}/${item.slug}`}
                  key={item.slug}
                >
                  <div
                    className={styles.relatedImage}
                    style={{ backgroundImage: `url(${item.image})` }}
                    aria-hidden="true"
                  />
                  <div className={styles.relatedBody}>
                    <span className={styles.relatedTag}>
                      Option {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3>{item.title}</h3>
                    <p className={styles.relatedMeta}>{item.meta}</p>
                    <p className={styles.relatedPrice}>
                      From {formatMoney(getAdultPackagePrice(item))}
                    </p>
                    <span className={styles.relatedCta}>View & book</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <Link className={styles.floatingBookNow} href="#booking-calendar">
        Book now <span>from {formatMoney(adultPackagePrice)}</span>
      </Link>

      <SiteFooter />
    </main>
  );
}
