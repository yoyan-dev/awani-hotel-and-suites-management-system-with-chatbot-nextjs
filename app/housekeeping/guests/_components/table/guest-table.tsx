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
import { TableBottomContent } from "./bottom-content";
import {
  Booking,
  BookingPagination,
  FetchBookingParams,
} from "@/types/booking";
import { ColumnType } from "@/types/column";

interface GuestTableProps {
  bookings: Booking[];
  pagination: BookingPagination | null;
  query: FetchBookingParams;
  setQuery: React.Dispatch<React.SetStateAction<FetchBookingParams>>;
  headerColumns: ColumnType[];
  isLoading: boolean;
}

export default function TaskTable({
  bookings,
  pagination,
  query,
  setQuery,
  headerColumns,
  isLoading,
}: GuestTableProps) {
  return (
    <Table
      aria-label="Rooms Table"
      isHeaderSticky
      classNames={{
        wrapper: ["shadow-none", "dark:bg-gray-900", "p-0"],
        th: "bg-primary text-white",
      }}
      radius="none"
      rowHeight={40}
      bottomContent={
        <TableBottomContent
          query={query}
          setQuery={setQuery}
          pages={pagination?.total_pages ?? 0}
        />
      }
      bottomContentPlacement="outside"
      // topContent={
      //   <TableTopContent
      //     query={query}
      //     setQuery={setQuery}
      //     visibleColumns={visibleColumns}
      //     setVisibleColumns={setVisibleColumns}
      //     tasksCount={pagination?.total}
      //     selectedKeys={selectedKeys}
      //   />
      // }
      // topContentPlacement="outside"
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
        emptyContent="No booking found"
        items={bookings}
        className="overflow-x-auto"
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell className="capitalize min-w-40">
                <RenderCell booking={item} columnKey={columnKey as string} />
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
