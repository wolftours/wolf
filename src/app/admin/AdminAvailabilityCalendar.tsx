"use client";

import { useMemo, useState, useTransition } from "react";
import {
  formatDisplayDate,
  getAvailableTimeSlots,
  getMinBookableDate,
  toIsoDate,
} from "@/lib/booking";
import type { BookableProduct } from "@/lib/travel-data";
import type { WolfToursClosedSlot } from "@/lib/wolftours-db";
import {
  closeProductDaysAction,
  closeSlotAction,
  openProductDayAction,
  openSlotAction,
} from "./actions";
import styles from "./admin.module.css";

type AdminAvailabilityCalendarProps = {
  products: BookableProduct[];
  closedSlots: WolfToursClosedSlot[];
};

type CalendarDay = {
  date: Date;
  isoDate: string;
  isCurrentMonth: boolean;
  isPast: boolean;
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getCalendarDays(month: Date, minBookableDate: string) {
  const firstDay = getMonthStart(month);
  const mondayBasedOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - mondayBasedOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    const isoDate = toIsoDate(date);

    return {
      date,
      isoDate,
      isCurrentMonth: date.getMonth() === month.getMonth(),
      isPast: isoDate < minBookableDate,
    } satisfies CalendarDay;
  });
}

function getProductKey(product: BookableProduct) {
  return `${product.museumSlug}:${product.slug}`;
}

function getSlotKey(slot: Pick<WolfToursClosedSlot, "visit_date" | "entry_time">) {
  return `${slot.visit_date}:${slot.entry_time}`;
}

export default function AdminAvailabilityCalendar({
  products,
  closedSlots,
}: AdminAvailabilityCalendarProps) {
  const [selectedProductKey, setSelectedProductKey] = useState(
    products[0] ? getProductKey(products[0]) : "",
  );
  const [visibleMonth, setVisibleMonth] = useState(() => getMonthStart(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => getMinBookableDate());
  const [isPending, startTransition] = useTransition();
  const minBookableDate = useMemo(() => getMinBookableDate(), []);

  const selectedProduct = products.find(
    (product) => getProductKey(product) === selectedProductKey,
  );
  const selectedProductClosedSlots = useMemo(() => {
    if (!selectedProduct) {
      return [];
    }

    return closedSlots.filter(
      (slot) =>
        slot.museum_slug === selectedProduct.museumSlug &&
        slot.product_slug === selectedProduct.slug,
    );
  }, [closedSlots, selectedProduct]);
  const closedSlotsByDate = useMemo(() => {
    const grouped = new Map<string, WolfToursClosedSlot[]>();

    for (const slot of selectedProductClosedSlots) {
      const slots = grouped.get(slot.visit_date) ?? [];
      slots.push(slot);
      grouped.set(slot.visit_date, slots);
    }

    return grouped;
  }, [selectedProductClosedSlots]);
  const calendarDays = useMemo(
    () => getCalendarDays(visibleMonth, minBookableDate),
    [visibleMonth, minBookableDate],
  );
  const selectedDateSlots = selectedDate
    ? (closedSlotsByDate.get(selectedDate) ?? [])
    : [];
  const selectedDateClosedSlotKeys = new Set(selectedDateSlots.map(getSlotKey));
  const selectedDateAvailableSlots = getAvailableTimeSlots(selectedDate);
  const isSelectedDayClosed =
    selectedDateAvailableSlots.length > 0 &&
    selectedDateAvailableSlots.every((slot) =>
      selectedDateClosedSlotKeys.has(`${selectedDate}:${slot}`),
    );

  function goToPreviousMonth() {
    setVisibleMonth(
      (currentMonth) =>
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  }

  function goToNextMonth() {
    setVisibleMonth(
      (currentMonth) =>
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  }

  function closeWholeDay(day: CalendarDay) {
    if (!selectedProduct || day.isPast) {
      return;
    }

    const formData = new FormData();
    formData.set("productKey", selectedProductKey);
    formData.set("startDate", day.isoDate);
    formData.set("endDate", day.isoDate);

    startTransition(() => {
      void closeProductDaysAction(formData);
    });
  }

  return (
    <div className={styles.availabilityShell}>
      <div className={styles.availabilityToolbar}>
        <label>
          <span>Product</span>
          <select
            value={selectedProductKey}
            onChange={(event) => setSelectedProductKey(event.target.value)}
          >
            {products.map((product) => (
              <option key={getProductKey(product)} value={getProductKey(product)}>
                {product.museumName} - {product.title}
              </option>
            ))}
          </select>
        </label>
        <p>
          Click a day to manage its slots. Double-click a day to close the whole
          day.
        </p>
      </div>

      <div className={styles.availabilityLayout}>
        <section className={styles.calendarPanel} aria-label="Availability calendar">
          <div className={styles.calendarHeader}>
            <button type="button" onClick={goToPreviousMonth}>
              Previous
            </button>
            <strong>{getMonthLabel(visibleMonth)}</strong>
            <button type="button" onClick={goToNextMonth}>
              Next
            </button>
          </div>

          <div className={styles.calendarWeekdays}>
            {WEEKDAYS.map((weekday) => (
              <span key={weekday}>{weekday}</span>
            ))}
          </div>

          <div className={styles.calendarGrid}>
            {calendarDays.map((day) => {
              const daySlots = closedSlotsByDate.get(day.isoDate) ?? [];
              const availableSlots = getAvailableTimeSlots(day.isoDate);
              const closedSlotTimes = new Set(daySlots.map((slot) => slot.entry_time));
              const isFullyClosed =
                availableSlots.length > 0 &&
                availableSlots.every((slot) => closedSlotTimes.has(slot));
              const isPartlyClosed = daySlots.length > 0 && !isFullyClosed;
              const dayClassName = [
                styles.calendarDay,
                !day.isCurrentMonth ? styles.calendarDayMuted : "",
                day.isoDate === selectedDate ? styles.calendarDaySelected : "",
                isFullyClosed ? styles.calendarDayClosed : "",
                isPartlyClosed ? styles.calendarDayPartial : "",
                day.isPast ? styles.calendarDayPast : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  className={dayClassName}
                  disabled={day.isPast}
                  key={day.isoDate}
                  onClick={() => setSelectedDate(day.isoDate)}
                  onDoubleClick={() => closeWholeDay(day)}
                  type="button"
                >
                  <span>{day.date.getDate()}</span>
                  {isFullyClosed ? <strong>Closed</strong> : null}
                  {isPartlyClosed ? (
                    <strong>
                      {daySlots.length}/{availableSlots.length} closed
                    </strong>
                  ) : null}
                </button>
              );
            })}
          </div>
        </section>

        <aside className={styles.slotPanel}>
          <div className={styles.slotPanelHeader}>
            <div>
              <p>Selected day</p>
              <h4>{selectedDate ? formatDisplayDate(selectedDate) : "Choose a day"}</h4>
            </div>
            {isPending ? <span>Updating...</span> : null}
          </div>

          {selectedProduct ? (
            <>
              <div className={styles.dayActions}>
                <form action={closeProductDaysAction}>
                  <input type="hidden" name="productKey" value={selectedProductKey} />
                  <input type="hidden" name="startDate" value={selectedDate} />
                  <input type="hidden" name="endDate" value={selectedDate} />
                  <button disabled={selectedDate < minBookableDate} type="submit">
                    Close whole day
                  </button>
                </form>
                {isSelectedDayClosed ? (
                  <form action={openProductDayAction}>
                    <input
                      type="hidden"
                      name="museumSlug"
                      value={selectedProduct.museumSlug}
                    />
                    <input
                      type="hidden"
                      name="productSlug"
                      value={selectedProduct.slug}
                    />
                    <input type="hidden" name="visitDate" value={selectedDate} />
                    <button type="submit">Open whole day</button>
                  </form>
                ) : null}
              </div>

              <div className={styles.slotButtonGrid}>
                {selectedDateAvailableSlots.map((slot) => {
                  const closedSlot = selectedDateSlots.find(
                    (item) => item.entry_time === slot,
                  );

                  if (closedSlot) {
                    return (
                      <form action={openSlotAction} key={slot}>
                        <input
                          type="hidden"
                          name="closedSlotId"
                          value={closedSlot.id}
                        />
                        <button className={styles.slotButtonClosed} type="submit">
                          <span>{slot}</span>
                          <strong>Open</strong>
                        </button>
                      </form>
                    );
                  }

                  return (
                    <form action={closeSlotAction} key={slot}>
                      <input type="hidden" name="productKey" value={selectedProductKey} />
                      <input type="hidden" name="visitDate" value={selectedDate} />
                      <input type="hidden" name="entryTime" value={slot} />
                      <button
                        className={styles.slotButtonOpen}
                        disabled={selectedDate < minBookableDate}
                        type="submit"
                      >
                        <span>{slot}</span>
                        <strong>Close</strong>
                      </button>
                    </form>
                  );
                })}
              </div>
            </>
          ) : (
            <p className={styles.adminEmpty}>No products available.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
