import { Booking } from "@/types/booking";
import { RoomType } from "@/types/room";

export function filterAvailableRoomTypes(
  roomTypes: RoomType[],
): RoomType[] {
  return roomTypes
    .map((roomType) => {
      const rooms = roomType.rooms ?? [];
      const bookings = ((roomType as any).bookings ?? []) as Booking[];

      const bookedRoomIds = new Set(
        bookings
          .map((booking) => booking.room_id)
          .filter((roomId): roomId is string => Boolean(roomId)),
      );

      const unassignedBookingsCount = bookings.filter(
        (booking) => !booking.room_id,
      ).length;

      const candidateRooms = rooms.filter((room) => {
        if (!room.id) return true;
        return !bookedRoomIds.has(room.id);
      });
      const remainingSlots = Math.max(
        0,
        candidateRooms.length - unassignedBookingsCount,
      );
      const availableRooms = candidateRooms.slice(0, remainingSlots);

      return {
        ...roomType,
        rooms: availableRooms,
      };
    })
    .filter((roomType) => roomType.rooms.length > 0);
}
