import { useBookings } from "@/hooks/use-bookings";
import { useRooms } from "@/hooks/use-rooms";
import { Booking } from "@/types/booking";
import { CircleCheck } from "lucide-react";
import React from "react";

export default function CheckInButton({ booking }: { booking: Booking }) {
  const { updateBooking } = useBookings();
  const { updateRoom } = useRooms();

  async function markCheckIn() {
    updateBooking({ id: booking.id, status: "check-in" } as Booking);
    updateRoom({ id: booking.room_id, status: "dirty" });
  }
  return (
    <div onClick={markCheckIn} className="flex gap-2 items-center">
      <CircleCheck className="w-4 h-4 text-success" /> Check in
    </div>
  );
}
