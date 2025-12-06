"use client";
import { useRooms } from "@/hooks/use-rooms";
import Header from "./_components/header";
import RoomTable from "./_components/table/room-table";
import React from "react";
import { FetchRoomsParams } from "@/types/room";
import {
  columns,
  HOUSEKEEPING_INITIAL_VISIBLE_COLUMNS,
} from "@/app/constants/rooms";
import RoomStats from "./_components/room-stats";
import { formatDate } from "@/utils/format-date";
import { useRoomTypes } from "@/hooks/use-room-types";

export default function RoomList() {
  const {
    rooms,
    analytics,
    pagination,
    isLoading,
    fetchRooms,
    fetchAnalytics,
  } = useRooms();
  const { room_types, fetchRoomTypes } = useRoomTypes();
  const [query, setQuery] = React.useState<FetchRoomsParams>({});
  const [selectedKeys, setSelectedKeys] = React.useState<any>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<any>(
    new Set(HOUSEKEEPING_INITIAL_VISIBLE_COLUMNS)
  );
  const [selectedDate, setSelectedDate] = React.useState(
    formatDate(new Date())
  );

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  React.useEffect(() => {
    fetchRooms(query);
  }, [query]);

  React.useEffect(() => {
    fetchAnalytics();
  }, [selectedDate]);

  React.useEffect(() => {
    fetchRoomTypes({});
  }, []);

  return (
    <div className="p-2 md:p-4 bg-white dark:bg-gray-900 rounded ">
      <Header />
      <RoomStats analytics={analytics} />
      <RoomTable
        rooms={rooms}
        roomTypes={room_types}
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
