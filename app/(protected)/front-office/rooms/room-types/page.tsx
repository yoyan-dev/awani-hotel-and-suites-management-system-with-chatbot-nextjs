"use client";
import Header from "./_components/header";
import RoomTypesTable from "./_components/table/room-types-table";
import { useRoomTypes } from "@/hooks/use-room-types";
import React from "react";
import { columns, INITIAL_VISIBLE_COLUMNS } from "@/app/constants/room-types";

export default function RoomTypes() {
  const { room_types, isLoading, error, fetchRoomTypes } = useRoomTypes();
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<any>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<any>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(room_types.length / rowsPerPage);
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredRoomTypes = [...room_types];

    if (hasSearchFilter) {
      filteredRoomTypes = filteredRoomTypes.filter((item) =>
        item.name?.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredRoomTypes;
  }, [room_types, filterValue, hasSearchFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [page, filteredItems, rowsPerPage]);

  const onRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  React.useEffect(() => {
    fetchRoomTypes({});
  }, []);
  return (
    <>
      <div className="p-2 bg-white dark:bg-gray-900 rounded space-y-2">
        <Header />
        <RoomTypesTable
          items={items}
          room_types={room_types}
          headerColumns={headerColumns}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          onRowsPerPageChange={onRowsPerPageChange}
          hasSearchFilter={hasSearchFilter}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          page={page}
          setPage={setPage}
          pages={pages}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
