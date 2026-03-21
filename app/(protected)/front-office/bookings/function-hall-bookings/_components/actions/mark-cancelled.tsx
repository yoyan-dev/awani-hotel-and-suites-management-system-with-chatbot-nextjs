import { useFunctionHallBookings } from "@/hooks/use-function-hall-bookings";
import { FunctionHallBooking } from "@/types/function-room-booking";
import { CircleX } from "lucide-react";

export default function MarkCancelled({ id }: { id: string }) {
  const { updateBooking, fetchBookings } = useFunctionHallBookings();

  async function markCancelled() {
    await updateBooking({ id: id, status: "cancelled" } as FunctionHallBooking);
    await fetchBookings({});
  }

  return (
    <div
      onClick={markCancelled}
      className="flex gap-2 items-center cursor-pointer"
    >
      <CircleX className="w-4 h-4 text-danger" /> Cancelled
    </div>
  );
}
