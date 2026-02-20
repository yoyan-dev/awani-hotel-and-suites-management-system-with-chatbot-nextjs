import { FunctionRoom } from "@/types/function-room";
import { FunctionHallBooking } from "@/types/function-room-booking";
import {
  parseEventDurationBoundaryDateOnly,
  parseISODateOnly,
} from "@/utils/function-room/event-duration-date";

export type OccupancyStatus = "available" | "half occupied" | "full occupied";

export function computeFunctionRoomAvailabilityByDate(
  rooms: FunctionRoom[],
  start: unknown,
  end: unknown,
) {
  const requestedStartISO =
    parseEventDurationBoundaryDateOnly(start, "start") ?? parseISODateOnly(start);
  const requestedEndISO =
    parseEventDurationBoundaryDateOnly(end, "end") ?? parseISODateOnly(end);

  if (!requestedStartISO || !requestedEndISO) {
    return rooms;
  }

  const rangeStartISO =
    requestedStartISO <= requestedEndISO ? requestedStartISO : requestedEndISO;
  const rangeEndISO =
    requestedEndISO >= requestedStartISO ? requestedEndISO : requestedStartISO;

  return rooms.map((room) => {
    const function_hall_bookings =
      room.function_hall_bookings?.filter((b: FunctionHallBooking) => {
        if (b.status === "cancelled") return false;

        const bookingStartISO = parseEventDurationBoundaryDateOnly(
          b.event_duration,
          "start",
        );
        const bookingEndISO =
          parseEventDurationBoundaryDateOnly(b.event_duration, "end") ??
          bookingStartISO;

        if (!bookingStartISO || !bookingEndISO) return false;

        return bookingStartISO <= rangeEndISO && bookingEndISO >= rangeStartISO;
      }) ?? [];

    const bookingCount = function_hall_bookings.length;

    const totalGuests = function_hall_bookings.reduce(
      (sum: number, b: FunctionHallBooking) => sum + (b.number_of_guest ?? 0),
      0,
    );

    const maxGuests = room.max_guest ?? 0;
    const remainingSlots = Math.max(maxGuests - totalGuests, 0);

    let status: OccupancyStatus = "available";

    if (bookingCount >= 2 || totalGuests >= maxGuests) {
      status = "full occupied";
    } else if (bookingCount === 1) {
      status = "half occupied";
    }

    return {
      ...room,
      total_guests: totalGuests,
      remaining_slots: remainingSlots,
      booking_count: bookingCount,
      status,
      availability_status: status,
    };
  });
}
