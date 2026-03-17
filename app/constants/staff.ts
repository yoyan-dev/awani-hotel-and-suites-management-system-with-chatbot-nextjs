import { ColumnType } from "@/types/column";

export const columns: ColumnType[] = [
  { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "EMAIL", uid: "email" },
  { name: "ROLE", uid: "role", sortable: true },
  // { name: "SHIFT TYPE", uid: "shift_type", sortable: true },
  // { name: "PHONE", uid: "phone", sortable: true },
  // { name: "TEAM", uid: "team" },
  // { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export const rolesOptions = [
  { name: "Admin", uid: "admin" },
  { name: "Housekeeping", uid: "housekeeping" },
  { name: "Front Office", uid: "front_office" },
];

export const statusColorMap: Record<string, "success" | "danger" | "warning"> =
  {
    active: "success",
    paused: "danger",
    vacation: "warning",
  };

export const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "email",
  "role",
  "phone",
  "shift_type",
  "actions",
];
