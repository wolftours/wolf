export const company = {
  brand: "WolfTours",
  legalName: "Wolf Tourist s. r. o.",
  ico: "57567247",
  dic: "2122823813",
  icDph: "SK2122823813",
  vatRegisteredFrom: "4 May 2026",
  address: {
    street: "Komenského 317/135",
    city: "Štúrovo",
    postalCode: "943 01",
    country: "Slovakia",
  },
  registry: "Obchodný register Okresného súdu Nitra, oddiel: Sro, vložka č. 69404/N",
  founded: "14 April 2026",
  shareCapital: "€5,000 (paid in full)",
  email: "hello@wolftours-global.com",
  website: "wolftours-global.com",
  tagline: "Explore the world's pack",
  subtitle: "Global ticket sales for all attractions",
  finstatUrl: "https://finstat.sk/57567247",
} as const;

export function formatCompanyAddress() {
  const { street, postalCode, city, country } = company.address;
  return `${street}, ${postalCode} ${city}, ${country}`;
}
