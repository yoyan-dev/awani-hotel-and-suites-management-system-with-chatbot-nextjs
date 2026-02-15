import { Chip } from "@heroui/react";
import {
  getOccupancyColor,
  OccupancyType,
} from "@/utils/function-room/occupancy";

interface Props {
  booking: any;
}

export default function BookingDetails({ booking }: Props) {
  return (
    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h2 className="font-medium text-gray-700 dark:text-gray-200 mb-2">
        Booking Details
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm capitalize">
        <Info label="Event" value={booking.event_type} />
        <Info label="Date" value={booking.event_date} />
        <Info label="Guests" value={booking.number_of_guest} />

        <div>
          <span className="text-gray-500">Status:</span>
          <Chip
            size="sm"
            color={getOccupancyColor(booking.status as OccupancyType)}
          >
            {booking.status}
          </Chip>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <span className="text-gray-500">{label}:</span>
      <p className="font-medium">{value}</p>
    </div>
  );
}
