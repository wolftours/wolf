import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import Script from "next/script";
import { CookieConsent } from "@/components/CookieConsent";
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
    icon: [{ url: "/favicon.svg?v=2", type: "image/svg+xml" }],
    shortcut: [{ url: "/favicon.svg?v=2", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg?v=2", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        {children}
        <CookieConsent />
        <Script id="google-consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              wait_for_update: 500
            });
          `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MVDZWDCQSD"
          strategy="afterInteractive"
        />
        <Script id="google-tags" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MVDZWDCQSD');
            gtag('config', 'AW-18199793120');
          `}
        </Script>
        <Script
          src="https://code.tidio.co/imszxayuewpygpbi1ecsxd70xaasvbn6.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
