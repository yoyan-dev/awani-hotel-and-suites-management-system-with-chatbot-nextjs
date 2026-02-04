export function formatTime(time: any) {
  const hour = time.hour;
  const minute = time.minute;
  const ampm = hour >= 12 ? "PM" : "AM";
  let hour12 = hour % 12;
  if (hour12 === 0) hour12 = 12;
  const minuteStr = minute.toString().padStart(2, "0");
  return `${hour12.toString().padStart(2, "0")}:${minuteStr} ${ampm}`;
}

// Example usage:
const timeObj = {
  start: { hour: 3, minute: 0, second: 0, millisecond: 0 },
  end: { hour: 20, minute: 0, second: 0, millisecond: 0 },
};
