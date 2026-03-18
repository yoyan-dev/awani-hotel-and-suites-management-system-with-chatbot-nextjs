"use client";
import Header from "./_components/header";
import InventoryTable from "./_components/table/inventory-table";
import { useFrontOfficeInventoryPage } from "@/hooks/front-office/use-front-office-inventory-page";

export default function Room() {
  const tableState = useFrontOfficeInventoryPage();

  return (
    <div className="p-2 bg-white dark:bg-gray-900 rounded space-y-2">
      <Header />
      <InventoryTable {...tableState} />
    </div>
  );
}
