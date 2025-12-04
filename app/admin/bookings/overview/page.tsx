"use client";
import React, { useMemo } from "react";
import BookingHeader from "./_components/header";
import KeyPerformanceIndicator from "./_components/key-performance-indicator";
import BookingTable from "./_components/table/booking-table";
import { Booking, FetchBookingParams } from "@/types/booking";
import CenterRow from "./_components/center-row";
import { useBookings } from "@/hooks/use-bookings";
import { columns, INITIAL_VISIBLE_COLUMNS } from "@/app/constants/booking";
import { useRooms } from "@/hooks/use-rooms";
import { formatDate } from "@/utils/format-date";

export default function Overview() {
  const {
    pagination,
    bookings,
    isLoading: bookingLoading,
    error: bookingError,
    fetchBookings,
    updateBooking,
  } = useBookings();
  const {
    available_rooms,
    isLoading: roomLoading,
    fetchAvailableRooms,
  } = useRooms();

  const [query, setQuery] = React.useState<FetchBookingParams>({});
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
    fetchBookings(query);
  }, [query]);

  React.useEffect(() => {
    fetchAvailableRooms({ selectedDate: formatDate(new Date()) });
  }, []);

  async function handleSubmit(payload: Booking) {
    console.log(payload);
    updateBooking({
      id: payload.id,
      room_id: payload.room_id,
      status: "confirmed",
    } as Booking);
  }

  const stats = useMemo(() => {
    const totalRevenue = bookings.reduce((s, b) => s + Number(b.total), 0);
    const upcoming = bookings.filter(
      (b) => new Date(b.check_in) >= new Date()
    ).length;
    const occupied = bookings.filter((b) => b.status === "check-in").length;
    return { totalRevenue, upcoming, occupied };
  }, [bookings]);

  const filteredBookings = React.useMemo(() => {
    const statusToFilter = ["confirmed", "check-in"];
    return (
      bookings.filter((booking) => statusToFilter.includes(booking.status)) ||
      ([] as Booking[])
    );
  }, [bookings]);

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto spcae-y-4">
        <BookingHeader />
        <KeyPerformanceIndicator stats={stats} />
        <CenterRow rooms={available_rooms} roomLoading={roomLoading} />

        <BookingTable
          bookings={bookings}
          pagination={pagination}
          query={query}
          setQuery={setQuery}
          headerColumns={headerColumns}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          bookingLoading={bookingLoading}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
