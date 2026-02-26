"use client";

import React from "react";
import {
  DashboardCard,
  EmptyState,
} from "@/components/dashboard/dashboard-layout";
import { format } from "date-fns";
import { formatPHP } from "@/lib/format-php";
import Link from "next/link";
import {
  Button,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { bookingStatusColorMap } from "@/app/constants/booking";
import { Booking as AnalyticsBooking } from "@/types/analytics";

type BookingWithRelations = AnalyticsBooking & {
  user?: { full_name?: string | null } | null;
  room?: { room_number?: number | null } | null;
};

interface RecentBookingsTableProps {
  bookings: BookingWithRelations[];
  totalCount: number;
}

export function RecentBookingsTable({
  bookings,
  totalCount,
}: RecentBookingsTableProps) {
  const visibleBookings = bookings.slice(0, 10);

  return (
    <DashboardCard
      title="Recent Bookings"
      subtitle={`Showing ${bookings.length} of ${totalCount || bookings.length} bookings`}
    >
      {bookings.length === 0 ? (
        <EmptyState
          title="No bookings found"
          description="Try adjusting your filters or create a new booking"
          action={
            <Button
              as={Link}
              href="/admin/bookings/room-bookings/add-booking"
              color="primary"
              size="sm"
            >
              Create Booking
            </Button>
          }
        />
      ) : (
        <Table
          aria-label="Recent bookings table"
          removeWrapper
          classNames={{
            table: "min-w-full",
            th: "text-xs uppercase tracking-wider",
          }}
        >
          <TableHeader>
            <TableColumn>Booking #</TableColumn>
            <TableColumn>Guest</TableColumn>
            <TableColumn>Room</TableColumn>
            <TableColumn>Checked In</TableColumn>
            <TableColumn>Checked Out</TableColumn>
            <TableColumn>Total</TableColumn>
            <TableColumn>Status</TableColumn>
          </TableHeader>
          <TableBody items={visibleBookings}>
            {(booking) => (
              <TableRow key={booking.id}>
                <TableCell className="text-sm font-medium">
                  {booking.booking_number || "-"}
                </TableCell>
                <TableCell className="text-sm">
                  {(booking.user as unknown as { full_name?: string })
                    ?.full_name || "Guest"}
                </TableCell>
                <TableCell className="text-sm">
                  {(booking.room as unknown as { room_number?: number })
                    ?.room_number || booking.room_id}
                </TableCell>
                <TableCell className="text-sm">
                  {booking.checked_in
                    ? format(new Date(booking.checked_in), "MMM dd, yyyy")
                    : "-"}
                </TableCell>
                <TableCell className="text-sm">
                  {booking.checked_out
                    ? format(new Date(booking.checked_out), "MMM dd, yyyy")
                    : "-"}
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {formatPHP(Number(booking.total || 0))}
                </TableCell>
                <TableCell>
                  <Chip
                    className={bookingStatusColorMap[booking.status]}
                    size="sm"
                    variant="flat"
                  >
                    {(booking.status || "unknown").replace(/[_-]/g, " ")}
                  </Chip>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      {bookings.length > 10 && (
        <div className="mt-4 text-center">
          <Button
            as={Link}
            href="/admin/bookings/room-bookings"
            variant="flat"
            size="sm"
          >
            View All Bookings
          </Button>
        </div>
      )}
    </DashboardCard>
  );
}
