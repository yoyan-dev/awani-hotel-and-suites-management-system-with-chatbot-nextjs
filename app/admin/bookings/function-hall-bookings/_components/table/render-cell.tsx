import React from "react";
import { Chip } from "@heroui/react";
import { bookingStatusColorMap } from "@/app/constants/function-hall-booking";
import { FunctionHallBooking } from "@/types/function-room-booking";
import BookingActionsDropdown from "../actions/booking-actions";
import { formatTime } from "@/utils/formta-time";

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

    case "banquet_package":
      return booking.banquet_package?.name || "N/A";

    case "event_date":
      return booking.event_date
        ? new Date(booking.event_date).toLocaleDateString()
        : "N/A";
    case "event_duration":
      return (
        formatTime(booking.event_duration?.start),
        "-",
        formatTime(booking.event_duration?.end)
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

    case "actions":
      return (
        <BookingActionsDropdown booking={booking} disabled={bookingLoading} />
      );

    default:
      return cellValue ?? "N/A";
  }
};
