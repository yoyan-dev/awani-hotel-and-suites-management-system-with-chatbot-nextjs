import { Card, CardBody } from "@heroui/react";
import { FunctionHallBooking } from "@/types/function-room-booking";
import { formateDateAndTime } from "@/app/utils/to-date-range";

interface BookingEventCardProps {
  booking: FunctionHallBooking;
}

export default function BookingEventCard({ booking }: BookingEventCardProps) {
  return (
    <Card radius="sm" className="border border-gray-200 shadow-none">
      <CardBody className="space-y-2">
        <p className="text-xs text-gray-500">Event Date</p>
        <p className="text-sm">
          {formateDateAndTime(booking.event_start) ?? "-"} -{" "}
          {formateDateAndTime(booking.event_end) ?? "-"}
        </p>
        <p className="text-xs text-gray-500">Guests</p>
        <p className="text-sm">{booking.number_of_guest}</p>
      </CardBody>
    </Card>
  );
}
