"use client";

import React from "react";
import { DashboardCard } from "@/app/admin/dashboard/dashboard-layout";
import { formatPHP } from "@/lib/format-php";

interface QuickStatsProps {
  totalBookings: number;
  upcomingBookings: number;
  cancelledBookings: number;
  averageBookingValue: number;
}

export function QuickStats({
  totalBookings,
  upcomingBookings,
  cancelledBookings,
  averageBookingValue,
}: QuickStatsProps) {
  return (
    <DashboardCard title="Quick Stats" subtitle="Overview metrics">
      <div className="space-y-3">
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-sm text-gray-600">Total Bookings</span>
          <span className="font-semibold">{totalBookings}</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-sm text-gray-600">Upcoming</span>
          <span className="font-semibold">{upcomingBookings}</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-sm text-gray-600">Cancelled</span>
          <span className="font-semibold text-danger">{cancelledBookings}</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-sm text-gray-600">Avg. Booking Value</span>
          <span className="font-semibold">
            {formatPHP(averageBookingValue)}
          </span>
        </div>
      </div>
    </DashboardCard>
  );
}
