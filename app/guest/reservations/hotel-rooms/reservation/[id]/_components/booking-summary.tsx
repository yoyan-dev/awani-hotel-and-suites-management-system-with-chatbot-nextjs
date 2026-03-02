import { formatPHP } from "@/lib/format-php";
import { BookingSpecialRequest } from "@/types/add-on";
import { FetchRoomTypesParams, RoomType } from "@/types/room";
import React from "react";

export default function bookingSummary({
  summary,
  query,
  room,
  selectedAddOns,
}: {
  summary: {
    roomPrice: number;
    totalAddOnsPrice: number;
    nights: number;
    totalPerNights: number;
    total: number;
    specialRequests: BookingSpecialRequest[];
  } | null;
  query: FetchRoomTypesParams;
  room: RoomType | null;
  selectedAddOns: BookingSpecialRequest[];
}) {
  return (
    <div className="w-full rounded-xl border border-default-200 bg-content2/30 p-4 space-y-3">
      <h2 className="text-base font-semibold">Booking Summary</h2>
      <div className="grid grid-cols-1 gap-2 text-sm text-default-700 dark:text-default-300">
        <div className="flex items-center justify-between">
          <span>Room</span>
          <span className="font-medium">{room?.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Stay</span>
          <span className="font-medium">
            {query.checkIn} to {query.checkOut}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Nights</span>
          <span className="font-medium">{summary?.nights}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Room Rate / Night</span>
          <span className="font-medium">
            {formatPHP(Number(summary?.roomPrice || 0))}
          </span>
        </div>
        {selectedAddOns.length > 0 ? (
          <div className="space-y-2 rounded-lg border border-default-200 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-default-500">
              Selected Add-ons
            </p>
            {selectedAddOns.map((item) => (
              <div
                key={item.room_type_add_on_id ?? item.add_on_id ?? item.name}
                className="flex items-center justify-between text-xs"
              >
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span className="font-medium">
                  {formatPHP(
                    Number(item.price || 0) * Number(item.quantity || 0),
                  )}
                </span>
              </div>
            ))}
          </div>
        ) : null}
        <div className="flex items-center justify-between">
          <span>Room Subtotal</span>
          <span className="font-medium">
            {formatPHP(Number(summary?.totalPerNights || 0))}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Add-ons Subtotal</span>
          <span className="font-medium">
            {formatPHP(Number(summary?.totalAddOnsPrice || 0))}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-default-200 pt-2 text-base">
          <span className="font-semibold">Total</span>
          <span className="font-semibold">
            {formatPHP(Number(summary?.total || 0))}
          </span>
        </div>
      </div>
    </div>
  );
}
