import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase-client";
import { ApiResponse } from "@/types/response";
import { GenerateBookingNumber } from "@/lib/generate-booking-number";
import { ROOM_TYPE_ADD_ONS_SELECT } from "@/lib/add-ons/selects";
import {
  collectRequestedQuantities,
  resolveRoomTypeAddOnAvailability,
} from "@/lib/add-ons/availability";
import { findRequestedAddOn } from "@/lib/add-ons/room-type-add-ons";
import { BookingSpecialRequest } from "@/types/add-on";
import { RoomType } from "@/types/room";
import { TablesInsert } from "@/types/supabase";

async function getRoomTypeWithAvailability(
  roomTypeId: string,
  checkIn: string,
  checkOut: string,
  excludeBookingId?: string,
) {
  const { data: roomType, error: roomTypeError } = await supabase
    .from("room_types")
    .select(ROOM_TYPE_ADD_ONS_SELECT)
    .eq("id", roomTypeId)
    .single();

  if (roomTypeError || !roomType) {
    throw new Error(roomTypeError?.message || "Room type not found");
  }

  let query = supabase
    .from("bookings")
    .select("id, special_requests")
    .eq("room_type_id", roomTypeId)
    .not("status", "in", "(cancelled,completed,checked_out)")
    .lt("checked_in", checkOut)
    .gt("checked_out", checkIn);

  if (excludeBookingId) {
    query = query.neq("id", excludeBookingId);
  }

  const { data: overlappingBookings, error: overlapError } = await query;
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

  return {
    roomType,
    addOns: resolveRoomTypeAddOnAvailability(roomType as RoomType, totals),
  };
}

function sanitizeSpecialRequests(
  requests: BookingSpecialRequest[],
  availableAddOns: ReturnType<typeof resolveRoomTypeAddOnAvailability>,
) {
  const cleaned: BookingSpecialRequest[] = [];

  for (const request of requests ?? []) {
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

  return cleaned;
}

function computeTotalAddOns(specialRequests: BookingSpecialRequest[]) {
  return specialRequests.reduce(
    (total, item) =>
      total + Number(item.price ?? 0) * Number(item.quantity ?? 0),
    0,
  );
}

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
  places_last_visited,
  purpose,
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

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  const { searchParams } = new URL(req.url);

  const roomTypeID = searchParams.get("roomTypeID");
  const guest_id = searchParams.get("guest_id");
  const status = searchParams.get("status");

  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const page = Number(searchParams.get("page") || 1);
  const limitParam = searchParams.get("limit") || "10";
  const limit = limitParam === "all" ? null : Number(limitParam);

  const from = limit ? (page - 1) * limit : 0;
  const to = limit ? from + limit - 1 : undefined;

  let q = supabase
    .from("bookings")
    .select(BOOKING_SELECT, { count: "exact" })
    .order("created_at", { ascending: false });

  if (roomTypeID) q = q.eq("room_type_id", roomTypeID);
  if (guest_id) q = q.eq("guest_id", guest_id);
  if (status) q = q.eq("status", status);

  if (start && end) {
    q = q.gte("checked_in", start).lte("checked_in", end);
  }

  if (limit && to !== undefined) q = q.range(from, to);

  const { data, error, count } = await q;

  if (error) {
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

  return NextResponse.json(
    {
      success: true,
      message: {
        title: "Success",
        description: "",
        color: "success",
      },
      data: data ?? [],
      pagination: {
        page,
        limit: limit ?? 10,
        total: count ?? 0,
        total_pages:
          limitParam === "all" ? 1 : Math.ceil((count ?? 0) / (limit ?? 1)),
      },
    },
    { status: 200 },
  );
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const formData = await req.formData();
    const formObj = Object.fromEntries(formData.entries());
    const bookingNumber = await GenerateBookingNumber("hotel-room");

    if (!bookingNumber) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Unknown Error!",
            description: "Unknow Error, Please try again",
            color: "warning",
          },
        },
        { status: 400 },
      );
    }

    const roomTypeId = String(formObj.room_type_id ?? "");
    const checkedIn = String(formObj.checked_in ?? "");
    const checkedOut = String(formObj.checked_out ?? "");
    const guestId = String(formObj.guest_id ?? "");

    if (!guestId || !roomTypeId || !checkedIn || !checkedOut) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Invalid Data",
            description:
              "guest_id, room_type_id, checked_in, and checked_out are required.",
            color: "warning",
          },
        },
        { status: 400 },
      );
    }

    const requestedSpecialRequests = JSON.parse(
      String(formObj.special_requests ?? "[]"),
    ) as BookingSpecialRequest[];

    const { addOns } = await getRoomTypeWithAvailability(
      roomTypeId,
      checkedIn,
      checkedOut,
    );

    const specialRequests = sanitizeSpecialRequests(
      requestedSpecialRequests,
      addOns,
    );
    const totalAddOns = computeTotalAddOns(specialRequests);

    const newData: TablesInsert<"bookings"> = {
      booking_number: bookingNumber,
      guest_id: guestId,
      room_type_id: roomTypeId,
      room_id: formObj.room_id ? String(formObj.room_id) : null,
      checked_in: checkedIn,
      checked_out: checkedOut,
      number_of_guests: formObj.number_of_guests
        ? String(formObj.number_of_guests)
        : null,
      payment_status: formObj.payment_status
        ? String(formObj.payment_status)
        : null,
      payment_method: formObj.payment_method
        ? String(formObj.payment_method)
        : null,
      booking_source: formObj.booking_source
        ? String(formObj.booking_source)
        : "online",
      amount_paid: formObj.amount_paid ? Number(formObj.amount_paid) : null,
      total: formObj.total ? String(formObj.total) : null,
      status: formObj.status ? String(formObj.status) : "pending",
      special_requests:
        specialRequests as unknown as TablesInsert<"bookings">["special_requests"],
      total_add_ons: String(totalAddOns),
    };

    const newCheckIn = new Date(checkedIn);
    const newCheckOut = new Date(checkedOut);

    const { data: existingBookings, error: checkError } = await supabase
      .from("bookings")
      .select("id, checked_in, checked_out, status")
      .eq("guest_id", guestId)
      .not("status", "in", "(cancelled, completed, checked_out)");

    if (checkError) throw checkError;

    const hasOverlap = existingBookings?.some((booking) => {
      if (!booking.checked_in || !booking.checked_out) return false;
      const existingIn = new Date(booking.checked_in);
      const existingOut = new Date(booking.checked_out);
      return newCheckIn <= existingOut && newCheckOut >= existingIn;
    });

    if (hasOverlap) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Booking Restricted",
            description:
              "Guest already has an active booking during this period.",
            color: "warning",
          },
        },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert(newData)
      .select();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          {
            success: false,
            message: {
              title: "Error",
              description: "Booking already exists.",
              color: "danger",
            },
          },
          { status: 400 },
        );
      }
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

    return NextResponse.json(
      {
        success: true,
        message: {
          title: "Success",
          description: "Reservation successfully added.",
          color: "success",
        },
        data: data[0],
      },
      { status: 201 },
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: err.message,
          color: "danger",
        },
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json();
    const selectedValues: number[] | "all" = body.selectedValues;

    let query = supabase.from("bookings").delete();

    if (selectedValues === "all") {
      // delete all
    } else if (Array.isArray(selectedValues) && selectedValues.length > 0) {
      query = query.in("id", selectedValues.map(String));
    } else {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Error",
            description: selectedValues,
            color: "warning",
          },
        },
        { status: 400 },
      );
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Error",
            description: "Failed to delete items.",
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
        description:
          selectedValues === "all"
            ? "All items deleted successfully"
            : "Selected items deleted successfully",
        color: "success",
      },
      data,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: err.message,
          color: "error",
        },
        error: err.message,
      },
      { status: 500 },
    );
  }
}
