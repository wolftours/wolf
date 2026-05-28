export const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
];

export function formatMoney(amount: number, currency = "EUR") {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDisplayDate(isoDate: string) {
  const date = new Date(`${isoDate}T12:00:00`);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getMinBookableDate() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return toIsoDate(date);
}

export function getMaxBookableDate() {
  const date = new Date();
  date.setMonth(date.getMonth() + 4);
  return toIsoDate(date);
}

export function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isDateUnavailable(isoDate: string) {
  return !isoDate;
}

export function getAvailableTimeSlots(isoDate: string) {
  if (!isoDate || isDateUnavailable(isoDate)) {
    return [];
  }

  const date = new Date(`${isoDate}T12:00:00`);
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

  if (isWeekend) {
    return TIME_SLOTS.filter((slot) => slot >= "10:00");
  }

  return TIME_SLOTS;
}

export function createBookingReference() {
  const segment = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `WT-${segment}`;
}
