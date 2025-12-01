import { useBookings } from "@/hooks/use-bookings";
import { Booking } from "@/types/booking";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/react";
import { CircleCheckBig, CircleX } from "lucide-react";
import React from "react";

export default function MarkCancelled({ id }: { id: string }) {
  const { updateBooking, isLoading } = useBookings();
  async function markCancelled() {
    updateBooking({ id: id, status: "check-in" } as Booking);
  }
  return (
    <div onClick={markCancelled} className="flex gap-2 items-center">
      <CircleX className="w-4 h-4 text-danger" /> Cancelled
    </div>
  );
}
