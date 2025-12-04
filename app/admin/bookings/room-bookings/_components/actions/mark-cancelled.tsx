import { useBookings } from "@/hooks/use-bookings";
import { useRooms } from "@/hooks/use-rooms";
import { Booking } from "@/types/booking";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/react";
import { CircleCheckBig, CircleX } from "lucide-react";
import React from "react";

export default function MarkCancelled({ booking }: { booking: Booking }) {
  const { updateBooking, isLoading, fetchBookings } = useBookings();
  const { updateRoom } = useRooms();
  async function markCancelled() {
    // if (booking.room_id) {
    //   const removeBookingOnRoom = booking.room.bookings.filter(
    //     (bkng: Booking) => bkng.id != booking.id
    //   );
    //   console.log(removeBookingOnRoom);
    //   updateRoom({ id: booking.room_id, bookings: removeBookingOnRoom });
    // }
    await updateBooking({ id: booking.id, status: "cancelled" } as Booking);
    fetchBookings({});
  }
  return (
    <div onClick={markCancelled} className="flex gap-2 items-center">
      <CircleX className="w-4 h-4 text-danger" /> Cancelled
    </div>
  );
}
