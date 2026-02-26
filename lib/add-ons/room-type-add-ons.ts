import {
  BookingSpecialRequest,
  RoomTypeAddOn,
  AddOnInventoryRequirement,
} from "@/types/add-on";
import { RoomType } from "@/types/room";

export interface ResolvedRoomTypeAddOn {
  room_type_add_on_id: string;
  inventory_id: string;
  add_on_id: string;
  name: string;
  price: number;
  quantity_limit: number;
  reserved_quantity: number;
  remaining_quantity: number;
  add_on_inventory: AddOnInventoryRequirement[];
}

export function getRoomTypeAddOns(roomType?: RoomType | null): RoomTypeAddOn[] {
  return roomType?.room_type_add_ons ?? [];
}

export function findRequestedAddOn(
  addOns: ResolvedRoomTypeAddOn[],
  request: BookingSpecialRequest,
) {
  return addOns.find((row) => {
    if (request.room_type_add_on_id) {
      return row.room_type_add_on_id === request.room_type_add_on_id;
    }
    if (request.inventory_id) {
      return row.inventory_id === request.inventory_id;
    }
    if (request.add_on_id) {
      return row.add_on_id === request.add_on_id;
    }
    return row.name === request.name;
  });
}
