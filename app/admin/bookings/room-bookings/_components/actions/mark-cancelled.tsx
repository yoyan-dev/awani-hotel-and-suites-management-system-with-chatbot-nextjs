import { useBookings } from "@/hooks/use-bookings";
import { Booking } from "@/types/booking";
import { CircleX } from "lucide-react";

export default function MarkCancelled({ booking }: { booking: Booking }) {
  const { updateBooking, isLoading, fetchBookings } = useBookings();
  async function markCancelled() {
    await updateBooking({ id: booking.id, status: "cancelled" } as Booking);
    fetchBookings({});
  }
  return (
    <div onClick={markCancelled} className="flex gap-2 items-center">
      <CircleX className="w-4 h-4 text-danger" /> Cancelled
    </div>
  );
}
