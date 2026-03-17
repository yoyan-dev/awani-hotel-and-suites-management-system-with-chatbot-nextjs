"use client";
import Header from "./_components/header";
import FunctionHallBookingTable from "./_components/table/booking-table";
import React from "react";
import {
  columns,
  INITIAL_VISIBLE_COLUMNS,
} from "@/app/constants/function-hall-booking";
import { useFunctionHallBookings } from "@/hooks/use-function-hall-bookings";
import { FetchFunctionHallBookingParams } from "@/types/function-room-booking";

export default function BookingList() {
  const {
    function_hall_bookings,
    pagination,
    isLoading,
    error,
    fetchBookings,
    updateBooking,
  } = useFunctionHallBookings();

  const [query, setQuery] = React.useState<FetchFunctionHallBookingParams>({
    page: 1,
  });
  const [selectedKeys, setSelectedKeys] = React.useState<any>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<any>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  React.useEffect(() => {
    fetchBookings(query);
  }, [query]);

  return (
    <div className="p-2 md:p-4 bg-white dark:bg-gray-900 rounded space-y-2">
      <Header />
      <FunctionHallBookingTable
        bookings={function_hall_bookings}
        pagination={pagination}
        query={query}
        setQuery={setQuery}
        headerColumns={headerColumns}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
        bookingLoading={isLoading}
      />
    </div>
  );
}
