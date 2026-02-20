import { useFunctionHallBookings } from "@/hooks/use-function-hall-bookings";
import { FunctionHallBooking } from "@/types/function-room-booking";
import { CheckCircle } from "lucide-react";

export default function MarkConfirmed({ id }: { id: string }) {
  const { updateBooking, fetchBookings } = useFunctionHallBookings();

  async function markConfirmed() {
    await updateBooking({ id: id, status: "confirmed" } as FunctionHallBooking);
    await fetchBookings({});
  }

  return (
    <div
      onClick={markConfirmed}
      className="flex gap-2 items-center cursor-pointer"
    >
      <CheckCircle className="w-4 h-4 text-success" /> Mark confirmed
    </div>
  );
}
