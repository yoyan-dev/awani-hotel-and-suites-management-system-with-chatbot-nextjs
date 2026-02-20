export function toISODateOnly(dateObj: any): string {
  const year = dateObj.year;
  const month = String(dateObj.month).padStart(2, "0");
  const day = String(dateObj.day).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
