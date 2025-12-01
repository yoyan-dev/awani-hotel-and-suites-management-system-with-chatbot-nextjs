import { useBookings } from "@/hooks/use-bookings";
import { useRooms } from "@/hooks/use-rooms";
import { Booking } from "@/types/booking";
import { LogOut } from "lucide-react";
import React from "react";

export default function CheckOutButton({ booking }: { booking: Booking }) {
  const [isLoading, setIsloading] = React.useState(false);
  const { updateBooking } = useBookings();
  const { updateRoom } = useRooms();

  async function markCheckOut() {
    setIsloading(true);
    await updateBooking({ id: booking.id, status: "check-out" } as Booking);
    await updateRoom({ id: booking.room_id, status: "dirty" });

    setIsloading(false);
  }
  return (
    <div onClick={markCheckOut} className="flex gap-2 items-center">
      <LogOut className="w-4 h-4 text-blue-600" /> Check out
    </div>
  );
}
