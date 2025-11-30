"use client";
import { useInventory } from "@/hooks/use-inventory";
import Header from "./_components/header";
import React from "react";
import {
  columns,
  INITIAL_VISIBLE_COLUMNS,
} from "@/app/constants/banquet-menus";
import { useBanquetMenus } from "@/hooks/use-banquet-menus";
import { BanquetMenuFetchParams } from "@/types/banquet";
import MenuTable from "./_components/table/menu-table";

export default function Menus() {
  const { menus, pagination, isLoading, fetchBanquetMenus } = useBanquetMenus();
  const [query, setQuery] = React.useState<BanquetMenuFetchParams>({});
  const [selectedKeys, setSelectedKeys] = React.useState<any>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<any>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  React.useEffect(() => {
    fetchBanquetMenus(query);
  }, [query]);

  return (
    <div className="p-2 bg-white dark:bg-gray-900 rounded ">
      <Header />
      <MenuTable
        menus={menus}
        pagination={pagination}
        query={query}
        setQuery={setQuery}
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        headerColumns={headerColumns}
        isLoading={isLoading}
      />
    </div>
  );
}
