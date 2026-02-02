"use client";

import React from "react";
import {
  DashboardCard,
  Badge,
  EmptyState,
} from "@/components/dashboard/dashboard-layout";
import { Booking } from "@/types/booking";
import { format } from "date-fns";
import { formatPHP } from "@/lib/format-php";
import Link from "next/link";
import { Button } from "@heroui/react";

interface RecentBookingsTableProps {
  bookings: Booking[];
  totalCount: number;
}

export function RecentBookingsTable({
  bookings,
  totalCount,
}: RecentBookingsTableProps) {
  const getStatusColor = (
    status: string,
  ): "default" | "primary" | "secondary" | "success" | "warning" | "danger" => {
    switch (status) {
      case "pending":
        return "warning";
      case "confirmed":
        return "primary";
      case "check-in":
        return "success";
      case "check-out":
        return "secondary";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                  Booking #
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                  Guest
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                  Room
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                  Check-in
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                  Check-out
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                  Total
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.slice(0, 10).map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium">
                    {booking.booking_number}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {(booking.user as unknown as { full_name?: string })
                      ?.full_name || "Guest"}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {(booking.room as unknown as { room_number?: number })
                      ?.room_number || booking.room_id}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {booking.check_in
                      ? format(new Date(booking.check_in), "MMM dd, yyyy")
                      : "-"}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {booking.check_out
                      ? format(new Date(booking.check_out), "MMM dd, yyyy")
                      : "-"}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium">
                    {formatPHP(Number(booking.total || 0))}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      color={getStatusColor(booking.status || "unknown")}
                      size="sm"
                    >
                      {(booking.status || "unknown").replace(/-/g, " ")}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
