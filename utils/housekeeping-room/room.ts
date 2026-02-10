import { parseISO } from "date-fns";
import { RoomStatus } from "@/types/room";
import { CleaningStatus, HousekeepingSummary } from "@/types/housekeeping";

export const getRoomStatusFromBooking = (
  bookings: Record<string, unknown>[],
) => {
  const today = new Date();
  const activeBooking = bookings.find((b) => {
    const checkIn = b.checked_in as string;
    const checkOut = b.checked_out as string;
    if (!checkIn || !checkOut) return false;
    const inDate = parseISO(checkIn);
    const outDate = parseISO(checkOut);
    return inDate <= today && outDate >= today;
  });
  return activeBooking ? "occupied" : "available";
};

export const calculateSummary = (
  rooms: Record<string, unknown>[],
  roomBookings: Map<string, Record<string, unknown>[]>,
): HousekeepingSummary => {
  const byStatus: Record<string, number> = {
    stock_room: 0,
    vacant: 0,
    vacant_dirty: 0,
    dirty: 0,
    out_of_service: 0,
    occupied: 0,
    maintenance: 0,
  };

  let pendingCleaning = 0;
  let readyForCheckIn = 0;
  let requiresAttention = 0;
  let cleanRoom = 0;
  let dirtyRoom = 0;
  let notAvailableRoom = 0;

  rooms.forEach((room) => {
    const status = (room.status as string) || "available";
    byStatus[status] = (byStatus[status] || 0) + 1;

    const bookings = roomBookings.get(room.id as string) || [];
    const roomStatus = getRoomStatusFromBooking(bookings);

    if (status === "dirty" || status === "vacant_dirty") {
      dirtyRoom++;
      pendingCleaning++;
    }
    if (status === "vacant") {
      readyForCheckIn++;
      cleanRoom++;
    }
    if (
      ["maintenance", "out_of_service", "stock_room"].includes(status) ||
      roomStatus === "occupied"
    ) {
      notAvailableRoom++;
      requiresAttention++;
    }
  });

  return {
    total_rooms: rooms.length,
    by_status: byStatus as Record<RoomStatus, number>,
    by_cleaning_status: {
      clean: cleanRoom,
      dirty: dirtyRoom,
      not_available: notAvailableRoom,
    } as Record<CleaningStatus, number>,
    pending_cleaning: pendingCleaning,
    ready_for_checked_in: readyForCheckIn,
    requires_attention: requiresAttention,
  };
};
