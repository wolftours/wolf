import {
  getMuseum,
  getProduct,
  type BookableProduct,
  type Museum,
  type MuseumProduct,
} from "./travel-data";

export type ProductItineraryStep = {
  label: string;
  title: string;
  copy: string;
};

export type ProductTestimonial = {
  quote: string;
  author: string;
};

export type EnrichedProduct = BookableProduct & {
  gallery: string[];
  included: string[];
  details: string[];
  itinerary: ProductItineraryStep[];
  testimonial: ProductTestimonial;
};

const PRODUCT_EXTRAS: Record<
  string,
  Partial<
    Pick<EnrichedProduct, "gallery" | "included" | "details" | "itinerary" | "testimonial">
  >
> = {
  "louvre-standard-admission": {
    gallery: [
      "https://images.unsplash.com/photo-1587648415693-4a5362b2ce41?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1610023709598-3881e09811c2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1499634231146-3393ed854a33?auto=format&fit=crop&w=900&q=80",
    ],
    included: [
      "Timed Louvre Museum standard admission",
      "Mobile ticket delivery",
      "WolfTours Louvre entry notes",
      "Suggested masterpiece route",
      "Practical wing and queue guidance",
      "Email support until visit day",
    ],
    details: [
      "This is the clean Louvre ticket: timed access, no unnecessary bundle, and enough WolfTours structure to stop the museum from feeling like a maze. You get the entry window first, then a suggested flow through the pyramid, the Denon wing, and the rooms most first-time visitors care about.",
      "The Louvre is huge, so the goal is not to see everything. The goal is to leave with a clear memory: the palace itself, the scale of the collection, the most famous works, and one or two quieter rooms where the crowd falls away.",
      "Standard admission works best when you arrive early, travel light, and treat the visit as a three-hour route. Add more time if you love antiquities or painting; keep it tight if this is part of a bigger Paris day.",
    ],
    itinerary: [
      {
        label: "Step 01",
        title: "Enter through your timed slot",
        copy: "Arrive with your mobile ticket ready and follow the correct queue notes for standard timed entry.",
      },
      {
        label: "Step 02",
        title: "Read the palace before the paintings",
        copy: "Start with the building context so the rooms feel connected, not like random corridors.",
      },
      {
        label: "Step 03",
        title: "Masterpieces without panic",
        copy: "Move toward Mona Lisa, Winged Victory, and Venus de Milo with pacing tips for the busy rooms.",
      },
      {
        label: "Step 04",
        title: "Choose one calmer finish",
        copy: "End in a quieter wing or step outside toward the Seine while the visit still feels fresh.",
      },
    ],
    testimonial: {
      quote:
        "We only wanted the normal ticket, but the route notes made the Louvre feel possible. No wasted hour wandering in circles.",
      author: "Nora · visited May",
    },
  },
  "louvre-audio-guide": {
    gallery: [
      "https://images.unsplash.com/photo-1587648415693-4a5362b2ce41?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1610023709598-3881e09811c2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1499634231146-3393ed854a33?auto=format&fit=crop&w=900&q=80",
    ],
    included: [
      "Timed Louvre Museum entry",
      "WolfTours audio guide app (EN)",
      "Suggested masterpiece route",
      "Digital map of key wings",
      "Before-you-go timing tips",
      "Email support until visit day",
    ],
    details: [
      "This ticket is built for travelers who want structure without a private guide. You receive a clear entry window, then follow an audio route that connects the pyramid, the Italian galleries, and the museum's most requested rooms.",
      "The app pauses where the museum rewards slow looking — sculpture, scale, and the stories behind the works — rather than pushing you through every wing in one exhausted loop.",
      "Most guests plan around three hours inside. If you love painting and antiquities, add an hour; if you want a greatest-hits pace, the route still works in a tighter window.",
    ],
    itinerary: [
      {
        label: "Step 01",
        title: "Arrive at your entry window",
        copy: "Meet the pyramid queue with your mobile ticket ready. WolfTours notes which line to join for timed entry.",
      },
      {
        label: "Step 02",
        title: "Start the audio route",
        copy: "Begin with the palace context, then move toward the Italian collection and the rooms that set up the masterpieces.",
      },
      {
        label: "Step 03",
        title: "Masterpiece rooms",
        copy: "The route builds toward the most famous works with crowd-smart timing suggestions.",
      },
      {
        label: "Step 04",
        title: "Finish & step into Paris",
        copy: "End with calmer galleries or a final highlight, then walk out into the city while the visit still feels clear.",
      },
    ],
    testimonial: {
      quote:
        "We finally understood what we were looking at. The audio pacing made the Louvre feel manageable, not exhausting.",
      author: "Elena & Marco · visited April",
    },
  },
  "eiffel-tower-standard-admission": {
    gallery: [
      "https://plus.unsplash.com/premium_photo-1719430569503-338fc89eb21f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1679231926688-ef9cdab5ed2f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1570097703229-b195d6dd291f?auto=format&fit=crop&w=900&q=80",
      "https://plus.unsplash.com/premium_photo-1690522008026-ea48d3e1eafd?auto=format&fit=crop&w=900&q=80",
    ],
    included: [
      "Timed Eiffel Tower standard access",
      "Mobile ticket delivery",
      "Security and arrival guidance",
      "Second-floor viewpoint notes",
      "Best nearby photo angle suggestions",
      "WolfTours visit-day support",
    ],
    details: [
      "The Eiffel Tower is simple in theory and messy in practice: security checks, entry pillars, lift queues, weather, summit availability, and visitors arriving from every side of the Champ de Mars. This ticket keeps the essentials clear before you arrive.",
      "WolfTours notes explain how to pace the visit once you are inside. The second floor is often the best balance of height and detail: the Louvre, Sacre-Coeur, Invalides, the river, and the street grid still read clearly from there.",
      "Use this as a focused Paris anchor. It pairs well with a Seine walk, a late Louvre slot, or a relaxed cafe pause nearby, but it needs breathing room around the entry time so the visit does not become a stress sprint.",
    ],
    itinerary: [
      {
        label: "Step 01",
        title: "Arrive at the correct side",
        copy: "Use your entry notes and arrive early enough for security before the timed access window.",
      },
      {
        label: "Step 02",
        title: "Clear security and lift flow",
        copy: "Keep mobile tickets ready and move through the lift process without guessing where to stand.",
      },
      {
        label: "Step 03",
        title: "Read Paris from above",
        copy: "Use the viewpoint notes to identify the river, museums, monuments, and neighborhoods below.",
      },
      {
        label: "Step 04",
        title: "Finish with ground-level photos",
        copy: "Step back toward the Champ de Mars or river bridges for the angles that work best after your visit.",
      },
    ],
    testimonial: {
      quote:
        "The ticket was straightforward, but the arrival notes saved us. We knew where to go and did not waste time around security.",
      author: "Marek · visited July",
    },
  },
  "orsay-standard-admission": {
    gallery: [
      "https://images.unsplash.com/photo-1491238824974-e22b282decba?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1719398026703-0d3f3d162e51?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1680189857535-3f41eb861033?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1641330450794-bc9d81cff4df?auto=format&fit=crop&w=900&q=80",
    ],
    included: [
      "Musee d'Orsay standard admission",
      "Mobile ticket delivery",
      "Impressionist highlight route",
      "Clock-view and station nave notes",
      "Temporary exhibition reminders when relevant",
      "Email support until visit day",
    ],
    details: [
      "Musee d'Orsay is one of the easiest Paris museums to love: grand, bright, compact compared with the Louvre, and full of art people recognize even if they do not know the labels. Standard admission gives you the freedom to move at your pace.",
      "WolfTours shapes that freedom into a route. Start with the building, then move toward the Impressionist and Post-Impressionist rooms, making room for sculpture and the famous clock views rather than treating them as afterthoughts.",
      "This ticket is ideal for a half-day Paris plan. You can visit Orsay in the morning and still have time for the Seine, Saint-Germain, or the Tuileries without feeling like the museum swallowed the whole day.",
    ],
    itinerary: [
      {
        label: "Step 01",
        title: "Enter the former station",
        copy: "Use your mobile ticket and take a moment to read the scale of the old railway hall before the galleries.",
      },
      {
        label: "Step 02",
        title: "Move toward the great color rooms",
        copy: "Follow a route through Monet, Degas, Renoir, Van Gogh, and the rooms that define the collection.",
      },
      {
        label: "Step 03",
        title: "Pause at sculpture and clocks",
        copy: "Balance famous paintings with the station architecture, central nave, and city-framing clock views.",
      },
      {
        label: "Step 04",
        title: "Exit into the Left Bank",
        copy: "Leave with time for the river, a cafe, or a walk toward Saint-Germain.",
      },
    ],
    testimonial: {
      quote:
        "Orsay was the perfect size after the Louvre. The route helped us see the big names and still enjoy the building.",
      author: "Helena · visited April",
    },
  },
  "guggenheim-general": {
    gallery: [
      "https://images.unsplash.com/photo-1636556602097-2435ad5198ef?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1636556590144-7e3189066277?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1716246089868-8cc9a89742e9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1710619364167-63e4e0aa804d?auto=format&fit=crop&w=900&q=80",
    ],
    included: [
      "Timed Guggenheim Museum entry",
      "WolfTours exterior viewpoint map",
      "Suggested atrium + collection route",
      "Temporary exhibition access (when included on date)",
      "Mobile ticket delivery",
      "Visit-day email support",
    ],
    details: [
      "This ticket is for travelers who want the building and the collection without a private guide. You receive a timed slot, then follow a route that starts with the facade and atrium before the galleries pull you in.",
      "The Guggenheim rewards contrast — monumental sculpture beside intimate works, loud color beside quiet rooms. WolfTours marks the stops that give the visit a shape so you do not drift through without a memory.",
      "Plan around two hours inside, plus thirty minutes for the riverfront walk. If a major temporary show is on, add time; we flag that when you book.",
    ],
    itinerary: [
      {
        label: "Step 01",
        title: "Approach the titanium facade",
        copy: "Arrive early enough to walk the exterior. WolfTours notes the best angles before your entry window opens.",
      },
      {
        label: "Step 02",
        title: "Atrium and first wings",
        copy: "Let the height of the central space register, then move into the collection with the suggested route.",
      },
      {
        label: "Step 03",
        title: "Highlights and temporary shows",
        copy: "Focus on the rooms that matter for your date — permanent collection plus any visiting exhibition.",
      },
      {
        label: "Step 04",
        title: "Nervión riverfront finish",
        copy: "Step out toward the water while the building is still in your mind — bridges, light, and old-town Bilbao nearby.",
      },
    ],
    testimonial: {
      quote:
        "We thought we were coming for art and left talking about the building. The route made it feel intentional, not random.",
      author: "Sofia · visited June",
    },
  },
  "guggenheim-guided": {
    gallery: [
      "https://images.unsplash.com/photo-1636556590144-7e3189066277?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1636556602097-2435ad5198ef?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1710619364167-63e4e0aa804d?auto=format&fit=crop&w=900&q=80",
    ],
    included: [
      "Licensed English-speaking guide",
      "Timed museum entry",
      "Architecture + collection narrative",
      "Small group pacing",
      "Q&A during the visit",
      "Post-visit riverfront tips",
    ],
    details: [
      "Ideal for first-time visitors who want Gehry's architecture explained in the same breath as the art it holds.",
      "Your guide connects the museum to Bilbao's reinvention — why this building mattered to the city, and how to read the collection inside it.",
    ],
    itinerary: [
      {
        label: "Step 01",
        title: "Meet your guide outside",
        copy: "Short introduction to the facade and entry logistics before you step inside together.",
      },
      {
        label: "Step 02",
        title: "Atrium and key galleries",
        copy: "Move through the building with context — scale, materials, and the works WolfTours prioritizes.",
      },
      {
        label: "Step 03",
        title: "Wrap on the river",
        copy: "Finish with suggestions for coffee, photos, and the walk along the Nervión.",
      },
    ],
    testimonial: {
      quote: "The guide made Gehry make sense. We would have missed half the story on our own.",
      author: "Tom & Ines · visited September",
    },
  },
  "vatican-skip-line": {
    gallery: [
      "https://images.unsplash.com/photo-1624347061892-822a65656966?auto=format&fit=crop&w=900&q=80",
      "/sistine-chapel.png",
      "https://images.unsplash.com/photo-1601680406053-7898f0564c3b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1651561823300-c501e2462edd?auto=format&fit=crop&w=900&q=80",
    ],
    included: [
      "Reserved Vatican Museums entry",
      "Sistine Chapel access via museum route",
      "WolfTours pacing guide (PDF)",
      "Gallery priority checklist",
      "Mobile vouchers",
      "Dress-code reminder before visit",
    ],
    details: [
      "This is the essential Vatican ticket done properly: a reserved window, a realistic route, and notes that build toward the Sistine Chapel instead of arriving there exhausted.",
      "The museums are long. WolfTours tells you which sections to treat as must-see, which corridors you can move through faster, and when to take a breather before the final room.",
      "Allow three to four hours if you want ancient sculpture, the Raphael Rooms, and a calm minute under Michelangelo's ceiling. Rushing in two hours is possible but rarely satisfying.",
    ],
    itinerary: [
      {
        label: "Step 01",
        title: "Enter on your reserved slot",
        copy: "Join the correct line with mobile tickets and ID. WolfTours confirms the entrance notes for your date.",
      },
      {
        label: "Step 02",
        title: "Ancient galleries & maps",
        copy: "Move through the classical collections without losing energy too early.",
      },
      {
        label: "Step 03",
        title: "Raphael Rooms",
        copy: "Build context before the Chapel — color, papal history, and Renaissance ambition.",
      },
      {
        label: "Step 04",
        title: "Sistine Chapel",
        copy: "Arrive with attention left. Silence, no photos, and a ceiling worth the whole trip.",
      },
    ],
    testimonial: {
      quote:
        "Having a time slot changed everything. We knew where we were going and the Chapel did not feel like chaos.",
      author: "Anna · visited October",
    },
  },
  "vatican-standard-admission": {
    gallery: [
      "https://images.unsplash.com/photo-1624347061892-822a65656966?auto=format&fit=crop&w=900&q=80",
      "/sistine-chapel.png",
      "https://images.unsplash.com/photo-1601680406053-7898f0564c3b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1651561823300-c501e2462edd?auto=format&fit=crop&w=900&q=80",
    ],
    included: [
      "Vatican Museums standard reserved admission",
      "Sistine Chapel access via museum route",
      "Mobile ticket delivery",
      "WolfTours pacing and dress-code notes",
      "Raphael Rooms and gallery priority checklist",
      "Email support until visit day",
    ],
    details: [
      "Standard admission to the Vatican Museums still needs planning. The route is long, the security process is busy, and the Sistine Chapel arrives near the end, exactly when many visitors are already tired.",
      "WolfTours turns the ticket into a realistic visit: where to arrive, what to wear, which galleries to slow down for, and how to keep enough energy for Raphael and Michelangelo.",
      "This is the right choice if you want the essential Vatican experience without a private guide. Give it three to four hours, eat before entering, and do not underestimate the dress code.",
    ],
    itinerary: [
      {
        label: "Step 01",
        title: "Arrive dressed and ready",
        copy: "Shoulders and knees covered, mobile voucher ready, and enough time for security before your reserved entry.",
      },
      {
        label: "Step 02",
        title: "Build through the galleries",
        copy: "Use the priority notes for ancient sculpture, maps, tapestries, and the long corridors.",
      },
      {
        label: "Step 03",
        title: "Raphael before Michelangelo",
        copy: "Slow down in the Raphael Rooms so the Renaissance story has context before the Chapel.",
      },
      {
        label: "Step 04",
        title: "Sistine Chapel finish",
        copy: "No photos, quiet rules, and enough attention left for the ceiling everyone came to see.",
      },
    ],
    testimonial: {
      quote:
        "The Vatican is massive. Having the normal ticket plus clear pacing notes was exactly what we needed.",
      author: "Luca · visited February",
    },
  },
  "vatican-private": {
    gallery: [
      "/sistine-chapel.png",
      "https://images.unsplash.com/photo-1624347061892-822a65656966?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1601680406053-7898f0564c3b?auto=format&fit=crop&w=900&q=80",
    ],
    included: [
      "Private licensed guide",
      "Vatican Museums entry coordination",
      "Custom route for your pace",
      "Sistine Chapel with live context",
      "Skip generic group shuffling",
      "Rome logistics tips after the tour",
    ],
    details: [
      "A private guide turns the Vatican from overwhelming to legible. You choose the emphasis — ancient Rome, Renaissance painting, or a greatest-hits path that still feels thoughtful.",
      "Perfect for travelers who want to ask questions, slow down in key rooms, and reach the Sistine Chapel with a story in mind, not just a crowded finale.",
    ],
    itinerary: [
      {
        label: "Step 01",
        title: "Private meet-up",
        copy: "Your guide aligns expectations and entry timing before you begin the long museum sequence.",
      },
      {
        label: "Step 02",
        title: "Curated gallery path",
        copy: "Ancient sculpture and papal rooms at a pace that matches your group.",
      },
      {
        label: "Step 03",
        title: "Sistine Chapel finish",
        copy: "Michelangelo with context — what you are seeing and why it still matters.",
      },
    ],
    testimonial: {
      quote: "Our guide steered us past the noise. The Chapel finally felt moving, not just famous.",
      author: "David & Priya · visited March",
    },
  },
  "sagrada-standard-admission": {
    gallery: [
      "https://images.unsplash.com/photo-1728249960363-13079cc2c6f6?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1650964827770-421afa7960ac?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1570097703562-2afcbfc7355d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1722545331003-bc5507a8bdf8?auto=format&fit=crop&w=900&q=80",
    ],
    included: [
      "Sagrada Familia standard timed admission",
      "Mobile ticket delivery",
      "Nativity and Passion facade notes",
      "Interior light and symbolism route",
      "Before-you-go entry timing tips",
      "WolfTours visit-day support",
    ],
    details: [
      "Sagrada Familia is easy to photograph and hard to understand without a little structure. Standard admission gets you inside; WolfTours notes help the building speak once you are there.",
      "The visit is about contrast: the Nativity facade's dense storytelling, the Passion facade's severity, and the interior where columns, color, and light turn stone into something almost forest-like.",
      "This ticket is the best starting point for most travelers. It keeps the day simple: timed basilica access, a focused route, and enough context to appreciate Gaudi without turning the visit into a lecture.",
    ],
    itinerary: [
      {
        label: "Step 01",
        title: "Arrive for timed entry",
        copy: "Use your mobile ticket and leave time for security outside the basilica.",
      },
      {
        label: "Step 02",
        title: "Read the facades",
        copy: "Start with the outside story: Nativity detail, Passion geometry, and the building still under construction.",
      },
      {
        label: "Step 03",
        title: "Step into the light",
        copy: "Move inside for columns, stained glass, and the symbolic structure that makes the nave unforgettable.",
      },
      {
        label: "Step 04",
        title: "Leave into Eixample",
        copy: "Finish with space for photos, a cafe, or a walk through Barcelona's modernist grid.",
      },
    ],
    testimonial: {
      quote:
        "We had seen pictures before, but the notes made the symbolism click. The interior was the highlight of Barcelona.",
      author: "Petra · visited June",
    },
  },
};

function uniqueImages(images: string[]) {
  return [...new Set(images)];
}

function defaultGallery(museum: Museum, product: MuseumProduct) {
  return uniqueImages([product.image, museum.heroImage, museum.image]).slice(0, 4);
}

function defaultIncluded(product: MuseumProduct) {
  return [
    `Timed ${product.title.includes("Tour") ? "guided" : "museum"} entry`,
    "Mobile ticket delivery",
    "WolfTours visit-day support",
    "Route and timing suggestions",
    "Flexible guest changes up to 24h",
  ];
}

function defaultDetails(museum: Museum, product: MuseumProduct) {
  return [
    product.description,
    `${museum.name} visits run best with comfortable shoes, a light bag, and a clear entry time. WolfTours keeps the day realistic so you enjoy the rooms you came for.`,
    museum.description[0] ?? "",
  ].filter(Boolean);
}

function defaultItinerary(product: MuseumProduct): ProductItineraryStep[] {
  return [
    {
      label: "Step 01",
      title: "Check in at your time slot",
      copy: "Arrive a little early with your mobile confirmation and ID ready.",
    },
    {
      label: "Step 02",
      title: "Follow the Wolf route",
      copy: `Move through ${product.title} with the pacing notes included in your booking.`,
    },
    {
      label: "Step 03",
      title: "Take the city with you",
      copy: "Leave with time for a coffee, a walk, or the next stop on your trip.",
    },
  ];
}

function defaultTestimonial(city: Museum["city"]): ProductTestimonial {
  return {
    quote:
      "Clear timing, no guesswork at the entrance, and a visit that felt calm instead of rushed.",
    author: `WolfTours guest · ${city}`,
  };
}

export function getEnrichedProduct(museumSlug: string, productSlug: string) {
  const museum = getMuseum(museumSlug);
  const bookable = getProduct(museumSlug, productSlug);
  if (!museum || !bookable) {
    return undefined;
  }
  const product = museum.experiences.find((item) => item.slug === productSlug);
  if (!product) {
    return undefined;
  }
  return enrichProduct(museum, product, bookable);
}

export function enrichProduct(
  museum: Museum,
  product: MuseumProduct,
  bookable: BookableProduct,
): EnrichedProduct {
  const extras = PRODUCT_EXTRAS[product.slug] ?? {};

  return {
    ...bookable,
    gallery: extras.gallery ?? defaultGallery(museum, product),
    included: extras.included ?? defaultIncluded(product),
    details: extras.details ?? defaultDetails(museum, product),
    itinerary: extras.itinerary ?? defaultItinerary(product),
    testimonial: extras.testimonial ?? defaultTestimonial(museum.city),
  };
}
