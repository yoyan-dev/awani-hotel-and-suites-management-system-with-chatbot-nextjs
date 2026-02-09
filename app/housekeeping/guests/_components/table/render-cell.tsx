import React from "react";
import { Chip } from "@heroui/react";
import { bookingStatusColorMap } from "@/app/constants/booking";
import { CalendarArrowDown, CalendarArrowUp } from "lucide-react";
import { Booking } from "@/types/booking";
import { formatPHP } from "@/lib/format-php";
import { calculateBookingPrice, getNights } from "@/utils/pricing";

interface RenderCellProps {
  booking: Booking;
  columnKey: string;
}

export const RenderCell = ({ booking, columnKey }: RenderCellProps) => {
  const cellValue = booking[columnKey as keyof Booking];
  const nights = getNights(booking.checked_in, booking.checked_out);

  switch (columnKey) {
    case "room":
      return booking.room?.room_number || "No yet assigned";
    case "guest_name":
      return booking.user?.full_name || "undefined";
    case "room_type":
      return booking.room_type?.name;
    case "nights":
      return nights;
    case "total_price":
      return formatPHP(
        calculateBookingPrice(booking) + Number(booking.total_add_ons || 0),
      );
    case "status":
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${bookingStatusColorMap[booking.status]}`}
        >
          {booking.status}
        </span>
      );

    default:
      return cellValue;
  }
};
