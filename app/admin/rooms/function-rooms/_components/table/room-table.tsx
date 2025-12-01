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
import { RenderCell } from "./render-cell";
import { TableTopContent } from "./top-content";
import { TableBottomContent } from "./bottom-content";
import { ColumnType } from "@/types/column";
import {
  FetchFunctionRoomParams,
  FunctionRoom,
  FunctionRoomPagination,
} from "@/types/function-room";

interface RoomTableProps {
  rooms: FunctionRoom[];
  pagination: FunctionRoomPagination | null;
  query: FetchFunctionRoomParams;
  setQuery: React.Dispatch<React.SetStateAction<FetchFunctionRoomParams>>;
  selectedKeys: any;
  setSelectedKeys: React.Dispatch<React.SetStateAction<any>>;
  visibleColumns: any;
  setVisibleColumns: React.Dispatch<React.SetStateAction<any>>;
  headerColumns: ColumnType[];
  isLoading: boolean;
}

export default function RoomTable({
  rooms,
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
        pagination?.total && pagination?.total > 0 ? (
          <TableBottomContent
            query={query}
            setQuery={setQuery}
            pages={pagination?.totalPages ?? 0}
            selectedKeys={selectedKeys}
            roomsCount={pagination?.total}
          />
        ) : null
      }
      bottomContentPlacement="outside"
      selectedKeys={selectedKeys}
      topContent={
        <TableTopContent
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
        emptyContent="No function hall found"
        items={rooms}
        className="overflow-x-auto"
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell className="capitalize">
                <RenderCell room={item} columnKey={columnKey as string} />
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
