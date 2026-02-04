"use client";

import React from "react";
import {
  DashboardCard,
  ProgressBar,
  Badge,
} from "@/components/dashboard/dashboard-layout";
import { Booking } from "@/types/booking";

interface StatusDistributionProps {
  bookings: Booking[];
  statusDistribution: Record<string, number>;
}

export function StatusDistribution({
  bookings,
  statusDistribution,
}: StatusDistributionProps) {
  const totalBookings = bookings.length;

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

  const colorMap: Record<string, string> = {
    pending: "bg-warning-500",
    confirmed: "bg-primary-500",
    "check-in": "bg-success-500",
    "check-out": "bg-secondary-500",
    cancelled: "bg-danger-500",
  };

  return (
    <DashboardCard
      title="Booking Status Distribution"
      subtitle="Current status breakdown"
    >
      <div className="space-y-4">
        {Object.entries(statusDistribution).map(([status, count]) => {
          const percentage =
            totalBookings > 0 ? (count / totalBookings) * 100 : 0;
          return (
            <div key={status}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <Badge color={getStatusColor(status)} size="sm">
                    {status.replace(/-/g, " ")}
                  </Badge>
                </div>
                <span className="text-sm text-gray-500">{count}</span>
              </div>
              <ProgressBar
                value={percentage}
                color={colorMap[status] || "bg-primary-500"}
                size="sm"
              />
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}
