import {
  collectRequestedQuantities,
  resolveRoomTypeAddOnAvailability,
} from "@/lib/add-ons/availability";
import { ROOM_TYPE_ADD_ONS_SELECT } from "@/lib/add-ons/selects";
import { ApiRouteError } from "@/lib/api/route-error";
import { computeFunctionRoomAvailabilityByDate } from "@/lib/function-room/function-room-availability";
import { filterAvailableRoomTypes } from "@/lib/room-availability/room-type-availability";
import { supabase } from "@/lib/supabase/supabase-client";
import { FunctionRoom } from "@/types/function-room";
import { RoomType } from "@/types/room";

export async function listAvailableRooms(params: {
  isStatusSelected?: string;
  roomTypeID?: string;
  status?: string;
  checkIn?: string;
  checkOut?: string;
  roomId?: string;
}) {
  const {
    isStatusSelected,
    roomTypeID = "",
    status = "",
    checkIn = "",
    checkOut = "",
    roomId = "",
  } = params;

  const allowedStatuses = [
    "vacant",
    "dirty",
    "occupied",
    "available",
    "booked",
  ];

  let queryRooms = supabase.from("rooms").select(`
    id,
    room_id,
    room_number,
    room_type_id,
    room_type:room_type_id (*),
    area,
    description,
    status,
    remarks
  `);
  let queryBookings = supabase.from("bookings").select(`
    id,
    booking_number,
    room_id,
    guest_id,
    room_type_id,
    checked_in,
    checked_out
  `);

  if (isStatusSelected) queryRooms = queryRooms.in("status", allowedStatuses);
  if (roomTypeID) {
    queryRooms = queryRooms.eq("room_type_id", roomTypeID);
    queryBookings = queryBookings.eq("room_type_id", roomTypeID);
  }
  if (status) queryRooms = queryRooms.eq("status", status);
  if (roomId) queryRooms = queryRooms.eq("room_id", roomId);
  if (checkIn && checkOut) {
    queryBookings = queryBookings.lte("checked_in", checkOut).gte("checked_out", checkIn);
  }

  const { data: rooms, error: roomError } = await queryRooms;
  const { data: bookings, error: bookingError } = await queryBookings;

  if (roomError || bookingError) {
    throw new ApiRouteError(roomError?.message || bookingError?.message || "Failed to fetch rooms");
  }

  return (rooms ?? []).map((room) => {
    const roomBookings = (bookings ?? []).filter((b: any) => b.room_id === room.id);
    const hasOverlap = roomBookings.some((b: any) => {
      return b.checked_in <= checkOut && b.checked_out >= checkIn;
    });

    return {
      ...room,
      availability: hasOverlap
        ? "Not available on the selected date"
        : "Available on the selected date",
    };
  });
}

export async function listAvailableRoomTypes(params: {
  checkIn: string | null;
  checkOut: string | null;
  maxGuest: number;
}) {
  const { checkIn, checkOut, maxGuest } = params;

  if (!checkIn || !checkOut) {
    throw new ApiRouteError("checkIn and checkOut are required", {
      status: 400,
      title: "Invalid request",
    });
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
    throw new ApiRouteError("checkIn and checkOut must be valid dates", {
      status: 400,
      title: "Invalid request",
    });
  }

  const normalizedCheckOut = checkOutDate < checkInDate ? checkIn : checkOut;

  const { data: roomTypes, error } = await supabase
    .from("room_types")
    .select(
      `
        ${ROOM_TYPE_ADD_ONS_SELECT},
        rooms (
          id,
          room_number
        )
      `,
    )
    .gte("max_guest", maxGuest)
    .order("max_guest", { ascending: true });

  if (error || !roomTypes) {
    throw new ApiRouteError(error?.message || "Failed to fetch room types");
  }

  const roomTypeIds = roomTypes.map((roomType) => roomType.id).filter((id): id is string => Boolean(id));
  if (roomTypeIds.length === 0) {
    return [];
  }

  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select("*")
    .in("room_type_id", roomTypeIds)
    .neq("status", "cancelled")
    .neq("status", "checked_out")
    .lte("checked_in", normalizedCheckOut)
    .gte("checked_out", checkIn);

  if (bookingsError) {
    throw new ApiRouteError(bookingsError.message);
  }

  const roomTypesWithBookings = roomTypes.map((roomType) => {
    const overlappingBookings =
      bookings?.filter((b) => b.room_type_id === roomType.id && b.status !== "cancelled") || [];
    const totals = collectRequestedQuantities(
      overlappingBookings.flatMap((b) =>
        Array.isArray(b.special_requests)
          ? (b.special_requests.filter((request) =>
              Boolean(request && typeof request === "object"),
            ) as any[])
          : [],
      ),
    );
    const availableAddOns = resolveRoomTypeAddOnAvailability(
      roomType as RoomType,
      totals,
    );

    return {
      ...roomType,
      room_type_add_ons: (roomType.room_type_add_ons ?? []).map((relation: any) => {
        const matched = availableAddOns.find(
          (row) => row.room_type_add_on_id === relation.id,
        );
        return {
          ...relation,
          reserved_quantity: matched?.reserved_quantity ?? 0,
          remaining_quantity: matched?.remaining_quantity ?? 0,
        };
      }),
      bookings: overlappingBookings,
    } as RoomType;
  });

  return filterAvailableRoomTypes(roomTypesWithBookings);
}

export async function listAvailableFunctionRooms(params: {
  status?: string;
  start?: string;
  end?: string;
}) {
  const { status = "", start = "", end = "" } = params;
  let roomQuery = supabase.from("function_rooms").select("*");
  if (status) {
    roomQuery = roomQuery.eq("status", status);
  }

  const { data: rooms, error } = await roomQuery;
  if (error || !rooms) {
    throw new ApiRouteError(error?.message ?? "Unknown error", {
      title: "Database Error",
    });
  }

  const roomsWithBookings = await Promise.all(
    rooms.map(async (room) => {
      const { data: bookings, error: bookingsError } = await supabase
        .from("function_hall_bookings")
        .select("*")
        .eq("room_id", room.id);

      if (bookingsError) {
        return { ...room, function_hall_bookings: [] };
      }

      return { ...room, function_hall_bookings: bookings || [] };
    }),
  );

  return start || end
    ? computeFunctionRoomAvailabilityByDate(
        roomsWithBookings as unknown as FunctionRoom[],
        start,
        end,
      )
    : roomsWithBookings;
}
