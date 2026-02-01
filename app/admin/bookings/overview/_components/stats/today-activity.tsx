"use client";

import React from "react";
import { DashboardCard, Badge } from "@/app/admin/dashboard/dashboard-layout";

interface TodayActivityProps {
  checkedInToday: number;
  checkedOutToday: number;
  pendingBookings: number;
  confirmedBookings: number;
}

export function TodayActivity({
  checkedInToday,
  checkedOutToday,
  pendingBookings,
  confirmedBookings,
}: TodayActivityProps) {
  return (
    <DashboardCard title="Today's Activity" subtitle="Check-ins and check-outs">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-primary-50 rounded-lg">
          <p className="text-2xl font-bold text-primary-600">
            {checkedInToday}
          </p>
          <p className="text-xs text-gray-500">Check-ins</p>
        </div>
        <div className="text-center p-4 bg-secondary-50 rounded-lg">
          <p className="text-2xl font-bold text-secondary-600">
            {checkedOutToday}
          </p>
          <p className="text-xs text-gray-500">Check-outs</p>
        </div>
        <div className="text-center p-4 bg-warning-50 rounded-lg">
          <p className="text-2xl font-bold text-warning-600">
            {pendingBookings}
          </p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="text-center p-4 bg-success-50 rounded-lg">
          <p className="text-2xl font-bold text-success-600">
            {confirmedBookings}
          </p>
          <p className="text-xs text-gray-500">Confirmed</p>
        </div>
      </div>
    </DashboardCard>
  );
}
