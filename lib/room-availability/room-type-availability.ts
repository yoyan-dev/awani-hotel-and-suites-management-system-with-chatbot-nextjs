import { isRoomAvailable } from "./room-availabilty";
import { RoomType, Room } from "@/types/room";

export function filterAvailableRoomTypes(
  roomTypes: RoomType[],
  checkIn: string,
  checkOut: string,
): RoomType[] {
  return roomTypes
    .map((roomType) => {
      const availableRooms =
        roomType.rooms?.filter((room: Room) =>
          isRoomAvailable(room, checkIn, checkOut),
        ) || [];

      return {
        ...roomType,
        rooms: availableRooms,
      };
    })
    .filter((roomType) => roomType.rooms.length > 0);
}
