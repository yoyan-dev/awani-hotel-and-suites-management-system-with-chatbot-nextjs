export interface AddOnInventoryRequirement {
  id?: string;
  add_on_id?: string;
  inventory_id: string;
  quantity_required: number;
  inventory?: {
    id: string;
    name: string | null;
    quantity: number | null;
    price?: number | null;
    status?: string | null;
    description?: string | null;
  } | null;
}

export interface AddOn {
  id?: string;
  name?: string;
  price?: number;
  created_at?: string;
  add_on_inventory?: AddOnInventoryRequirement[];
}

export interface RoomTypeAddOn {
  id?: string;
  room_type_id?: string;
  inventory_id?: string;
  add_on_id?: string;
  quantity_limit: number;
  remaining_quantity?: number;
  reserved_quantity?: number;
  add_on?: AddOn | null;
}

export interface BookingSpecialRequest {
  room_type_add_on_id?: string;
  inventory_id?: string;
  add_on_id?: string;
  name: string;
  price: string | number;
  quantity: number;
  quantity_limit?: number;
  remaining_quantity?: number;
}
