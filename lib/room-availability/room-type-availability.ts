import { isRoomAvailable } from "./room-availabilty";

export function filterAvailableRoomTypes(
  roomTypes: any[],
  checkIn: string,
  checkOut: string,
) {
  return roomTypes.filter((roomType) =>
    roomType.rooms?.some((room: any) =>
      isRoomAvailable(room, checkIn, checkOut),
    ),
  );
}
