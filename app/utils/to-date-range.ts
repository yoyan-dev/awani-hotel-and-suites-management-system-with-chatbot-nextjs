type Calendar = {
  identifier: string;
};

type DateTime = {
  day: number;
  era: string;
  hour: number;
  year: number;
  month: number;
  minute: number;
  second: number;
  millisecond: number;
  offset: number; // in milliseconds
  calendar: Calendar;
  timeZone: string;
};

type DateInput = DateTime | string | Date | null | undefined;

// Convert DateTime or ISO string to JS Date
function parseDateTime(dt?: DateInput): Date | null {
  if (!dt) return null;
  if (typeof dt === "string") {
    const parsed = new Date(dt);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (dt instanceof Date) {
    return Number.isNaN(dt.getTime()) ? null : dt;
  }

  const utc = Date.UTC(
    dt.year,
    dt.month - 1,
    dt.day,
    dt.hour,
    dt.minute,
    dt.second,
    dt.millisecond,
  );
  return new Date(utc - dt.offset); // adjust for offset
}

// Format date/time for booking displays.
export function formateDateAndTime(dt?: DateInput): string | null {
  const date = parseDateTime(dt);
  if (!date) return "Invalid Date";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Shanghai",
  };

  return date.toLocaleString("en-US", options);
}
