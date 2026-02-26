import { Booking } from "@/types/booking";

export function getNights(checkIn: string, checkOut: string): number {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);

  let diff = Math.ceil(
    (outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diff <= 0) diff = 1;
  return diff;
}

export function calculateBookingPrice(booking: Booking): number {
  if (!booking.room_type) return 0;

  const nights = getNights(booking.checked_in, booking.checked_out);
  const roomPrice = Number(booking.room_type.price ?? 0);
  return roomPrice * nights;
}

export function calculateTotalBookingsPrice(bookings: Booking[]): number {
  return bookings.reduce((total, b) => total + calculateBookingPrice(b), 0);
}
