import React from "react";

import { formatPHP } from "@/lib/format-php";
import { BookingSpecialRequest } from "@/types/add-on";
import { FetchRoomTypesParams, RoomType } from "@/types/room";

export default function BookingSummary({
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
    <div className="w-full space-y-3 rounded-2xl border border-[#e7dccd] bg-[#fcf8f2] p-5">
      <h2 className="font-serif text-2xl text-[#261f14]">Booking Summary</h2>
      <div className="grid grid-cols-1 gap-2 text-sm text-[#5f5548]">
        <div className="flex items-center justify-between">
          <span>Room</span>
          <span className="font-medium text-[#2d2418]">{room?.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Stay</span>
          <span className="font-medium text-[#2d2418]">
            {query.checkIn} to {query.checkOut}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Nights</span>
          <span className="font-medium text-[#2d2418]">{summary?.nights}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Room Rate / Night</span>
          <span className="font-medium text-[#2d2418]">
            {formatPHP(Number(summary?.roomPrice || 0))}
          </span>
        </div>

        {selectedAddOns.length > 0 ? (
          <div className="space-y-2 rounded-xl border border-[#e9ddcc] bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7a6f61]">
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
                <span className="font-medium text-[#2d2418]">
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
          <span className="font-medium text-[#2d2418]">
            {formatPHP(Number(summary?.totalPerNights || 0))}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Add-ons Subtotal</span>
          <span className="font-medium text-[#2d2418]">
            {formatPHP(Number(summary?.totalAddOnsPrice || 0))}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-[#ddcfba] pt-2 text-base">
          <span className="font-semibold text-[#241f1a]">Total</span>
          <span className="font-semibold text-[#241f1a]">
            {formatPHP(Number(summary?.total || 0))}
          </span>
        </div>
      </div>
    </div>
  );
}
