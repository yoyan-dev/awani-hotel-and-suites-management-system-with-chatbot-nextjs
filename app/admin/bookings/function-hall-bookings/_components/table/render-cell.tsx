import React from "react";
import { Chip } from "@heroui/react";
import { bookingStatusColorMap } from "@/app/constants/booking";
import { Booking } from "@/types/booking";
import { formatPHP } from "@/lib/format-php";
import { calculateBookingPrice, getNights } from "@/utils/pricing";
import { Room } from "@/types/room";
import BookingActionsDropdown from "../actions/booking-actions";

interface RenderCellProps {
  booking: Booking;
  columnKey: string;
  onAssign: (booking: Booking, room: Room) => void;
  bookingLoading: boolean;
}

export const RenderCell = ({ booking, columnKey }: RenderCellProps) => {
  const cellValue = booking[columnKey as keyof Booking];
  const nights = getNights(booking.check_in, booking.check_out);

  switch (columnKey) {
    case "room":
      return booking.room?.room_number || "N/A";
    case "guest_name":
      return (
        <div className="flex flex-col w-48">
          <p className="text-bold text-small capitalize">
            {booking.user?.full_name || "undefined"}
          </p>
          <p className="text-bold text-tiny capitalize text-default-600 dark:text-default-300 flex ">
            {booking.check_in} to {booking.check_out}
          </p>
        </div>
      );

    case "room_type":
      return <Chip>{booking.room_type?.name}</Chip>;
    case "nights":
      return nights;

    case "amount_paid":
      return formatPHP(Number(booking.amount_paid));
    case "total_price":
      return formatPHP(Number(booking.total));
    case "status":
      return (
        <Chip
          size="sm"
          className={`px-2 rounded-full  font-medium ${bookingStatusColorMap[booking.status]}`}
        >
          {booking.status}
        </Chip>
      );
    case "actions":
      return <BookingActionsDropdown booking={booking} />;
    default:
      return cellValue;
  }
};
