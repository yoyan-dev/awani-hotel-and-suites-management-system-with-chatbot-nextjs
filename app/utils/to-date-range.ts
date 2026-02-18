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

// Convert DateTime to JS Date
function parseDateTime(dt?: DateTime): Date | null {
  if (!dt) return null;
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

// Format single DateTime as ISO string
export function formateDateAndTime(dt?: DateTime): string | null {
  const date = parseDateTime(dt);
  if (!date) return "Invalid DateTime";
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
