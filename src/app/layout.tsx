import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import { company } from "@/lib/company-data";
import "./globals.css";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: `${company.brand} | ${company.subtitle}`,
  description:
    "Curated museum tickets and city tours in Paris, Rome, and Barcelona. Operated by Wolf Tourist s. r. o., Slovakia.",
  icons: {
    icon: "/wolftours-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
