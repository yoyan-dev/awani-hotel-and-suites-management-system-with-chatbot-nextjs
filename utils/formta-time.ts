export function formatTime(time: any) {
  const hour = time?.hour ?? 0;
  const minute = time?.minute ?? 0;
  const ampm = hour >= 12 ? "PM" : "AM";
  let hour12 = hour % 12;
  if (hour12 === 0) hour12 = 12;
  const minuteStr = String(minute).padStart(2, "0");
  return `${hour12.toString().padStart(2, "0")}:${minuteStr} ${ampm}`;
}
