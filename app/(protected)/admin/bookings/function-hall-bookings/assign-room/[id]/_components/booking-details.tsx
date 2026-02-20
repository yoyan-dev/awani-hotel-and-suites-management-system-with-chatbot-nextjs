import { Chip } from "@heroui/react";
import {
  getOccupancyColor,
  OccupancyType,
} from "@/utils/function-room/occupancy";
import { formateDateAndTime } from "@/app/utils/to-date-range";
import { bookingStatusColorMap } from "@/app/constants/function-hall-booking";

interface Props {
  booking: any;
}

export default function BookingDetails({ booking }: Props) {
  return (
    <div className="mb-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
          Booking Details
        </h2>

        <Chip
          size="sm"
          className={bookingStatusColorMap[booking.status || "default"]}
        >
          {booking.status}
        </Chip>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-12 text-sm">
        <Info label="Event Type" value={booking.event_type} />

        <Info
          label="Event Date"
          value={
            <div className="flex flex-col">
              <span>{formateDateAndTime(booking.event_duration?.start)}</span>
              <span className="text-gray-500 text-xs">
                to {formateDateAndTime(booking.event_duration?.end)}
              </span>
            </div>
          }
        />

        <Info label="Number of Guests" value={booking.number_of_guest} />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">
        {label}
      </span>
      <div className="text-sm font-medium text-gray-800 dark:text-gray-200 capitalize">
        {value || "-"}
      </div>
    </div>
  );
}
