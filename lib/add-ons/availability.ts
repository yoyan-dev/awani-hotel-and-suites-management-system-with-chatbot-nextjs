import { BookingSpecialRequest } from "@/types/add-on";
import { RoomType } from "@/types/room";
import { ResolvedRoomTypeAddOn, getRoomTypeAddOns } from "./room-type-add-ons";

function parseQty(value: unknown) {
  const qty = Number(value ?? 0);
  return Number.isFinite(qty) ? Math.max(0, qty) : 0;
}

export function resolveRoomTypeAddOnAvailability(
  roomType: RoomType,
  requestsByAddOn: Record<string, number>,
) {
  return getRoomTypeAddOns(roomType).map((relation) => {
    const addOn = relation.add_on;
    const roomTypeAddOnId = String(relation.id ?? "");
    const addOnId = String(
      relation.inventory_id ?? relation.add_on_id ?? addOn?.id ?? "",
    );
    const quantityLimit = parseQty(relation.quantity_limit);
    const inventoryCapacity = parseQty((addOn as any)?.quantity);
    const maxCapacity =
      inventoryCapacity > 0
        ? Math.min(quantityLimit, inventoryCapacity)
        : quantityLimit;
    const reservedQty =
      requestsByAddOn[roomTypeAddOnId] ??
      requestsByAddOn[addOnId] ??
      requestsByAddOn[String(addOn?.name ?? "")] ??
      0;

    return {
      room_type_add_on_id: roomTypeAddOnId,
      inventory_id: addOnId,
      add_on_id: addOnId,
      name: String(addOn?.name ?? ""),
      price: Number(addOn?.price ?? 0),
      quantity_limit: quantityLimit,
      reserved_quantity: reservedQty,
      remaining_quantity: Math.max(0, maxCapacity - reservedQty),
      add_on_inventory: [],
    } as ResolvedRoomTypeAddOn;
  });
}

export function collectRequestedQuantities(
  specialRequests: BookingSpecialRequest[] | null | undefined,
) {
  const totals: Record<string, number> = {};
  for (const request of specialRequests ?? []) {
    const qty = parseQty(request.quantity);
    if (qty <= 0) continue;
    if (request.room_type_add_on_id) {
      totals[request.room_type_add_on_id] =
        (totals[request.room_type_add_on_id] ?? 0) + qty;
    }
    if (request.add_on_id) {
      totals[request.add_on_id] = (totals[request.add_on_id] ?? 0) + qty;
    }
    if (request.inventory_id) {
      totals[request.inventory_id] = (totals[request.inventory_id] ?? 0) + qty;
    }
    totals[String(request.name)] = (totals[String(request.name)] ?? 0) + qty;
  }
  return totals;
}
