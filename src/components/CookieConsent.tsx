"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import styles from "./CookieConsent.module.css";

const STORAGE_KEY = "wolftours-cookie-consent";
const CONSENT_CHANGE_EVENT = "wolftours-cookie-consent-change";

type ConsentChoice = "accepted" | "rejected";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function updateGoogleConsent(choice: ConsentChoice) {
  const isAccepted = choice === "accepted";

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtagFallback(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  window.gtag("consent", "update", {
    ad_storage: isAccepted ? "granted" : "denied",
    ad_user_data: isAccepted ? "granted" : "denied",
    ad_personalization: isAccepted ? "granted" : "denied",
    analytics_storage: isAccepted ? "granted" : "denied",
  });
}

function readStoredChoice(): ConsentChoice | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedChoice = window.localStorage.getItem(STORAGE_KEY);

  return storedChoice === "accepted" || storedChoice === "rejected"
    ? storedChoice
    : null;
}

function subscribeToConsentChange(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CONSENT_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CONSENT_CHANGE_EVENT, onStoreChange);
  };
}

export function CookieConsent() {
  const choice = useSyncExternalStore(
    subscribeToConsentChange,
    readStoredChoice,
    () => null,
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (choice) {
      updateGoogleConsent(choice);
    }
  }, [choice]);

  function saveChoice(nextChoice: ConsentChoice) {
    window.localStorage.setItem(STORAGE_KEY, nextChoice);
    window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
    updateGoogleConsent(nextChoice);
    setIsSettingsOpen(false);
  }

  const isBannerOpen = choice === null || isSettingsOpen;

  return (
    <>
      {isBannerOpen ? (
        <section
          className={styles.banner}
          aria-label="Cookie consent"
          role="region"
        >
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Cookie settings</p>
            <h2>Help us improve WolfTours</h2>
            <p>
              We use Google Analytics and Google Ads cookies to measure visits,
              bookings, and advertising performance. You can accept these
              optional cookies or keep them turned off.
            </p>
            <Link href="/cookies" className={styles.policyLink}>
              Read our cookie policy
            </Link>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={() => saveChoice("rejected")}
            >
              Reject optional
            </button>
            <button
              className={styles.primaryButton}
              type="button"
              onClick={() => saveChoice("accepted")}
            >
              Accept cookies
            </button>
          </div>
        </section>
      ) : null}

      {choice && !isBannerOpen ? (
        <button
          className={styles.settingsButton}
          type="button"
          onClick={() => setIsSettingsOpen(true)}
        >
          Cookie settings
        </button>
      ) : null}
    </>
  );
}
