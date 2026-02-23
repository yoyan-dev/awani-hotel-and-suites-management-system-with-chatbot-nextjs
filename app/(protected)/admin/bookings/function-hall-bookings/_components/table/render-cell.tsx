import React from "react";
import { Chip } from "@heroui/react";
import { bookingStatusColorMap } from "@/app/constants/function-hall-booking";
import { FunctionHallBooking } from "@/types/function-room-booking";
import BookingActionsDropdown from "../actions/booking-actions";
import { formateDateAndTime } from "@/app/utils/to-date-range";
import { formatPHP } from "@/lib/format-php";

type OccupancyType = "available" | "half occupied" | "full occupied";

const getOccupancyColor = (
  occupancy?: OccupancyType,
): "success" | "warning" | "danger" | "default" => {
  switch (occupancy) {
    case "available":
      return "success";
    case "half occupied":
      return "warning";
    case "full occupied":
      return "danger";
    default:
      return "default";
  }
};

interface RenderCellProps {
  booking: FunctionHallBooking;
  columnKey: string;
  bookingLoading: boolean;
}

export const RenderCell = ({
  booking,
  columnKey,
  bookingLoading,
}: RenderCellProps) => {
  const cellValue = booking[columnKey as keyof FunctionHallBooking];
  const paymentStatusColorMap: Record<string, string> = {
    pending: "bg-gray-100 text-gray-700",
    unpaid: "bg-red-100 text-red-700",
    deposit: "bg-amber-100 text-amber-700",
    paid: "bg-green-100 text-green-700",
  };

  switch (columnKey) {
    case "guest":
      return (
        <div className="flex flex-col w-48">
          <p className="text-bold text-small capitalize">
            {booking.guest?.full_name || "N/A"}
          </p>
        </div>
      );

    case "room":
      return booking.room?.room_number || booking.room?.name || "N/A";

    case "event_duration":
      return (
        <div className="flex flex-col w-60">
          <p className="text-bold text-small capitalize">
            {formateDateAndTime(booking.event_duration?.start)}
          </p>
          <p className="text-bold text-small capitalize">
            {formateDateAndTime(booking.event_duration?.end)}
          </p>
        </div>
      );

    case "status":
      return (
        <Chip
          size="sm"
          className={`px-2 rounded-full font-medium ${
            bookingStatusColorMap[booking.status || "default"]
          }`}
        >
          {booking.status || "N/A"}
        </Chip>
      );

    case "occupancy_type":
      return (
        <Chip
          size="sm"
          color={getOccupancyColor(booking.occupancy_type)}
          variant="flat"
        >
          {booking.occupancy_type || "N/A"}
        </Chip>
      );

    case "total_amount":
      return formatPHP(Number(booking.total_amount || 0));

    case "amount_paid":
      return formatPHP(Number(booking.amount_paid || 0));

    case "balance":
      return formatPHP(Number(booking.balance || 0));

    case "payment_status":
      return (
        <Chip
          size="sm"
          className={`px-2 rounded-full font-medium ${
            paymentStatusColorMap[booking.payment_status || "pending"]
          }`}
        >
          {booking.payment_status || "pending"}
        </Chip>
      );

    case "actions":
      return (
        <BookingActionsDropdown booking={booking} disabled={bookingLoading} />
      );

    default:
      return cellValue ?? "N/A";
  }
};
