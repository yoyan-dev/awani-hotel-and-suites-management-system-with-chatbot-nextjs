import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Selection,
} from "@heroui/react";
import { RenderCell } from "./render-cell";
import { TableTopContent } from "./top-content";
import { TableBottomContent } from "./bottom-content";
import { ColumnType } from "@/types/column";
import { Room } from "@/types/room";
import {
  FetchFunctionHallBookingParams,
  FunctionHallBooking,
  FunctionHallBookingPagination,
} from "@/types/function-room-booking";

interface BookingTableProps {
  bookings: FunctionHallBooking[];
  pagination: FunctionHallBookingPagination;
  query: FetchFunctionHallBookingParams;
  setQuery: React.Dispatch<
    React.SetStateAction<FetchFunctionHallBookingParams>
  >;
  headerColumns: ColumnType[];
  visibleColumns: Set<string>;
  setVisibleColumns: React.Dispatch<React.SetStateAction<Set<string>>>;
  selectedKeys: Selection;
  setSelectedKeys: React.Dispatch<React.SetStateAction<Selection>>;
  bookingLoading: boolean;
}

export default function FunctionHallBookingTable({
  bookings,
  pagination,
  query,
  setQuery,
  headerColumns,
  visibleColumns,
  setVisibleColumns,
  selectedKeys,
  setSelectedKeys,
  bookingLoading,
}: BookingTableProps) {
  return (
    <Table
      isHeaderSticky
      radius="none"
      classNames={{
        wrapper: ["shadow-none", "dark:bg-gray-900", "p-0", "table-auto"],
        th: "bg-primary text-white",
      }}
      aria-label="Rooms Table"
      rowHeight={40}
      bottomContent={
        <TableBottomContent
          query={query}
          setQuery={setQuery}
          pages={pagination.total_pages}
          selectedKeys={selectedKeys}
          itemsLength={pagination.total}
        />
      }
      bottomContentPlacement="outside"
      topContent={
        <TableTopContent
          bookings={bookings}
          pagination={pagination}
          query={query}
          setQuery={setQuery}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          bookingLoading={bookingLoading}
          bookingsCount={pagination.total}
          headerColumns={headerColumns}
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
        isLoading={bookingLoading}
        loadingContent={<Spinner label="Loading..." />}
        emptyContent="No bookings found"
        items={bookings}
      >
        {(item) => (
          <TableRow
            key={item.id}
            className={
              bookings.indexOf(item) % 2 === 0
                ? "bg-white dark:bg-gray-800"
                : "bg-gray-100 dark:bg-gray-900"
            }
          >
            {(columnKey) => (
              <TableCell className="capitalize">
                <RenderCell
                  booking={item}
                  columnKey={columnKey as string}
                  bookingLoading={bookingLoading}
                />
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
