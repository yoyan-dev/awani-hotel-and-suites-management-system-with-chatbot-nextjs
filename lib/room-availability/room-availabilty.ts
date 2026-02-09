import { Booking } from "@/types/booking";
import { Room } from "@/types/room";

export function isRoomAvailable(
  room: Room,
  checkIn: string,
  checkOut: string,
): boolean {
  if (!room.bookings || room.bookings.length === 0) {
    return true;
  }

  return !room.bookings.some((booking: Booking) => {
    return booking.checked_in < checkOut && booking.checked_out > checkIn;
  });
}
