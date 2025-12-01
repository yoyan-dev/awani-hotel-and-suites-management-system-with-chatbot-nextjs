const peakRanges = [
  { start: "06-29", end: "07-02" }, // Charter Day
  { start: "10-28", end: "11-06" }, // Pinta Flores
  { start: "12-24", end: "01-02" }, // Christmas & New Year
];
export function peakSeason() {
  const today = new Date();
  const monthDay = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;

  return peakRanges.some((range) => {
    if (range.start < range.end) {
      return monthDay >= range.start && monthDay <= range.end;
    }
    return monthDay >= range.start || monthDay <= range.end; // handles wrap-around
  });
}
