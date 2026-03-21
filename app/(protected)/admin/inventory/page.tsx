"use client";
import Header from "./_components/header";
import InventoryTable from "./_components/table/inventory-table";
import { useAdminInventoryPage } from "@/hooks/admin/use-admin-inventory-page";

export default function Room() {
  const tableState = useAdminInventoryPage();

  return (
    <div className="p-2 bg-white dark:bg-gray-900 rounded space-y-2">
      <Header />
      <InventoryTable {...tableState} />
    </div>
  );
}
