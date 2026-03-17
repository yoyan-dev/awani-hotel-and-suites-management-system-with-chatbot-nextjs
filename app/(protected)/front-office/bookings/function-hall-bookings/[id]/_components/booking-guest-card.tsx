import { Card, CardBody, Chip } from "@heroui/react";
import { Mail, Phone } from "lucide-react";
import { FunctionHallBooking } from "@/types/function-room-booking";

interface BookingGuestCardProps {
  booking: FunctionHallBooking;
}

export default function BookingGuestCard({ booking }: BookingGuestCardProps) {
  return (
    <Card radius="sm" className="border border-gray-200 shadow-none">
      <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs text-gray-500">Guest Name</p>
          <p className="font-medium">{booking.guest?.full_name}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Contact</p>
          <div className="flex flex-col gap-2 text-sm font-medium md:flex-row">
            <span className="flex items-center gap-1">
              <Phone size={14} /> {booking.guest?.contact_number}
            </span>
            <span className="flex items-center gap-1">
              <Mail size={14} /> {booking.guest?.email}
            </span>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500">Event Type</p>
          <p className="font-medium">{booking.event_type}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Booking Source</p>
          <Chip size="sm" variant="flat">
            {booking.booking_source || "Online"}
          </Chip>
        </div>
      </CardBody>
    </Card>
  );
}
