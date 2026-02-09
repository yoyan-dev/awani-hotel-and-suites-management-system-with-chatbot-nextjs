"use client";
import Header from "./_components/header";
import GuestTable from "./_components/table/guest-table";
import React from "react";
import {
  columns,
  INITIAL_HOUSEKEEPING_VISIBLE_COLUMNS,
} from "@/app/constants/booking";
import { Tab, Tabs } from "@heroui/react";
import { useBookings } from "@/hooks/use-bookings";
import { FetchBookingParams } from "@/types/booking";
import { today } from "@/utils/get-date";

export default function Housekeeping() {
  const { bookings, pagination, isLoading, error, fetchBookings } =
    useBookings();

  const [query, setQuery] = React.useState<FetchBookingParams>({
    checked_in: today,
  });
  const [selectedKeys, setSelectedKeys] = React.useState("arrival");
  const [visibleColumns, setVisibleColumns] = React.useState<any>(
    new Set(INITIAL_HOUSEKEEPING_VISIBLE_COLUMNS),
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
    <div className="p-2 rounded space-y-2">
      <Header />

      <Tabs
        aria-label="Options"
        selectedKey={selectedKeys}
        onSelectionChange={(key) => setSelectedKeys(String(key))}
        variant="underlined"
        color="primary"
      >
        <Tab
          key="arrival"
          onClick={() =>
            setQuery({ ...query, checked_in: today, checked_out: "" })
          }
          title={
            <span className="text-gray-800 dark:text-gray-100 font-medium">
              Arrival
            </span>
          }
        />

        <Tab
          key="departure"
          onClick={() =>
            setQuery({ ...query, checked_out: today, checked_in: "" })
          }
          title={
            <span className="text-gray-800 dark:text-gray-100 font-medium">
              Departure
            </span>
          }
        />
      </Tabs>
      <GuestTable
        bookings={bookings}
        pagination={pagination}
        query={query}
        setQuery={setQuery}
        headerColumns={headerColumns}
        isLoading={isLoading}
      />
    </div>
  );
}
