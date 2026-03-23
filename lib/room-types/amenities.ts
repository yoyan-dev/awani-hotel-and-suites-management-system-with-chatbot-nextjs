import { RoomTypeAmenity } from "@/types/room";

export function normalizeRoomTypeAmenityName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function getRoomTypeAmenityNames(
  amenities?: RoomTypeAmenity[] | null,
) {
  const deduped = new Map<string, string>();

  for (const item of amenities ?? []) {
    const normalized = normalizeRoomTypeAmenityName(
      String(item.name ?? item.amenity?.name ?? ""),
    );

    if (!normalized) continue;

    const key = normalized.toLowerCase();
    if (!deduped.has(key)) {
      deduped.set(key, normalized);
    }
  }

  return Array.from(deduped.values());
}
