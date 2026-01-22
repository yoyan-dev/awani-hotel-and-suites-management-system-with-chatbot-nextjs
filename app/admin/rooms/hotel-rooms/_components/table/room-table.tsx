import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@heroui/react";
import { columns, INITIAL_VISIBLE_COLUMNS } from "@/app/constants/rooms";
import { RenderCell } from "./render-cell";
import { TableTopContent } from "./top-content";
import { TableBottomContent } from "./bottom-content";
import { useSelector, useDispatch } from "react-redux";
import { fetchRooms } from "@/features/room/room-thunk";
import type { RootState, AppDispatch } from "@/store/store";
import { FetchRoomsParams, Room, RoomPagination, RoomType } from "@/types/room";
import { ColumnType } from "@/types/column";

interface RoomTableProps {
  rooms: Room[];
  roomTypes: RoomType[];
  pagination: RoomPagination | null;
  query: FetchRoomsParams;
  setQuery: React.Dispatch<React.SetStateAction<FetchRoomsParams>>;
  selectedKeys: any;
  setSelectedKeys: React.Dispatch<React.SetStateAction<any>>;
  visibleColumns: any;
  setVisibleColumns: React.Dispatch<React.SetStateAction<any>>;
  headerColumns: ColumnType[];
  isLoading: boolean;
}

export default function RoomTable({
  rooms,
  roomTypes,
  pagination,
  query,
  setQuery,
  selectedKeys,
  setSelectedKeys,
  visibleColumns,
  setVisibleColumns,
  headerColumns,
  isLoading,
}: RoomTableProps) {
  return (
    <Table
      aria-label="Rooms Table"
      isHeaderSticky
      classNames={{ wrapper: ["shadow-none", "dark:bg-gray-900", "p-0"] }}
      bottomContent={
        <TableBottomContent
          query={query}
          setQuery={setQuery}
          pages={pagination?.total_pages ?? 0}
          selectedKeys={selectedKeys}
          roomsCount={pagination?.total}
        />
      }
      bottomContentPlacement="outside"
      selectedKeys={selectedKeys}
      topContent={
        <TableTopContent
          roomTypes={roomTypes}
          query={query}
          setQuery={setQuery}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          roomsCount={pagination?.total}
          selectedKeys={selectedKeys}
        />
      }
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        loadingContent={<Spinner label="Loading..." />}
        emptyContent="No rooms found"
        items={rooms}
        className="overflow-x-auto"
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell className="capitalize min-w-40">
                <RenderCell room={item} columnKey={columnKey as string} />
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
