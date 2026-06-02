"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { BookableProduct } from "@/lib/travel-data";
import {
  formatDisplayDate,
  formatMoney,
  getAvailableTimeSlots,
  getMaxBookableDate,
  getMinBookableDate,
  isDateUnavailable,
  toIsoDate,
} from "@/lib/booking";
import { getAdultPackagePrice, getServiceFee } from "@/lib/pricing";
import styles from "./BookingWidget.module.css";

type BookingWidgetProps = {
  product: BookableProduct;
  closedSlots?: string[];
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type ConfirmedBooking = {
  reference: string;
  date: string;
  time: string;
  adults: number;
  children: number;
  total: number;
};

function getCalendarDays(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  const firstOfMonth = new Date(year, month - 1, 1, 12);
  const start = new Date(firstOfMonth);
  const mondayIndex = (firstOfMonth.getDay() + 6) % 7;
  start.setDate(firstOfMonth.getDate() - mondayIndex);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);

    return {
      iso: toIsoDate(day),
      label: day.getDate(),
      inMonth: day.getMonth() === firstOfMonth.getMonth(),
    };
  });
}

function formatMonthLabel(monthKey: string) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(new Date(`${monthKey}-01T12:00:00`));
}

function shiftMonth(monthKey: string, delta: number) {
  const [year, month] = monthKey.split("-").map(Number);
  const next = new Date(year, month - 1 + delta, 1, 12);
  return toIsoDate(next).slice(0, 7);
}

export function BookingWidget({ product, closedSlots = [] }: BookingWidgetProps) {
  const minDate = getMinBookableDate();
  const maxDate = getMaxBookableDate();

  const [date, setDate] = useState(minDate);
  const [calendarMonth, setCalendarMonth] = useState(minDate.slice(0, 7));
  const [time, setTime] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<ConfirmedBooking | null>(null);
  const [now, setNow] = useState<number | null>(null);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setNow(Date.now()), 0);

    return () => window.clearTimeout(timer);
  }, []);

  const closedSlotSet = useMemo(() => new Set(closedSlots), [closedSlots]);
  const getOpenSlotsForDate = useCallback(
    (visitDate: string) =>
      getAvailableTimeSlots(visitDate).filter((slot) => {
        if (closedSlotSet.has(`${visitDate}:${slot}`)) {
          return false;
        }

        if (visitDate !== minDate) {
          return true;
        }

        const [hours, minutes] = slot.split(":").map(Number);
        const slotDate = new Date();
        slotDate.setHours(hours, minutes, 0, 0);
        return now === null || slotDate.getTime() > now;
      }),
    [closedSlotSet, minDate, now],
  );
  const slots = useMemo(
    () => getOpenSlotsForDate(date),
    [date, getOpenSlotsForDate],
  );
  const calendarDays = useMemo(
    () => getCalendarDays(calendarMonth),
    [calendarMonth],
  );
  const dateUnavailable = date ? isDateUnavailable(date) || slots.length === 0 : false;

  const subtotal =
    adults * product.adultPrice + children * product.childPrice;
  const serviceFee = getServiceFee(product);
  const total = subtotal + (adults + children > 0 ? serviceFee : 0);
  const guests = adults + children;
  const adultPackagePrice = getAdultPackagePrice(product);

  const activeTime = time || slots[0] || "";

  function adjustAdults(delta: number) {
    setAdults((value) => Math.min(10, Math.max(1, value + delta)));
  }

  function adjustChildren(delta: number) {
    setChildren((value) => Math.min(10, Math.max(0, value + delta)));
  }

  function handleDateChange(nextDate: string) {
    setDate(nextDate);
    setCalendarMonth(nextDate.slice(0, 7));
    setTime("");
    setError("");
  }

  function handleMonthChange(delta: number) {
    setCalendarMonth((value) => shiftMonth(value, delta));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!date) {
      setError("Please choose a visit date.");
      return;
    }

    if (isDateUnavailable(date)) {
      setError("This date is sold out. Please pick another day.");
      return;
    }

    const slot = activeTime;
    if (!slot) {
      setError("Please choose an entry time.");
      return;
    }

    if (adults < 1) {
      setError("At least one adult ticket is required.");
      return;
    }

    if (!customerName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!customerEmail.trim() || !customerEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!customerPhone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!acceptedPolicies) {
      setError("Please accept the terms and refund policy before continuing.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          museumSlug: product.museumSlug,
          productSlug: product.slug,
          visitDate: date,
          entryTime: slot,
          adults,
          children,
          customerName,
          customerEmail,
          customerPhone,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error ?? "Could not create this booking.");
        return;
      }

      if (typeof payload.checkoutUrl === "string") {
        window.location.href = payload.checkoutUrl;
        return;
      }

      setConfirmed({
        reference: payload.order.reference,
        date,
        time: slot,
        adults,
        children,
        total,
      });
    } catch {
      setError("Could not create this booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <div className={styles.card} id="booking-calendar">
        <div className={styles.success}>
          <span className={styles.successBadge}>Confirmed</span>
          <h2>Booking reserved</h2>
          <p className={styles.successLead}>
            Your {product.title} is held. We&apos;ll email final vouchers shortly
            after checking availability.
          </p>
          <dl className={styles.summary}>
            <div>
              <dt>Reference</dt>
              <dd>{confirmed.reference}</dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>{formatDisplayDate(confirmed.date)}</dd>
            </div>
            <div>
              <dt>Entry time</dt>
              <dd>{confirmed.time}</dd>
            </div>
            <div>
              <dt>Guests</dt>
              <dd>
                {confirmed.adults} adult{confirmed.adults === 1 ? "" : "s"}
                {confirmed.children > 0
                  ? ` · ${confirmed.children} child${confirmed.children === 1 ? "" : "ren"}`
                  : ""}
              </dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>{formatMoney(confirmed.total)}</dd>
            </div>
          </dl>
          <button
            className={styles.secondaryBtn}
            type="button"
            onClick={() => setConfirmed(null)}
          >
            Book another date
          </button>
        </div>
      </div>
    );
  }

  if (product.isClosed) {
    return (
      <div className={styles.card} id="booking-calendar">
        <div className={styles.unavailable}>
          <span className={styles.unavailableBadge}>Closed</span>
          <h2>Currently unavailable</h2>
          <p>
            This product is temporarily closed for online booking. Please choose
            another WolfTours option for this attraction.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className={styles.card} id="booking-calendar" onSubmit={handleSubmit}>
      <div className={styles.cardHeader}>
        <p className={styles.eyebrow}>Book now</p>
        <p className={styles.fromPrice}>
          from {formatMoney(adultPackagePrice)}{" "}
          <span>per adult package</span>
        </p>
      </div>

      <input type="hidden" name="date" value={date} />

      <div className={styles.calendarBlock}>
        <div className={styles.calendarTop}>
          <span>Visit date</span>
          <div className={styles.calendarControls}>
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => handleMonthChange(-1)}
              disabled={calendarMonth <= minDate.slice(0, 7)}
            >
              &lt;
            </button>
            <strong>{formatMonthLabel(calendarMonth)}</strong>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => handleMonthChange(1)}
              disabled={calendarMonth >= maxDate.slice(0, 7)}
            >
              &gt;
            </button>
          </div>
        </div>

        <div className={styles.weekdays} aria-hidden="true">
          {WEEKDAYS.map((weekday) => (
            <span key={weekday}>{weekday}</span>
          ))}
        </div>

        <div className={styles.calendarGrid}>
          {calendarDays.map((day) => {
            const isSelected = day.iso === date;
            const isOutOfRange = day.iso < minDate || day.iso > maxDate;
            const isSoldOut =
              !isOutOfRange &&
              (isDateUnavailable(day.iso) ||
                getOpenSlotsForDate(day.iso).length === 0);

            return (
              <button
                type="button"
                className={`${styles.dateButton} ${
                  day.inMonth ? "" : styles.dateMuted
                } ${isSelected ? styles.dateSelected : ""} ${
                  isSoldOut ? styles.dateSoldOut : ""
                }`}
                key={day.iso}
                aria-pressed={isSelected}
                aria-label={`${formatDisplayDate(day.iso)}${
                  isSoldOut ? ", sold out" : ""
                }`}
                onClick={() => handleDateChange(day.iso)}
                disabled={isOutOfRange || isSoldOut}
              >
                {day.label}
              </button>
            );
          })}
        </div>
      </div>

      {date && (
        <p
          className={
            dateUnavailable ? styles.dateHintWarn : styles.dateHint
          }
        >
          {dateUnavailable
            ? "This date is unavailable — try another day."
            : formatDisplayDate(date)}
        </p>
      )}

      <label className={styles.field}>
        <span>Entry time</span>
        <select
          name="time"
          value={activeTime}
          onChange={(event) => setTime(event.target.value)}
          disabled={dateUnavailable || slots.length === 0}
          required
        >
          {slots.length === 0 ? (
            <option value="">No slots available</option>
          ) : (
            slots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))
          )}
        </select>
      </label>

      <div className={styles.guestBlock}>
        <div className={styles.guestRow}>
          <div>
            <strong>Adult</strong>
            <p>Ages 18+ · ticket {formatMoney(product.adultPrice)}</p>
          </div>
          <div className={styles.stepper}>
            <button
              type="button"
              aria-label="Remove adult"
              onClick={() => adjustAdults(-1)}
              disabled={adults <= 1}
            >
              −
            </button>
            <span aria-live="polite">{adults}</span>
            <button
              type="button"
              aria-label="Add adult"
              onClick={() => adjustAdults(1)}
              disabled={adults >= 10}
            >
              +
            </button>
          </div>
        </div>

        <div className={styles.guestRow}>
          <div>
            <strong>Child</strong>
            <p>Ages 4-17 · ticket {formatMoney(product.childPrice)}</p>
          </div>
          <div className={styles.stepper}>
            <button
              type="button"
              aria-label="Remove child"
              onClick={() => adjustChildren(-1)}
              disabled={children <= 0}
            >
              −
            </button>
            <span aria-live="polite">{children}</span>
            <button
              type="button"
              aria-label="Add child"
              onClick={() => adjustChildren(1)}
              disabled={children >= 10}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className={styles.customerFields}>
        <label className={styles.field}>
          <span>Name</span>
          <input
            name="customerName"
            type="text"
            autoComplete="name"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            required
          />
        </label>

        <label className={styles.field}>
          <span>Email</span>
          <input
            name="customerEmail"
            type="email"
            autoComplete="email"
            value={customerEmail}
            onChange={(event) => setCustomerEmail(event.target.value)}
            required
          />
        </label>

        <label className={styles.field}>
          <span>Phone</span>
          <input
            name="customerPhone"
            type="tel"
            autoComplete="tel"
            value={customerPhone}
            onChange={(event) => setCustomerPhone(event.target.value)}
            required
          />
        </label>
      </div>

      <div className={styles.totals}>
        <div>
          <span>
            {adults}× Adult
          </span>
          <span>{formatMoney(adults * product.adultPrice)}</span>
        </div>
        {children > 0 ? (
          <div>
            <span>
              {children}× Child
            </span>
            <span>{formatMoney(children * product.childPrice)}</span>
          </div>
        ) : null}
        <div>
          <span>Service fee</span>
          <span>{formatMoney(guests > 0 ? serviceFee : 0)}</span>
        </div>
        <div className={styles.grandTotal}>
          <span>Total</span>
          <span>{formatMoney(total)}</span>
        </div>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      <label className={styles.policyCheck}>
        <input
          type="checkbox"
          checked={acceptedPolicies}
          onChange={(event) => setAcceptedPolicies(event.target.checked)}
          required
        />
        <span>
          I accept the{" "}
          <Link href="/terms" target="_blank">
            Terms &amp; conditions
          </Link>{" "}
          and{" "}
          <Link href="/refunds" target="_blank">
            Refund policy
          </Link>
          .
        </span>
      </label>

      <button
        className={styles.submit}
        type="submit"
        disabled={
          submitting || dateUnavailable || slots.length === 0 || !acceptedPolicies
        }
      >
        {submitting ? "Opening secure payment..." : `Pay securely · ${formatMoney(total)}`}
      </button>

      <p className={styles.finePrint}>
        Secure card payment is handled by Stripe. We email your voucher and
        visit notes after payment is completed.
      </p>
      <p className={styles.packageDisclosure}>
        As an independent travel agency and ticket concierge, our package prices
        may be higher than the face value of the standard museum tickets. The
        final price includes the official entry fee, guaranteed reservation
        management, and our curated premium digital itinerary services.
      </p>
    </form>
  );
}
