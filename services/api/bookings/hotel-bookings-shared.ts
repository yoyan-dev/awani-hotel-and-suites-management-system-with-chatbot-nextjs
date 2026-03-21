import { supabase } from "@/lib/supabase/supabase-client";
import { ROOM_TYPE_ADD_ONS_SELECT } from "@/lib/add-ons/selects";
import {
  collectRequestedQuantities,
  resolveRoomTypeAddOnAvailability,
} from "@/lib/add-ons/availability";
import { findRequestedAddOn } from "@/lib/add-ons/room-type-add-ons";
import { BookingSpecialRequest } from "@/types/add-on";
import { RoomType } from "@/types/room";

export const HOTEL_BOOKING_SELECT = `
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
  guest_breakdown,
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

export async function getRoomTypeWithAvailability(
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

export function sanitizeSpecialRequests(
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

export function computeTotalAddOns(specialRequests: BookingSpecialRequest[]) {
  return specialRequests.reduce(
    (total, item) =>
      total + Number(item.price ?? 0) * Number(item.quantity ?? 0),
    0,
  );
}
