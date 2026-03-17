"use client";
import { useInventory } from "@/hooks/use-inventory";
import Header from "./_components/header";
import InventoryTable from "./_components/table/inventory-table";
import React from "react";
import {
  columns,
  INITIAL_VISIBLE_COLUMNS,
} from "./_components/table/constants";

export default function Room() {
  const { inventory, isLoading, error, fetchInventory } = useInventory();
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<any>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<any>(
    new Set(INITIAL_VISIBLE_COLUMNS)
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
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredInventory = [...inventory];

    if (hasSearchFilter) {
      filteredInventory = filteredInventory.filter((item) =>
        item.name?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (statusFilter !== "all" && Array.from(statusFilter).length) {
      filteredInventory = filteredInventory.filter((item) =>
        Array.from(statusFilter).includes(item.status)
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
  return (
    <div className="p-2 bg-white dark:bg-gray-900 rounded space-y-2">
      <Header />
      <InventoryTable
        items={items}
        inventory={inventory}
        headerColumns={headerColumns}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onRowsPerPageChange={onRowsPerPageChange}
        hasSearchFilter={hasSearchFilter}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        page={page}
        setPage={setPage}
        pages={pages}
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
        isLoading={isLoading}
      />
    </div>
  );
}
