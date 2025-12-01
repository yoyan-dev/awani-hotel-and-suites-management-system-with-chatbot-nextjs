import type { ColumnType } from "@/types/column";

export const columns: ColumnType[] = [
  { name: "ID", uid: "id", sortable: true },
  { name: "", uid: "image" },
  { name: "ROOM NUMBER", uid: "room_number" },
  { name: "ROOM TYPE", uid: "type" },
  { name: "SIZE", uid: "size" },
  { name: "DESCRIPTION", uid: "description" },
  { name: "REMARKS", uid: "remarks" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

export const statusOptions = [
  { name: "Stock Room", uid: "stock-room" },
  { name: "VC", uid: "vaccant" },
  { name: "OS", uid: "out_of_service" },
  { name: "OCC", uid: "occupied" },
  { name: "Maintenance", uid: "maintenance" },
];

export const statusColorMap: Record<
  string,
  "success" | "danger" | "warning" | "secondary" | "default"
> = {
  available: "success",
  cleaning: "secondary",
  reserved: "warning",
  occupied: "warning",
  maintenance: "danger",
  out_of_service: "default",
};

export const INITIAL_VISIBLE_COLUMNS = [
  "room_number",
  "image",
  "type",
  "max_guest",
  "size",
  "description",
  "status",
  "remarks",
  "actions",
];

export const HOUSEKEEPING_INITIAL_VISIBLE_COLUMNS = [
  "room_id",
  "room_number",
  "room_type",
  "remarks",
  "status",
  "actions",
];
