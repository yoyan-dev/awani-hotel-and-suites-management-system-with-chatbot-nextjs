import { hasBookingConflict } from "./booking-overlap";

export function isRoomAvailable(
  room: any,
  checkIn: string,
  checkOut: string,
): boolean {
  if (!room.bookings || room.bookings.length === 0) return true;

  return !hasBookingConflict(room.bookings, checkIn, checkOut);
}
