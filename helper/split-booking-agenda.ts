import {
  bookingStatusHexColorMap,
  paymentStatusColorMap,
} from "@/app/constants/booking";
import { Booking } from "@/types/booking";
import { getNights } from "@/utils/pricing";
import { eachDayOfInterval } from "date-fns";

export function splitBookingToAgendaEvents(booking: Booking) {
  const days = eachDayOfInterval({
    start: new Date(booking.checked_in),
    end: new Date(booking.checked_in),
  });

  return days.map((date, index) => {
    const isCheckIn = index === 0;
    const isCheckOut = index === days.length - 1;

    return {
      id: `${booking.id}-${index}`,
      parentId: booking.id,
      title: `${booking.user?.full_name || "Unknown Guest"} ● ${getNights(
        booking.checked_in,
        booking.checked_out,
      )} night/nights (Room ${booking.room?.room_number || "Not assigned"} - ${booking.room_type.name})`,
      roomType: booking.room?.room_type?.name,
      roomNumber: booking.room?.room_number,
      status: booking.status,
      statusColor:
        paymentStatusColorMap[booking.payment_status || "pending"] || "#CCCCCC",
      start: isCheckIn
        ? new Date(booking.checked_in)
        : new Date(date.setHours(0, 0)),
      end: isCheckOut
        ? new Date(booking.checked_in)
        : new Date(date.setHours(23, 59)),
      dateDuration: {
        start: booking.checked_in,
        end: booking.checked_out,
      },
      resourceId: booking.room_id || "no assigned",
      allDay: !isCheckIn && !isCheckOut,
      color:
        bookingStatusHexColorMap[booking.status] ||
        bookingStatusHexColorMap["default"],
    };
  });
}
