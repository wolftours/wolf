"use client";

import { useEffect } from "react";

type GoogleAdsConversionProps = {
  currency?: string;
  sendTo: string;
  transactionId?: string;
  value?: number;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function GoogleAdsConversion({
  currency = "EUR",
  sendTo,
  transactionId,
  value = 1.0,
}: GoogleAdsConversionProps) {
  useEffect(() => {
    if (!transactionId) {
      return;
    }

    const storageKey = `wolftours-google-ads-conversion:${sendTo}:${transactionId}`;

    if (window.sessionStorage.getItem(storageKey)) {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtagFallback(...args: unknown[]) {
        window.dataLayer?.push(args);
      };

    window.gtag("event", "conversion", {
      currency,
      send_to: sendTo,
      transaction_id: transactionId,
      value,
    });
    window.sessionStorage.setItem(storageKey, "sent");
  }, [currency, sendTo, transactionId, value]);

  return null;
}
