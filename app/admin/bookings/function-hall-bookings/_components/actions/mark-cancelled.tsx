import { useFunctionHallBookings } from "@/hooks/use-function-hall-bookings";
import { FunctionHallBooking } from "@/types/function-room-booking";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/react";
import { CircleCheckBig, CircleX } from "lucide-react";
import React from "react";

export default function MarkCancelled({ id }: { id: string }) {
  const { updateBooking, isLoading } = useFunctionHallBookings();

  async function markCancelled() {
    await updateBooking({ id: id, status: "cancelled" } as FunctionHallBooking);
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
