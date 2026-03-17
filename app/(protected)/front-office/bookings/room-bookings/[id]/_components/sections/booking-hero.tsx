"use client";

import { Button, Card, Chip, Divider, Image } from "@heroui/react";
import { Info, Tag } from "lucide-react";
import Link from "next/link";
import { bookingStatusColorMap } from "@/app/constants/booking";
import { formatPHP } from "@/lib/format-php";
import { Booking } from "@/types/booking";

interface BookingHeroProps {
  booking: Booking;
  totalAmount: number;
  onViewGuest: () => void;
}

function RoomAssignmentActions({ booking }: { booking: Booking }) {
  if (booking.room) {
    return (
      <div className="flex gap-2 items-center">
        <span>#{booking.room?.room_number}</span>
        <Link
          className="px-2 py-1 bg-primary text-white rounded-sm"
          href={`/admin/bookings/room-bookings/${booking.id}`}
        >
          Transfer room
        </Link>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <span>No room assigned</span>
      {(booking.status === "checked_in" || booking.status === "confirmed") && (
        <Link
          className="px-2 py-1 bg-primary text-white rounded-sm"
          href={`/admin/booking/assign-room/${booking.id}`}
        >
          Choose room
        </Link>
      )}
    </div>
  );
}

export default function BookingHero({
  booking,
  totalAmount,
  onViewGuest,
}: BookingHeroProps) {
  return (
    <Card className="overflow-hidden" radius="none">
      <div className="md:flex">
        <div className="md:w-1/2">
          <Image
            src={
              booking.room_type?.images?.[0] ??
              booking.room_type?.image ??
              "/placeholder-room.jpg"
            }
            alt={booking.room_type?.name || "Room"}
            className="w-full h-56 md:h-full object-cover"
            radius="none"
          />
        </div>

        <div className="md:w-1/2 p-5 flex flex-col gap-3">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-semibold leading-tight">
                {booking.user?.full_name || "Guest Name"}
              </h1>
              <p className="text-sm text-gray-500">
                {booking.user?.contact_number || ""}
              </p>
              <div className="mt-2 flex gap-2 items-center">
                <Chip
                  size="sm"
                  className={`px-2 rounded-full font-medium ${bookingStatusColorMap[booking.status]}`}
                >
                  {booking.status}
                </Chip>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Info className="w-3 h-3" /> Booking summary
                </span>
              </div>
            </div>
            <div>
              <Button
                variant="light"
                size="sm"
                color="primary"
                className="mt-1"
                onPress={onViewGuest}
              >
                view guest
              </Button>
            </div>
          </div>

          <div className="mt-1">
            <h2 className="text-lg font-medium">{booking.room_type?.name}</h2>
            {booking.room_type?.description && (
              <p className="text-sm text-gray-600 line-clamp-3">
                {booking.room_type?.description}
              </p>
            )}
            <div className="mt-3 flex items-center gap-3">
              <div className="text-sm">
                <div className="text-xs text-gray-500">Rate / Night</div>
                <div className="font-semibold">
                  {formatPHP(booking.room_type?.price)}
                </div>
              </div>

              <div className="text-sm">
                <div className="text-xs text-gray-500">Add-ons</div>
                <div className="font-semibold">
                  {formatPHP(Number(booking.total_add_ons))}
                </div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-xs text-gray-500">Total</div>
                <div className="text-xl font-bold text-green-600">
                  {formatPHP(totalAmount)}
                </div>
              </div>
            </div>
          </div>

          <Divider />

          <div className="flex justify-end gap-2">
            <div className="ml-auto hidden sm:flex items-center text-sm text-gray-500 gap-2">
              <Tag className="w-4 h-4" />
              <RoomAssignmentActions booking={booking} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
