import React from "react";
import { RoomTypeAmenity } from "@/types/room";
import { getRoomTypeAmenityNames } from "@/lib/room-types/amenities";

interface RoomTypeAmenitiesProps {
  amenities?: RoomTypeAmenity[] | null;
  className?: string;
  chipClassName?: string;
  emptyLabel?: string;
  maxItems?: number;
}

export default function RoomTypeAmenities({
  amenities,
  className = "flex flex-wrap gap-2",
  chipClassName = "rounded-full bg-[#f1e6d5] px-3 py-1 text-xs text-[#6a5f50]",
  emptyLabel = "No amenities listed.",
  maxItems,
}: RoomTypeAmenitiesProps) {
  const amenityNames = getRoomTypeAmenityNames(amenities);

  if (amenityNames.length === 0) {
    return <p className="text-sm text-[#7a6f62]">{emptyLabel}</p>;
  }

  const visibleAmenities =
    typeof maxItems === "number" ? amenityNames.slice(0, maxItems) : amenityNames;
  const hiddenCount = amenityNames.length - visibleAmenities.length;

  return (
    <div className={className}>
      {visibleAmenities.map((name) => (
        <span key={name} className={chipClassName}>
          {name}
        </span>
      ))}
      {hiddenCount > 0 ? (
        <span className={chipClassName}>+{hiddenCount} more</span>
      ) : null}
    </div>
  );
}
