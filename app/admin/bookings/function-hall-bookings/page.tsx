"use client";
import Header from "./_components/header";
import BookingTable from "./_components/table/booking-table";
import React from "react";
import { Booking, FetchBookingParams } from "@/types/booking";
import { useBookings } from "@/hooks/use-bookings";
import { columns, INITIAL_VISIBLE_COLUMNS } from "@/app/constants/booking";
import { HousekeepingTask } from "@/types/housekeeping";
import { useHousekeeping } from "@/hooks/use-housekeeping";
import { useRooms } from "@/hooks/use-rooms";
import { Room } from "@/types/room";

export default function BookingList() {
  const {
    bookings,
    pagination,
    isLoading,
    error,
    fetchBookings,
    updateBooking,
  } = useBookings();
  const { updateRoom } = useRooms();

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

  async function handleSubmit(booking: Booking, room: Room) {
    await updateBooking({
      id: booking.id,
      room_id: room.room_id,
      status: "confirmed",
    } as Booking);

    await updateRoom({
      id: room.id,
      bookings: [...(room.bookings || []), booking],
    });
  }
  return (
    <div className="p-2 md:p-4 bg-white dark:bg-gray-900 rounded space-y-2">
      <Header />
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
        bookingLoading={isLoading}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
