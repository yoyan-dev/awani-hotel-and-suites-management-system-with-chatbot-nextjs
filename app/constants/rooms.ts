import type { ColumnType } from "@/types/column";
import {
  Archive,
  BedDouble,
  CheckCircle,
  DoorOpen,
  Users,
  Wrench,
} from "lucide-react";

export const columns: ColumnType[] = [
  { name: "ID", uid: "id", sortable: true },
  { name: "ROOM ID", uid: "room_id" },
  { name: "ROOM NUMBER", uid: "room_number" },
  { name: "ROOM TYPE", uid: "room_type" },
  { name: "AREA", uid: "area" },
  { name: "DESCRIPTION", uid: "description" },
  { name: "REMARKS", uid: "remarks" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

export const statusOptions = [
  { name: "Stock Room", uid: "stock-room" },
  { name: "VC", uid: "vacant" },
  { name: "Booked", uid: "booked" },
  { name: "OS", uid: "out_of_service" },
  { name: "OCC", uid: "occupied" },
  { name: "Maintenance", uid: "maintenance" },
];

export const statusColorMap: Record<
  string,
  "success" | "danger" | "warning" | "secondary" | "default"
> = {
  vacant: "success",
  cleaning: "secondary",
  reserved: "warning",
  occupied: "warning",
  maintenance: "default",
  out_of_service: "danger",
};

export const ROOM_STATUS_CONFIG = {
  vacant: {
    label: "Vacant",
    color: "success",
    icon: DoorOpen,
  },
  occupied: {
    label: "Occupied",
    color: "warning",
    icon: Users,
  },
  clean: {
    label: "Clean",
    color: "success",
    icon: CheckCircle,
  },
  dirty: {
    label: "Dirty",
    color: "danger",
    icon: BedDouble,
  },
  maintenance: {
    label: "Maintenance",
    color: "secondary",
    icon: Wrench,
  },
  out_of_service: {
    label: "Out of Service",
    color: "danger",
    icon: Archive,
  },
};

export const INITIAL_VISIBLE_COLUMNS = [
  "room_id",
  "room_number",
  "room_type",
  "area",
  "max_guest",
  "base_price",
  "status",
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
