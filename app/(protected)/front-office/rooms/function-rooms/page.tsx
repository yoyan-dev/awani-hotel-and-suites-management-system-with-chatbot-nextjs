"use client";
import { useRooms } from "@/hooks/use-rooms";
import Header from "./_components/header";
import RoomTable from "./_components/table/room-table";
import React from "react";
import { FetchRoomsParams } from "@/types/room";
import {
  columns,
  INITIAL_VISIBLE_COLUMNS,
} from "@/app/constants/function-rooms";
import { useFunctionRooms } from "@/hooks/use-function-rooms";

export default function FunctionRooms() {
  const { function_rooms, pagination, isLoading, fetchFunctionRooms } =
    useFunctionRooms();
  const [query, setQuery] = React.useState<FetchRoomsParams>({});
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
    fetchFunctionRooms(query);
  }, [query]);

  return (
    <div className="p-2 bg-white dark:bg-gray-900 rounded ">
      <Header />
      <RoomTable
        rooms={function_rooms}
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
