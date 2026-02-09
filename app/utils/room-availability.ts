import { Room } from "@/types/room";

export function getAvailableRooms(
  rooms: Room[],
  checked_in: any,
  checked_out: any,
) {
  return rooms.map((room) => {
    const hasOverlap = room.bookings?.some(
      (b) => b.checked_in < checked_out && b.checked_out > checked_in,
    );

    return {
      ...room,
      availability: hasOverlap
        ? "Not available on the selected date"
        : "Available on the selected date",
    };
  });
}
