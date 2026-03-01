import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase-client";
import { ApiResponse } from "@/types/response";
import { filterAvailableRoomTypes } from "@/lib/room-availability/room-type-availability";
import { RoomType } from "@/types/room";
import {
  collectRequestedQuantities,
  resolveRoomTypeAddOnAvailability,
} from "@/lib/add-ons/availability";
import { ROOM_TYPE_ADD_ONS_SELECT } from "@/lib/add-ons/selects";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  const { searchParams } = new URL(req.url);

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const maxGuest = Number(searchParams.get("maxGuest") || 1);

  if (!checkIn || !checkOut) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Invalid request",
          description: "checkIn and checkOut are required",
          color: "danger",
        },
      },
      { status: 400 },
    );
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (
    Number.isNaN(checkInDate.getTime()) ||
    Number.isNaN(checkOutDate.getTime())
  ) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Invalid request",
          description: "checkIn and checkOut must be valid dates",
          color: "danger",
        },
      },
      { status: 400 },
    );
  }

  const normalizedCheckOut = checkOutDate < checkInDate ? checkIn : checkOut;

  /** Fetch room types + rooms */
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
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: error?.message || "Failed to fetch room types",
          color: "danger",
        },
      },
      { status: 500 },
    );
  }

  const roomTypeIds = roomTypes
    .map((roomType) => roomType.id)
    .filter((id): id is string => Boolean(id));

  if (roomTypeIds.length === 0) {
    return NextResponse.json(
      {
        success: true,
        message: {
          title: "Success",
          description: "Available room types fetched",
          color: "success",
        },
        data: [],
      },
      { status: 200 },
    );
  }

  /** Fetch overlapping bookings for filtered room types */
  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select("*")
    .in("room_type_id", roomTypeIds)
    .neq("status", "cancelled")
    .neq("status", "checked_out")
    .lte("checked_in", normalizedCheckOut)
    .gte("checked_out", checkIn);

  if (bookingsError) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: bookingsError.message,
          color: "danger",
        },
      },
      { status: 500 },
    );
  }

  /** Attach bookings to room types */
  const roomTypesWithBookings = roomTypes.map((roomType) => {
    const overlappingBookings =
      bookings?.filter(
        (b) => b.room_type_id === roomType.id && b.status !== "cancelled",
      ) || [];
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
      room_type_add_ons: (roomType.room_type_add_ons ?? []).map(
        (relation: any) => {
          const matched = availableAddOns.find(
            (row) => row.room_type_add_on_id === relation.id,
          );
          return {
            ...relation,
            reserved_quantity: matched?.reserved_quantity ?? 0,
            remaining_quantity: matched?.remaining_quantity ?? 0,
          };
        },
      ),
      bookings: overlappingBookings,
    } as RoomType;
  });

  /** Compute availability */
  const availableRoomTypes = filterAvailableRoomTypes(roomTypesWithBookings);

  return NextResponse.json(
    {
      success: true,
      message: {
        title: "Success",
        description: "Available room types fetched",
        color: "success",
      },
      data: availableRoomTypes,
    },
    { status: 200 },
  );
}
