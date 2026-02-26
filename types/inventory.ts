export type InventoryStatus = "in-stock" | "out-of-stock" | "unavailable";

export interface Inventory {
  id?: string;
  name: string;
  quantity: number;
  description?: string;
  category: "toiletries" | "linens" | "minibar" | "cleaning_supply";
  createdAt?: any;
  status?: InventoryStatus;
  price?: number;
}

export interface InventoryUsage {
  usage_id: string;
  item_id: number;
  booking_id: number;
  used_by: "housekeeping" | "front_office";
  quantity: number;
  used_at: any;
}

export interface InventoryState {
  inventory: Inventory[];
  item: Inventory;
  isLoading: boolean;
  error?: string;
}
