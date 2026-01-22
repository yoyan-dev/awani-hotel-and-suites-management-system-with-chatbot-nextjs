"use client";
import Header from "./_components/header";
import React from "react";
import {
  columns,
  INITIAL_VISIBLE_COLUMNS,
} from "@/app/constants/banquet-package";
import BanquetPackageTable from "./_components/table/banquet-package-table";
import { useBanquetPackages } from "@/hooks/use-banquet-packages";
import { BanquetPackageFetchParams } from "@/types/banquet-package";

export default function BanquetPackage() {
  const { items, pagination, isLoading, fetchBanquetPackages } =
    useBanquetPackages();
  const [query, setQuery] = React.useState<BanquetPackageFetchParams>(
    {} as BanquetPackageFetchParams
  );
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
    fetchBanquetPackages(query);
  }, [query]);

  return (
    <div className="p-2 bg-white dark:bg-gray-900 rounded ">
      <Header />
      <BanquetPackageTable
        items={items}
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
