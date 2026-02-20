export type EventDurationBoundary = "start" | "end";

type EventPoint = {
  year?: number;
  month?: number;
  day?: number;
};

const formatISODate = (year: number, month: number, day: number): string => {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

export const parseISODateOnly = (value: unknown): string | null => {
  if (!value) return null;

  if (typeof value === "string") {
    const datePrefix = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
    if (datePrefix) return datePrefix;

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }

    try {
      const parsedJson = JSON.parse(value);
      return parseISODateOnly(parsedJson);
    } catch {
      return null;
    }
  }

  if (typeof value === "object") {
    const point = value as EventPoint;
    const year = Number(point.year);
    const month = Number(point.month);
    const day = Number(point.day);

    if (year && month && day) {
      return formatISODate(year, month, day);
    }
  }

  return null;
};

export const parseEventDurationBoundaryDateOnly = (
  value: unknown,
  boundary: EventDurationBoundary,
): string | null => {
  if (!value) return null;

  if (typeof value === "string") {
    const directDate = parseISODateOnly(value);
    if (directDate) return directDate;

    try {
      const parsed = JSON.parse(value);
      return parseEventDurationBoundaryDateOnly(parsed, boundary);
    } catch {
      return null;
    }
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const boundaryValue = record[boundary];

    if (boundaryValue) {
      return parseISODateOnly(boundaryValue);
    }

    return parseISODateOnly(value);
  }

  return null;
};
