"use client";

import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { CalendarDays, MessageCircle, Users } from "lucide-react";
import { formatPHP } from "@/lib/format-php";
import { Booking } from "@/types/booking";

function formatDate(dateValue?: string) {
  if (!dateValue) return "-";

  const date = new Date(dateValue);
  return date.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BookingScheduleCard({ booking }: { booking: Booking }) {
  return (
    <Card radius="none">
      <CardHeader>
        <h3 className="font-semibold">Schedule</h3>
      </CardHeader>
      <CardBody className="space-y-3">
        <div className="flex items-start gap-3">
          <CalendarDays className="w-5 h-5 text-default-500" />
          <div>
            <div className="text-xs text-gray-500">checked_in</div>
            <div className="font-medium">{formatDate(booking.checked_in)}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CalendarDays className="w-5 h-5 text-default-500" />
          <div>
            <div className="text-xs text-gray-500">checked_out</div>
            <div className="font-medium">{formatDate(booking.checked_out)}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-default-500" />
          <div>
            <div className="text-xs text-gray-500">Guests</div>
            <div className="font-medium">{booking.number_of_guests}</div>
          </div>
        </div>

        {booking.special_requests ? (
          <div>
            <div className="text-xs text-gray-500">Special requests</div>
            <div className="flex gap-2 flex-wrap">
              {booking.special_requests.map((request: any) => (
                <Chip key={request.name}>
                  {request.quantity} {request.name} -{" "}
                  {request.price > 0
                    ? formatPHP(request.price * request.quantity)
                    : "free"}
                </Chip>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex items-start gap-3">
          <MessageCircle className="w-5 h-5 text-default-500" />
          <div>
            <div className="text-xs text-gray-500">Request Messages</div>
            <div className="text-sm">
              {booking.request_messages || "No request messages"}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
