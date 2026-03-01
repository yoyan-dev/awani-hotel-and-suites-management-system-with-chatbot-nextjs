import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase-client";
import { ApiResponse } from "@/types/response";
import { ROOM_TYPE_ADD_ONS_SELECT } from "@/lib/add-ons/selects";
import {
  collectRequestedQuantities,
  resolveRoomTypeAddOnAvailability,
} from "@/lib/add-ons/availability";
import { findRequestedAddOn } from "@/lib/add-ons/room-type-add-ons";
import { BookingSpecialRequest } from "@/types/add-on";
import { RoomType } from "@/types/room";

const BOOKING_SELECT = `
  id,
  booking_number,
  room_id,
  guest_id,
  room_type_id,
  checked_in,
  checked_out,
  total_add_ons,
  total,
  company,
  special_requests,
  number_of_guests,
  recent_sickness,
  payment_status,
  payment_method,
  booking_source,
  amount_paid,
  status,
  created_at,
  room_type:room_type_id(${ROOM_TYPE_ADD_ONS_SELECT}),
  room:room_id (*),
  user:guest_id (*)
`;

async function resolveAndValidateRequests(
  roomTypeId: string,
  checkedIn: string,
  checkedOut: string,
  rawRequests: BookingSpecialRequest[],
  bookingId: string,
) {
  const { data: roomType, error: roomTypeError } = await supabase
    .from("room_types")
    .select(ROOM_TYPE_ADD_ONS_SELECT)
    .eq("id", roomTypeId)
    .single();

  if (roomTypeError || !roomType) {
    throw new Error(roomTypeError?.message || "Room type not found");
  }

  const { data: overlappingBookings, error: overlapError } = await supabase
    .from("bookings")
    .select("id, special_requests")
    .eq("room_type_id", roomTypeId)
    .not("status", "in", "(cancelled,completed,checked_out)")
    .lt("checked_in", checkedOut)
    .gt("checked_out", checkedIn)
    .neq("id", bookingId);

  if (overlapError) {
    throw new Error(overlapError.message);
  }

  const totals = collectRequestedQuantities(
    (overlappingBookings ?? []).flatMap((booking) =>
      Array.isArray(booking.special_requests)
        ? (booking.special_requests.filter((request) =>
            Boolean(request && typeof request === "object"),
          ) as unknown as BookingSpecialRequest[])
        : [],
    ),
  );
  const availableAddOns = resolveRoomTypeAddOnAvailability(
    roomType as RoomType,
    totals,
  );

  const cleaned: BookingSpecialRequest[] = [];
  for (const request of rawRequests ?? []) {
    const qty = Number(request.quantity ?? 0);
    if (!Number.isFinite(qty) || qty <= 0) continue;

    const addOn = findRequestedAddOn(availableAddOns, request);
    if (!addOn) {
      throw new Error(`Invalid add-on request: ${request.name}`);
    }
    if (qty > addOn.remaining_quantity) {
      throw new Error(
        `${addOn.name} only has ${addOn.remaining_quantity} remaining`,
      );
    }

    cleaned.push({
      room_type_add_on_id: addOn.room_type_add_on_id,
      inventory_id: addOn.inventory_id,
      add_on_id: addOn.add_on_id,
      name: addOn.name,
      price: addOn.price,
      quantity: qty,
      quantity_limit: addOn.quantity_limit,
      remaining_quantity: addOn.remaining_quantity - qty,
    });
  }

  const totalAddOns = cleaned.reduce(
    (total, item) =>
      total + Number(item.price ?? 0) * Number(item.quantity ?? 0),
    0,
  );

  return { cleaned, totalAddOns };
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  const { id } = await context.params;

  const { data: booking, error } = await supabase
    .from("bookings")
    .select(BOOKING_SELECT)
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "API Error",
          description: error.message,
          color: "danger",
        },
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: {
        title: "success",
        description: "",
        color: "success",
      },
      data: booking,
    },
    { status: 201 },
  );
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const { data: existingBooking, error: existingError } = await supabase
      .from("bookings")
      .select("id, room_type_id, checked_in, checked_out, special_requests")
      .eq("id", id)
      .single();

    if (existingError || !existingBooking) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Error",
            description: existingError?.message || "Item not found",
            color: "error",
          },
        },
        { status: existingError ? 500 : 404 },
      );
    }

    const roomTypeId = String(
      body.room_type_id ?? existingBooking.room_type_id,
    );
    const checkedIn = String(body.checked_in ?? existingBooking.checked_in);
    const checkedOut = String(body.checked_out ?? existingBooking.checked_out);

    const rawRequests = (body.special_requests ??
      existingBooking.special_requests ??
      []) as BookingSpecialRequest[];

    const { cleaned, totalAddOns } = await resolveAndValidateRequests(
      roomTypeId,
      checkedIn,
      checkedOut,
      rawRequests,
      id,
    );

    const payload = {
      ...body,
      special_requests: cleaned,
      total_add_ons: totalAddOns,
    };

    const { data, error } = await supabase
      .from("bookings")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Database Error",
            description: error.message,
            color: "error",
          },
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: {
        title: "Success",
        description: "Booking updated successfully",
        color: "success",
      },
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: error.message,
          color: "danger",
        },
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  const { id } = await context.params;

  const { error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: error.message,
          color: "error",
        },
      },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: {
        title: "Success",
        description: "Item deleted successfully",
        color: "success",
      },
    },
    { status: 200 },
  );
}
