// Muayenehane calisma saatleri — randevu slotlari icin tek kaynak.
// Pzt – Cmt: 09:00 - 18:00
// Pazar: kapali

interface DayHours {
  open: string; // "HH:mm"
  close: string; // "HH:mm" (son slot bu saatten oncedir)
}

const SLOT_INTERVAL_MINUTES = 30;

const WEEKDAY_HOURS: DayHours = { open: "09:00", close: "18:00" };

// 0 = Pazar, 1 = Pazartesi, ... 6 = Cumartesi
const WORKING_HOURS: Record<number, DayHours | null> = {
  0: null, // Pazar kapali
  1: WEEKDAY_HOURS,
  2: WEEKDAY_HOURS,
  3: WEEKDAY_HOURS,
  4: WEEKDAY_HOURS,
  5: WEEKDAY_HOURS,
  6: WEEKDAY_HOURS, // Cumartesi ayni saatler
};

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function toTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Parse a "YYYY-MM-DD" string into a local Date (no timezone shift). */
export function parseDateString(dateStr: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return null;
  const [, y, mo, d] = match;
  const date = new Date(Number(y), Number(mo) - 1, Number(d));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** True when the muayenehane is closed that day (Sunday). */
export function isClosedDate(date: Date): boolean {
  return WORKING_HOURS[date.getDay()] == null;
}

/** Generate 30-minute time slots for the given date's weekday. */
export function getTimeSlotsForDate(dateStr: string): string[] {
  const date = parseDateString(dateStr);
  if (!date) return [];

  const hours = WORKING_HOURS[date.getDay()];
  if (!hours) return [];

  const start = toMinutes(hours.open);
  const end = toMinutes(hours.close);
  const slots: string[] = [];

  for (let m = start; m < end; m += SLOT_INTERVAL_MINUTES) {
    slots.push(toTimeString(m));
  }

  return slots;
}

/** Validate a "HH:mm" (or "HH:mm:ss") time against the date's working hours. */
export function isValidSlotForDate(dateStr: string, time: string): boolean {
  const normalized = time.slice(0, 5);
  return getTimeSlotsForDate(dateStr).includes(normalized);
}
