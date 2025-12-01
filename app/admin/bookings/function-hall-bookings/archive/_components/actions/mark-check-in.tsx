import { useBookings } from "@/hooks/use-bookings";
import { useHousekeeping } from "@/hooks/use-housekeeping";
import { useRooms } from "@/hooks/use-rooms";
import { Booking } from "@/types/booking";
import { HousekeepingTask } from "@/types/housekeeping";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/react";
import { CircleCheckBig } from "lucide-react";
import React from "react";

export default function CheckInButton({ booking }: { booking: Booking }) {
  const { updateBooking } = useBookings();
  const { isLoading, addHousekeepingTask } = useHousekeeping();
  const { updateRoom } = useRooms();

  async function markCheckIn() {
    const specialRequests = (booking.special_requests ?? [])
      .map((req: any) => `${req.quantity} ${req.name}`)
      .join(", ");

    const tasks: Partial<HousekeepingTask> = {
      room_number: booking.room.room_number,
      guest_name: booking.user.guest_name,
      task_type: "Room Occupied",
      requests: specialRequests,
      message: `Guest checked in to Room ${booking.room.room_number}`,
      scheduled_time: new Date().toISOString(),
      status: "pending",
    };
    updateBooking({ id: booking.id, status: "check-in" } as Booking);
    addHousekeepingTask(tasks as HousekeepingTask);
    updateRoom({ id: booking.room_id, status: "dirty" });
    console.log(tasks);
    console.log(tasks);
  }
  return (
    <Tooltip className="capitalize" content="Mark check in">
      <Button
        isIconOnly
        variant="flat"
        onPress={markCheckIn}
        isLoading={isLoading}
        size="sm"
        color="success"
      >
        <CircleCheckBig />
      </Button>
    </Tooltip>
  );
}
