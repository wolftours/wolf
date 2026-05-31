export type MuseumStorySection = {
  title: string;
  image: string;
  paragraphs: string[];
};

export type MuseumProduct = {
  slug: string;
  title: string;
  image: string;
  meta: string;
  price: string;
  adultPrice: number;
  childPrice: number;
  description: string;
  highlights: string[];
  duration: string;
};

export type MuseumFaq = {
  question: string;
  answer: string;
};

export type Museum = {
  slug: string;
  name: string;
  city: "Paris" | "Rome" | "Barcelona";
  image: string;
  heroImage: string;
  note: string;
  description: string[];
  storySections?: MuseumStorySection[];
  facts: string[];
  experiences: MuseumProduct[];
  recommendations: string[];
  faqs: MuseumFaq[];
};

export type City = {
  slug: string;
  name: "Paris" | "Rome" | "Barcelona";
  image: string;
  copy: string;
  museumSlugs: string[];
};

export const museums: Museum[] = [
  {
    slug: "louvre-museum",
    name: "Louvre Museum",
    city: "Paris",
    image:
      "https://images.unsplash.com/photo-1587648415693-4a5362b2ce41?auto=format&fit=crop&w=900&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1499634231146-3393ed854a33?auto=format&fit=crop&w=1800&q=80",
    note: "Masterpieces, hidden wings, and a smooth route through the world's most visited museum.",
    description: [
      "The Louvre is not one museum — it is a palace, a collection, and a walk through centuries of European imagination. WolfTours shapes the day so it feels curated, not crowded.",
    ],
    storySections: [
      {
        title: "A royal palace turned public gallery",
        image:
          "https://images.unsplash.com/photo-1587648415693-4a5362b2ce41?auto=format&fit=crop&w=1200&q=80",
        paragraphs: [
          "Long before it became the world's most visited museum, the Louvre was a fortress, a royal residence, and a symbol of French power. Walking its stone corridors, you still feel that layered history — court life, revolution, empire, and finally the idea that great art belongs to everyone.",
          "We start by framing the building itself: why the rooms feel grand, why the layout surprises you, and why the Louvre is as much architecture as it is painting and sculpture.",
        ],
      },
      {
        title: "Through the pyramid, into the collection",
        image:
          "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=1200&q=80",
        paragraphs: [
          "The glass pyramid is the modern front door, but the visit quickly opens into older wings, long perspectives, and rooms that reward slow looking. WolfTours sequences the entry so you are not fighting the first rush — you move with purpose toward the works that matter most to your day.",
          "This is where the route becomes practical: which wing first, where to pause, and how to avoid spending your best energy in busy bottlenecks before you have seen anything you came for.",
        ],
      },
      {
        title: "Masterpieces with room to breathe",
        image:
          "https://images.unsplash.com/photo-1610023709598-3881e09811c2?auto=format&fit=crop&w=1200&q=80",
        paragraphs: [
          "The Mona Lisa, the Winged Victory of Samothrace, the Venus de Milo — the names everyone knows. We do not skip them, but we do not treat them like a frantic checklist either. You get context, a sensible angle on the crowd, and enough time to actually look.",
          "Along the way there are quieter rooms: Dutch light, Italian drama, French portraits, ancient marble. Those detours are often what make people say the Louvre felt personal, not overwhelming.",
        ],
      },
      {
        title: "Finish before the rooms empty out",
        image:
          "https://images.unsplash.com/photo-1499634231146-3393ed854a33?auto=format&fit=crop&w=1200&q=80",
        paragraphs: [
          "The last hour in a major museum is underrated. Crowds thin, the light shifts, and the building feels closer to what it was before ticket queues and selfie clusters. We plan the day so your final rooms are strong — not whatever is left when you are already tired.",
          "Step outside and Paris is right there: the river, a cafe, the sense that you saw the city through art, not just through a map of famous names.",
        ],
      },
    ],
    facts: [
      "It spans from antiquity to the 19th century",
      "More than 500,000 works are registered in its collection",
      "Around 8.7 million annual visitors",
    ],
    experiences: [
      {
        slug: "louvre-standard-admission",
        title: "Louvre Museum standard admission ticket",
        image:
          "https://images.unsplash.com/photo-1587648415693-4a5362b2ce41?auto=format&fit=crop&w=800&q=80",
        meta: "Standard admission · Timed entry",
        price: "From 35 EUR",
        adultPrice: 35,
        childPrice: 18,
        description:
          "A clean Louvre timed-entry ticket for travelers who want the essential museum access without extras. Get inside with a clear slot, then use WolfTours notes to move through the palace, masterpieces, and calmer wings at a realistic pace.",
        highlights: [
          "Official-style timed entry",
          "Mona Lisa and masterpiece route",
          "WolfTours visit notes",
        ],
        duration: "Approx. 3 hours",
      },
      {
        slug: "louvre-audio-guide",
        title: "Ticket to the Louvre Museum with Audio Guide App",
        image:
          "https://images.unsplash.com/photo-1610023709598-3881e09811c2?auto=format&fit=crop&w=800&q=80",
        meta: "Flexible entry",
        price: "From 55 EUR",
        adultPrice: 55,
        childPrice: 28,
        description:
          "Skip the guesswork with a clear entry window and a WolfTours audio route through the museum's essential rooms and masterpieces.",
        highlights: [
          "Timed entry slot",
          "Self-guided audio app",
          "Room-by-room pacing tips",
        ],
        duration: "Approx. 3 hours",
      },
    ],
    recommendations: [
      "Keep an eye on the closing time",
      "Wear comfortable shoes",
      "Carry ID or passport",
      "Check the museum's room schedule",
      "Plan your route before entering",
    ],
    faqs: [
      {
        question: "How do I get to the museum?",
        answer:
          "Metro lines 1 and 7 stop at Palais Royal–Musée du Louvre; the pyramid entrance is a short walk from there. WolfTours sends your meeting notes and the correct queue for timed tickets before visit day.",
      },
      {
        question: "What are the opening hours of the museum?",
        answer:
          "The Louvre is generally closed on Tuesdays and open from morning until evening on other days, with last entry about one hour before closing. We confirm the exact window for your ticket when you book.",
      },
      {
        question: "Can I take photographs inside the exhibitions?",
        answer:
          "Photography without flash is allowed in most permanent galleries. Some loan exhibitions and specific rooms restrict cameras — signs at each entrance make the rules clear.",
      },
      {
        question: "Is it accessible for people with reduced mobility?",
        answer:
          "Yes. Elevators, step-free routes, and wheelchair access are available in major wings. Tell us your needs when booking and we note the smoothest path through the pyramid and collections.",
      },
      {
        question: "Can I leave my luggage at the museum?",
        answer:
          "Large bags and suitcases must be checked at the cloakroom. Travel light with a small day pack so security and room changes stay quick.",
      },
      {
        question: "Is it necessary to print my ticket?",
        answer:
          "Mobile tickets on your phone are enough for most timed entries. Keep brightness up and your confirmation email handy in case staff ask for the booking reference.",
      },
    ],
  },
  {
    slug: "eiffel-tower",
    name: "Eiffel Tower",
    city: "Paris",
    image:
      "https://images.unsplash.com/photo-1679231926688-ef9cdab5ed2f?auto=format&fit=crop&w=900&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1570097703229-b195d6dd291f?auto=format&fit=crop&w=1800&q=80",
    note: "Paris from the iron icon: timed access, clear entry notes, and skyline pacing without the queue confusion.",
    description: [
      "The Eiffel Tower is not just a viewpoint. It is the moment Paris turns into a panorama: the Seine drawing curves through the city, the Louvre and Invalides lining up below, and the whole street pattern suddenly making sense.",
      "WolfTours treats the tower like a timed experience, not a random queue. We help you choose the right entry window, understand summit versus second-floor access, and leave enough time around security, lifts, and photos.",
    ],
    storySections: [
      {
        title: "Approach through the Champ de Mars",
        image:
          "https://plus.unsplash.com/premium_photo-1719430569503-338fc89eb21f?auto=format&fit=crop&w=1200&q=80",
        paragraphs: [
          "The best Eiffel Tower visit starts before the ticket scanner. The lawns, bridges, and river angles all build the drama of the structure before you stand beneath it.",
          "We note the practical approach: where to arrive, how security works, and why a little buffer time keeps the day from feeling stressed.",
        ],
      },
      {
        title: "Second floor views with Paris in layers",
        image:
          "https://images.unsplash.com/photo-1679231926688-ef9cdab5ed2f?auto=format&fit=crop&w=1200&q=80",
        paragraphs: [
          "The second floor is where many guests get the strongest city view. Landmarks are close enough to recognize, streets still have shape, and the river connects everything.",
          "WolfTours pacing notes point out what to look for in each direction so the view becomes a map of your Paris day, not just a photo stop.",
        ],
      },
      {
        title: "Summit option and the long horizon",
        image:
          "https://images.unsplash.com/photo-1570097703229-b195d6dd291f?auto=format&fit=crop&w=1200&q=80",
        paragraphs: [
          "When summit access is available, the mood changes: higher, windier, and more about the horizon than street-level detail. It is spectacular, but it adds time.",
          "We help travelers decide if the summit is worth it for their day, especially when pairing the tower with the Louvre, Orsay, or an evening cruise.",
        ],
      },
    ],
    facts: [
      "Built for the 1889 World's Fair",
      "Second-floor and summit access depend on ticket type",
      "Security queues are separate from lift queues",
    ],
    experiences: [
      {
        slug: "eiffel-tower-standard-admission",
        title: "Eiffel Tower standard admission ticket",
        image:
          "https://images.unsplash.com/photo-1679231926688-ef9cdab5ed2f?auto=format&fit=crop&w=800&q=80",
        meta: "Standard admission · Timed access",
        price: "From 42 EUR",
        adultPrice: 42,
        childPrice: 24,
        description:
          "Timed Eiffel Tower access with WolfTours arrival notes, viewpoint pacing, and practical guidance for security, lifts, and the best photo angles before and after your slot.",
        highlights: [
          "Timed tower access",
          "Second-floor viewpoint notes",
          "Arrival and security guidance",
        ],
        duration: "Approx. 2 hours",
      },
    ],
    recommendations: [
      "Arrive at least 25 minutes before your slot",
      "Check if your ticket includes summit access",
      "Bring a light jacket for wind on upper levels",
      "Pair daytime views with a nearby Seine walk",
      "Keep your phone battery charged for mobile tickets",
    ],
    faqs: [
      {
        question: "Does standard admission include the summit?",
        answer:
          "Not always. Eiffel Tower tickets are sold by access level. This product is built around standard timed access; when summit inventory is available, WolfTours labels it clearly before booking.",
      },
      {
        question: "How early should I arrive?",
        answer:
          "Plan to arrive 25-30 minutes before the printed entry time. Security, ticket checks, and lift movement can take longer in peak periods.",
      },
      {
        question: "Is the Eiffel Tower good with children?",
        answer:
          "Yes, but keep the visit realistic. The lifts, crowds, and height can be tiring, so we recommend a focused second-floor visit rather than overloading the day.",
      },
    ],
  },
  {
    slug: "musee-d-orsay",
    name: "Musee d'Orsay",
    city: "Paris",
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1800&q=80",
    note: "Impressionists, sculpture, and a former railway station that makes Paris feel golden.",
    description: [
      "Musee d'Orsay is the Paris museum for travelers who want beauty without the Louvre's scale. The building itself is half the pleasure: a grand railway station transformed into galleries of light, clocks, sculpture, and color.",
      "WolfTours builds the visit around the Impressionist rooms, the central nave, and the moments where the station architecture makes the art feel cinematic.",
    ],
    storySections: [
      {
        title: "A railway station turned art cathedral",
        image:
          "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
        paragraphs: [
          "The old Gare d'Orsay still shapes the visit: long views, iron, glass, and a central nave that feels more like a film set than a traditional museum.",
          "We start with the building so the galleries make sense as a journey through Paris in transition — industrial, modern, and suddenly full of color.",
        ],
      },
      {
        title: "Impressionist rooms with real breathing space",
        image:
          "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
        paragraphs: [
          "Monet, Renoir, Degas, Van Gogh, Cezanne — the names are huge, but the museum can still feel human when you move through it with a clear order.",
          "WolfTours pacing avoids the trap of stopping at every canvas. You focus on the rooms that tell the strongest story and leave space to enjoy them.",
        ],
      },
      {
        title: "Clock views and a left-bank finish",
        image:
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
        paragraphs: [
          "The famous clock views are more than a photo. They place the museum back inside Paris, with the city framed through time, glass, and metal.",
          "After the visit, the Seine and Saint-Germain are right there. We keep the schedule loose enough for a walk, a cafe, or a bridge crossing toward the Tuileries.",
        ],
      },
    ],
    facts: [
      "Housed in a former Beaux-Arts railway station",
      "Famous for Impressionist and Post-Impressionist collections",
      "A more compact alternative to a full Louvre day",
    ],
    experiences: [
      {
        slug: "orsay-standard-admission",
        title: "Musee d'Orsay standard admission ticket",
        image:
          "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80",
        meta: "Standard admission · Timed entry",
        price: "From 24 EUR",
        adultPrice: 24,
        childPrice: 12,
        description:
          "Standard admission to Musee d'Orsay with a WolfTours route through the station nave, Impressionist highlights, sculpture levels, and the clock-view moments that make the museum unforgettable.",
        highlights: [
          "Timed museum entry",
          "Impressionist highlight route",
          "Clock-view and gallery pacing notes",
        ],
        duration: "Approx. 2-3 hours",
      },
    ],
    recommendations: [
      "Start with the upper Impressionist rooms if crowds are building",
      "Leave time for the central sculpture nave",
      "Do not skip the clock views",
      "Pair with a Seine walk or Tuileries crossing",
      "Check temporary exhibition access before arrival",
    ],
    faqs: [
      {
        question: "How long does Musee d'Orsay take?",
        answer:
          "Most travelers are happy with two to three hours. Art lovers can stay longer, but the WolfTours route keeps the visit focused around the strongest rooms.",
      },
      {
        question: "Is Orsay easier than the Louvre?",
        answer:
          "Yes. It is still a major museum, but the scale is more manageable and the collection has a clearer emotional arc for many first-time visitors.",
      },
      {
        question: "Are the famous clock views included?",
        answer:
          "Yes, the clock areas are inside the museum route. Access can shift during maintenance or events, but the standard visit normally includes them.",
      },
    ],
  },
  {
    slug: "guggenheim-museum",
    name: "Guggenheim Museum",
    city: "Barcelona",
    image:
      "https://images.unsplash.com/photo-1636556602097-2435ad5198ef?auto=format&fit=crop&w=900&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1636556590144-7e3189066277?auto=format&fit=crop&w=1800&q=80",
    note: "Frank Gehry's titanium curves, contemporary masters, and the Nervión riverfront — a museum that is the artwork.",
    description: [
      "The Guggenheim Bilbao changed how cities think about culture. WolfTours treats the visit as architecture, collection, and riverfront rhythm — not a quick lap around the galleries.",
      "From the titanium facade to the atrium and contemporary wings, we sequence the day so Gehry's building and the art inside feel like one story.",
    ],
    storySections: [
      {
        title: "A building that changed a waterfront",
        image:
          "https://images.unsplash.com/photo-1636556602097-2435ad5198ef?auto=format&fit=crop&w=1200&q=80",
        paragraphs: [
          "Before you step inside, the museum already tells a story: titanium scales, impossible curves, and light that slides across the facade like water. Gehry designed a structure that feels in motion — and Bilbao built a whole urban story around it.",
          "We start outside: how to read the volumes, where to stand for the best angles, and why this building belongs in every conversation about 21st-century architecture.",
        ],
      },
      {
        title: "Inside the atrium — space as sculpture",
        image:
          "https://images.unsplash.com/photo-1636556590144-7e3189066277?auto=format&fit=crop&w=1200&q=80",
        paragraphs: [
          "The central atrium is the museum's breathing room: catwalks, glass, height, and a sense that you are inside a machine made for looking. WolfTours notes where to pause so the scale registers before you rush into the galleries.",
          "From here the collection unfolds in wings that reward curiosity rather than a strict chronological march.",
        ],
      },
      {
        title: "Contemporary works that reward slow looking",
        image:
          "https://images.unsplash.com/photo-1716246089868-8cc9a89742e9?auto=format&fit=crop&w=1200&q=80",
        paragraphs: [
          "The permanent and temporary shows move from bold sculpture to painting, installation, and film. Some rooms are quiet and contemplative; others are deliberately provocative.",
          "We highlight the pieces and rooms that give the visit a spine — so you leave with a clear memory, not a blur of white walls.",
        ],
      },
      {
        title: "River walk and golden hour",
        image:
          "https://images.unsplash.com/photo-1710619364167-63e4e0aa804d?auto=format&fit=crop&w=1200&q=80",
        paragraphs: [
          "The museum sits on the Nervión estuary. After your slot, the riverfront walk, bridges, and old-town lanes are part of the experience WolfTours builds into the day.",
          "Barcelona guests often pair this stop with a longer northern Spain route — we keep timing realistic so Bilbao feels like a destination, not a whistle-stop.",
        ],
      },
    ],
    facts: [
      "Opened in 1997 and credited with transforming Bilbao's waterfront",
      "Designed by Frank Gehry with titanium, limestone, and glass",
      "Hosts major rotating exhibitions alongside the permanent collection",
    ],
    experiences: [
      {
        slug: "guggenheim-general",
        title: "Guggenheim Museum general admission",
        image:
          "https://images.unsplash.com/photo-1636556602097-2435ad5198ef?auto=format&fit=crop&w=800&q=80",
        meta: "Timed entry",
        price: "From 18 EUR",
        adultPrice: 18,
        childPrice: 10,
        description:
          "Timed entry to the Guggenheim with a WolfTours route through the atrium, collection highlights, and the best exterior viewpoints.",
        highlights: ["Timed entry", "Collection route", "Exterior photo stops"],
        duration: "Approx. 2 hours",
      },
      {
        slug: "guggenheim-guided",
        title: "Guggenheim architecture & art guided tour",
        image:
          "https://images.unsplash.com/photo-1636556590144-7e3189066277?auto=format&fit=crop&w=800&q=80",
        meta: "Small group · EN guide",
        price: "From 48 EUR",
        adultPrice: 48,
        childPrice: 32,
        description:
          "A guide connects Gehry's building to the works inside — ideal for first visits and anyone who wants context, not just photos.",
        highlights: ["Licensed guide", "Architecture + collection", "Skip the guesswork"],
        duration: "Approx. 2.5 hours",
      },
    ],
    recommendations: [
      "Walk the full exterior before or after your slot",
      "Check the temporary exhibition schedule online",
      "Wear layers — the atrium can feel cool",
      "Allow 30 minutes for the riverfront after your visit",
      "Photography rules vary by exhibition — read signs in each room",
    ],
    faqs: [
      {
        question: "How long should I plan for the visit?",
        answer:
          "Allow about two hours for the collection and atrium, plus thirty minutes to walk the titanium facade and riverfront. Major temporary shows can add another 45–60 minutes.",
      },
      {
        question: "Is the museum in Bilbao easy to reach from Barcelona?",
        answer:
          "Bilbao is roughly one hour by air or about five to six hours by train or car from Barcelona. WolfTours schedules this as a full northern Spain day or an overnight — not a same-morning round trip.",
      },
      {
        question: "Are temporary exhibitions included in general admission?",
        answer:
          "Most dated tickets include the exhibitions running on that day. When a blockbuster show is ticketed separately, we flag it at checkout so you are not surprised at the door.",
      },
      {
        question: "Is there a dress code?",
        answer:
          "No formal dress code for the Guggenheim. Comfortable shoes matter more — you will stand on stone and move between levels in the atrium and galleries.",
      },
      {
        question: "Can I visit the exterior without a ticket?",
        answer:
          "Yes. The plaza, river walk, and famous facade angles are public. Many guests arrive early to photograph the building, then enter on their timed slot.",
      },
      {
        question: "Is the museum accessible for wheelchairs and strollers?",
        answer:
          "The museum is largely accessible with ramps and elevators connecting major areas. Strollers are allowed; check current rules for any temporary exhibition floors.",
      },
    ],
  },
  {
    slug: "vatican-museums",
    name: "Vatican Museums",
    city: "Rome",
    image:
      "https://images.unsplash.com/photo-1624347061892-822a65656966?auto=format&fit=crop&w=900&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1604051724595-d79e6bedf54f?auto=format&fit=crop&w=1800&q=80",
    note: "Ancient sculpture, Raphael's rooms, and the Sistine Chapel — one of the world's great museum journeys.",
    description: [
      "The Vatican Museums are not a single building but a sequence of worlds: courtyards, papal apartments, long galleries, and finally the Sistine Chapel. WolfTours shapes the day so the climax still feels sacred, not rushed.",
      "Ancient sculpture, Raphael's rooms, and Michelangelo's ceiling each deserve attention — we help you spend it where it counts instead of drifting through corridors.",
    ],
    storySections: [
      {
        title: "Courtyards, maps, and the scale of Rome",
        image:
          "https://images.unsplash.com/photo-1624347061892-822a65656966?auto=format&fit=crop&w=1200&q=80",
        paragraphs: [
          "You enter through spaces that already feel historic — stone, coats of arms, and the sense that every corridor has been walked for centuries. The route quickly opens into collections that span continents and millennia.",
          "WolfTours sets expectations early: this is a long museum when done properly. We help you decide what to prioritize before fatigue sets in.",
        ],
      },
      {
        title: "Ancient sculpture and the Belvedere",
        image:
          "https://images.unsplash.com/photo-1604051724595-d79e6bedf54f?auto=format&fit=crop&w=1200&q=80",
        paragraphs: [
          "The classical rooms are where many visitors fall in love with the museum: marble that still feels alive, portraits of emperors, and mythological scenes carved with impossible skill.",
          "These galleries reward slow movement — a bench, a second look, a moment to read the label instead of photographing and moving on.",
        ],
      },
      {
        title: "Raphael's rooms and the path to the Chapel",
        image:
          "https://images.unsplash.com/photo-1624347061892-822a65656966?auto=format&fit=crop&w=1200&q=80",
        paragraphs: [
          "The Raphael Rooms are a masterclass in Renaissance ambition — color, perspective, and papal power translated into paint. They also mark the emotional build toward the Sistine Chapel.",
          "WolfTours sequences this section so you arrive at Michelangelo with context, not as a tired traveler who only remembers the crowd.",
        ],
      },
      {
        title: "The Sistine Chapel — quiet rules, loud impact",
        image:
          "https://images.unsplash.com/photo-1604051724595-d79e6bedf54f?auto=format&fit=crop&w=1200&q=80",
        paragraphs: [
          "No photography, no noise, and a ceiling that rewires how you think about human ability. The visit rules are strict for good reason — the space is still a chapel.",
          "We plan your slot and route so this final room lands when you still have attention left, then you step back into Rome with the city at your feet.",
        ],
      },
    ],
    facts: [
      "The route culminates in the Sistine Chapel",
      "Collections span ancient Rome, Renaissance art, and modern religious works",
      "One of the most visited museum complexes in the world",
    ],
    experiences: [
      {
        slug: "vatican-standard-admission",
        title: "Vatican Museums standard admission ticket",
        image:
          "https://images.unsplash.com/photo-1624347061892-822a65656966?auto=format&fit=crop&w=800&q=80",
        meta: "Standard admission · Sistine Chapel route",
        price: "From 29 EUR",
        adultPrice: 29,
        childPrice: 18,
        description:
          "Standard reserved admission to the Vatican Museums with the Sistine Chapel route included, plus WolfTours pacing notes for the long galleries, Raphael Rooms, dress code, and arrival timing.",
        highlights: [
          "Reserved museum entry",
          "Sistine Chapel included",
          "Dress-code and route notes",
        ],
        duration: "Approx. 3-4 hours",
      },
      {
        slug: "vatican-skip-line",
        title: "Vatican Museums & Sistine Chapel entry",
        image:
          "https://images.unsplash.com/photo-1604051724595-d79e6bedf54f?auto=format&fit=crop&w=800&q=80",
        meta: "Skip-the-line slot",
        price: "From 32 EUR",
        adultPrice: 32,
        childPrice: 20,
        description:
          "Reserved entry with a clear time window and WolfTours pacing notes from the galleries through the Sistine Chapel.",
        highlights: ["Timed entry", "Sistine Chapel included", "Mobile vouchers"],
        duration: "Approx. 3-4 hours",
      },
      {
        slug: "vatican-private",
        title: "Private Vatican Museums tour",
        image:
          "https://images.unsplash.com/photo-1624347061892-822a65656966?auto=format&fit=crop&w=800&q=80",
        meta: "Small private group",
        price: "From 175 EUR",
        adultPrice: 175,
        childPrice: 95,
        description:
          "Private guide through the essential galleries — ancient sculpture, Raphael, and Michelangelo with context at every stage.",
        highlights: ["Private licensed guide", "Custom pacing", "Sistine Chapel finish"],
        duration: "3 hours",
      },
    ],
    recommendations: [
      "Shoulders and knees covered — dress code enforced",
      "Arrive 20 minutes before your entry window",
      "Travel light; large bags must be checked",
      "Eat before you enter — food inside is limited",
      "Wednesday mornings are often quieter than weekends",
    ],
    faqs: [
      {
        question: "Is the Sistine Chapel included in this ticket?",
        answer:
          "Yes. The standard museum route ends in the Sistine Chapel. WolfTours pacing notes build toward that room so you arrive with energy and context, not at the end of exhaustion.",
      },
      {
        question: "What should I wear for the Vatican Museums?",
        answer:
          "Shoulders and knees must be covered — the dress code is enforced at security. Hats off in the Sistine Chapel. Light layers help in long galleries.",
      },
      {
        question: "How do I get to the museum entrance?",
        answer:
          "Use the Viale Vaticano entrance for most pre-booked tickets. Metro A to Ottaviano–San Pietro, then a ten-minute walk. We send a map pin and the correct gate for your voucher type.",
      },
      {
        question: "What are the opening hours?",
        answer:
          "Hours vary by season and often extend on Friday evenings in summer. Your timed slot is the important detail — arrive twenty minutes early to clear security.",
      },
      {
        question: "Can I take photos inside the museums?",
        answer:
          "Photography is allowed in many galleries without flash. The Sistine Chapel strictly forbids photos and video — guards enforce silence and no cameras.",
      },
      {
        question: "Is the visit accessible with reduced mobility?",
        answer:
          "Parts of the route are accessible with elevators and alternative paths, but the full museum walk is long. Contact us before booking if you need a step-minimized route.",
      },
      {
        question: "Do children need a separate ticket?",
        answer:
          "Most ages require their own ticket for entry and the Sistine Chapel route. Child pricing is shown at checkout; bring ID if your child is near a age bracket boundary.",
      },
    ],
  },
  {
    slug: "sagrada-familia",
    name: "Sagrada Familia",
    city: "Barcelona",
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=900&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1800&q=80",
    note: "Gaudi's light, symbols, and towers explained without the overwhelm.",
    description: [
      "Sagrada Familia is Gaudi's unfinished masterpiece and one of Europe's most expressive sacred buildings.",
      "The route focuses on light, structure, symbolism, and the story of a building still growing in front of the city.",
    ],
    facts: ["Gaudi masterpiece", "Barcelona icon", "Tower options available"],
    experiences: [
      {
        slug: "sagrada-standard-admission",
        title: "Sagrada Familia standard admission ticket",
        image:
          "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80",
        meta: "Standard admission · Timed entry",
        price: "From 26 EUR",
        adultPrice: 26,
        childPrice: 15,
        description:
          "Standard timed entry to Sagrada Familia with WolfTours notes on the Nativity and Passion facades, the interior light, Gaudi symbolism, and how to pace the basilica without rushing.",
        highlights: [
          "Timed basilica entry",
          "Facade and interior route",
          "Gaudi symbolism notes",
        ],
        duration: "Approx. 1.5-2 hours",
      },
      {
        slug: "sagrada-basilica",
        title: "Sagrada Familia basilica entry",
        image:
          "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80",
        meta: "Timed entry",
        price: "From 28 EUR",
        adultPrice: 28,
        childPrice: 16,
        description:
          "Timed entry to Gaudi's basilica with notes on light, symbolism, and the best interior viewpoints.",
        highlights: ["Timed entry", "Interior audio notes", "Facade context"],
        duration: "Approx. 1.5-2 hours",
      },
      {
        slug: "sagrada-towers",
        title: "Sagrada Familia entry with tower access",
        image:
          "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80",
        meta: "Tower option",
        price: "From 38 EUR",
        adultPrice: 38,
        childPrice: 22,
        description:
          "Basilica entry plus tower access when available — skyline views and Gaudi details up close.",
        highlights: ["Basilica + tower", "Timed entry", "City views"],
        duration: "Approx. 2.5 hours",
      },
    ],
    recommendations: ["Book timed entry", "Visit in good daylight", "Look up often"],
    faqs: [
      {
        question: "Are towers included?",
        answer:
          "Only if you book a tower ticket. Basilica-only entry does not include tower access — WolfTours labels each product clearly so you pick the height you want.",
      },
      {
        question: "How long should I plan for the visit?",
        answer:
          "Plan 90 minutes inside for the nave and facades; add another hour if you include a tower climb and security queue.",
      },
    ],
  },
];

export const cities: City[] = [
  {
    slug: "paris",
    name: "Paris",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
    copy: "Art walks, cafe stops, royal palaces, and museum days built at a human pace.",
    museumSlugs: ["louvre-museum", "eiffel-tower", "musee-d-orsay"],
  },
  {
    slug: "rome",
    name: "Rome",
    image:
      "https://images.unsplash.com/photo-1624347061892-822a65656966?auto=format&fit=crop&w=900&q=80",
    copy: "Ancient streets, sacred art, espresso breaks, and stories layered over centuries.",
    museumSlugs: ["vatican-museums"],
  },
  {
    slug: "barcelona",
    name: "Barcelona",
    image:
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=900&q=80",
    copy: "Modernist architecture, Mediterranean rhythm, and colorful neighborhood routes.",
    museumSlugs: ["guggenheim-museum", "sagrada-familia"],
  },
];

export function getMuseum(slug: string) {
  return museums.find((museum) => museum.slug === slug);
}

export function getCity(slug: string) {
  return cities.find((city) => city.slug === slug);
}

export function getMuseumsForCity(city: City) {
  return city.museumSlugs
    .map((slug) => getMuseum(slug))
    .filter((museum): museum is Museum => Boolean(museum));
}

export type BookableProduct = MuseumProduct & {
  museumSlug: string;
  museumName: string;
  city: Museum["city"];
};

export function getProductsForMuseum(museum: Museum): MuseumProduct[] {
  return museum.experiences;
}

export function getStandardAdmissionProduct(museum: Museum): MuseumProduct | undefined {
  return (
    museum.experiences.find((product) => product.slug.includes("standard-admission")) ??
    museum.experiences[0]
  );
}

export function getProduct(museumSlug: string, productSlug: string) {
  const museum = getMuseum(museumSlug);
  if (!museum) {
    return undefined;
  }

  const product = museum.experiences.find((item) => item.slug === productSlug);
  if (!product) {
    return undefined;
  }

  return {
    ...product,
    museumSlug: museum.slug,
    museumName: museum.name,
    city: museum.city,
  } satisfies BookableProduct;
}

export function getAllBookableProducts(): BookableProduct[] {
  return museums.flatMap((museum) =>
    museum.experiences.map((product) => ({
      ...product,
      museumSlug: museum.slug,
      museumName: museum.name,
      city: museum.city,
    })),
  );
}
