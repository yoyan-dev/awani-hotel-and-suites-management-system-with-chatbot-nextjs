export const inventoryColumns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "ITEM", uid: "name", sortable: true },
  { name: "DESCRIPTION", uid: "description" },
  { name: "QUANTITY", uid: "quantity", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTION", uid: "actions" },
];

export const inventoryInitialVisibleColumns = [
  "name",
  "description",
  "quantity",
  "status",
  "actions",
];
