export function toJSDate(dateObj: any) {
  return new Date(
    dateObj.year,
    dateObj.month - 1, // month is 0-based
    dateObj.day,
    dateObj.hour,
    dateObj.minute,
    dateObj.second,
    dateObj.millisecond,
  );
}
