"use client";

import React from "react";
import { useInventory } from "@/hooks/use-inventory";

const inventoryColumns = [
  { name: "ID", uid: "id" },
  { name: "NAME", uid: "name" },
  { name: "DESCRIPTION", uid: "description" },
  { name: "QUANTITY", uid: "quantity" },
  { name: "PRICE", uid: "price" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const inventoryInitialVisibleColumns = [
  "id",
  "name",
  "description",
  "quantity",
  "price",
  "status",
  "actions",
];

export function useHousekeepingInventoryPage() {
  const { inventory, isLoading, error, fetchInventory } = useInventory();
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<any>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<any>(
    new Set(inventoryInitialVisibleColumns),
  );
  const [statusFilter, setStatusFilter] = React.useState<any>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    fetchInventory();
    console.log(error);
  }, [error]);

  const pages = Math.ceil(inventory.length / rowsPerPage);
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return inventoryColumns;
    return inventoryColumns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredInventory = [...inventory];

    if (hasSearchFilter) {
      filteredInventory = filteredInventory.filter((item) =>
        item.name?.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    if (statusFilter !== "all" && Array.from(statusFilter).length) {
      filteredInventory = filteredInventory.filter((item) =>
        Array.from(statusFilter).includes(item.status),
      );
    }

    return filteredInventory;
  }, [inventory, filterValue, statusFilter, hasSearchFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [page, filteredItems, rowsPerPage]);

  const onRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  return {
    items,
    inventory,
    headerColumns,
    visibleColumns,
    setVisibleColumns,
    onRowsPerPageChange,
    hasSearchFilter,
    filterValue,
    setFilterValue,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    pages,
    selectedKeys,
    setSelectedKeys,
    isLoading,
  };
}
