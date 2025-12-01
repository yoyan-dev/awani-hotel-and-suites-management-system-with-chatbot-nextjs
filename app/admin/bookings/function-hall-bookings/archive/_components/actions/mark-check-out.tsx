import { useBookings } from "@/hooks/use-bookings";
import { useHousekeeping } from "@/hooks/use-housekeeping";
import { useRooms } from "@/hooks/use-rooms";
import { Booking } from "@/types/booking";
import { HousekeepingTask } from "@/types/housekeeping";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/react";
import { CircleCheckBig } from "lucide-react";
import React from "react";

export default function CheckOutButton({ booking }: { booking: Booking }) {
  const [isLoading, setIsloading] = React.useState(false);
  const { updateBooking } = useBookings();
  const { addHousekeepingTask } = useHousekeeping();
  const { updateRoom } = useRooms();

  async function markCheckOut() {
    setIsloading(true);
    const tasks: Partial<HousekeepingTask> = {
      room_number: booking.room.room_number,
      guest_name: booking.user.guest_name,
      task_type: "Post Check-Out Cleaning",
      requests: "",
      message: `Guest ${booking.user.guest_name} checked out from Room ${booking.room.room_number}.`,
      scheduled_time: new Date().toISOString(),
      status: "pending",
    };
    await updateBooking({ id: booking.id, status: "check-out" } as Booking);
    await addHousekeepingTask(tasks as HousekeepingTask);
    await updateRoom({ id: booking.room_id, status: "dirty" });

    setIsloading(false);
    console.log(tasks);
  }
  return (
    <Tooltip className="capitalize" content="Mark check out">
      <Button
        isIconOnly
        variant="flat"
        onPress={markCheckOut}
        isLoading={isLoading}
        size="sm"
        color="warning"
      >
        <CircleCheckBig />
      </Button>
    </Tooltip>
  );
}
