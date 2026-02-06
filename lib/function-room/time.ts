export type TimeObject = {
  hour: number;
  minute: number;
  second?: number;
  millisecond?: number;
};

export function parseTimeObject(raw: string): TimeObject {
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Invalid time object");
  }
}

export function buildDate(eventDate: string, time: TimeObject): Date {
  const date = new Date(eventDate);
  date.setHours(
    time.hour,
    time.minute,
    time.second ?? 0,
    time.millisecond ?? 0,
  );
  return date;
}
