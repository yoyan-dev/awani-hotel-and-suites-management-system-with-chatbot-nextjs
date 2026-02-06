import { FunctionRoom } from "@/types/function-room";
import { FunctionHallBooking } from "@/types/function-room-booking";

export type OccupancyStatus = "available" | "half occupied" | "full occupied";

export function computeFunctionRoomAvailabilityByDate(
  rooms: FunctionRoom[],
  eventDate: string,
) {
  return rooms.map((room) => {
    const function_hall_bookings =
      room.function_hall_bookings?.filter((b: FunctionHallBooking) => {
        if (b.status === "cancelled") return false;
        if (!b.event_date) return false;

        // ✅ same date only
        return b.event_date === eventDate;
      }) ?? [];

    const bookingCount = function_hall_bookings.length;

    const totalGuests = function_hall_bookings.reduce(
      (sum: number, b: FunctionHallBooking) => sum + (b.number_of_guest ?? 0),
      0,
    );

    const maxGuests = room.max_guest ?? 0;
    const remainingSlots = Math.max(maxGuests - totalGuests, 0);

    let status: OccupancyStatus = "available";

    if (bookingCount >= 2) {
      status = "full occupied";
    } else if (bookingCount === 1) {
      status = "half occupied";
    }

    return {
      ...room,
      total_guests: totalGuests,
      remaining_slots: remainingSlots,
      booking_count: bookingCount, // 👈 helpful for UI/debug
      status,
      availability_status: status,
    };
  });
}
