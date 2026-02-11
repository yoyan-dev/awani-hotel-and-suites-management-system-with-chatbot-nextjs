import { endOfDay, isValid, parseISO, startOfDay } from "date-fns";

export const calculateDateRange = (params: {
  date?: string;
  start?: string;
  end?: string;
}): { start: Date; end: Date } => {
  const today = new Date();

  if (params.start && params.end) {
    const start = parseISO(params.start);
    const end = parseISO(params.end);
    if (isValid(start) && isValid(end)) {
      return { start, end };
    }
  }

  if (params.date) {
    const date = parseISO(params.date);
    if (isValid(date)) {
      return { start: startOfDay(date), end: endOfDay(date) };
    }
  }

  return { start: startOfDay(today), end: endOfDay(today) };
};
