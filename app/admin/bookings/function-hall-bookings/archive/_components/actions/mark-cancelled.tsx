import { useBookings } from "@/hooks/use-bookings";
import { Booking } from "@/types/booking";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/react";
import { CircleCheckBig, CircleX } from "lucide-react";
import React from "react";

export default function markCancelled({ id }: { id: string }) {
  const { updateBooking, isLoading } = useBookings();
  async function markCancelled() {
    updateBooking({ id: id, status: "check-in" } as Booking);
  }
  return (
    <Tooltip className="capitalize" content="Cancelled">
      <Button
        isIconOnly
        variant="bordered"
        onPress={markCancelled}
        isLoading={isLoading}
        size="sm"
        color="danger"
      >
        <CircleX />
      </Button>
    </Tooltip>
  );
}
