"use client";

import React, { useEffect, useState } from "react";
import { useAnalytics } from "@/hooks/use-analytics";
import { formatPHP } from "@/lib/format-php";
import {
  DashboardLayout,
  DashboardCard,
  KPICard,
  StatGrid,
  ProgressBar,
  Badge,
  LoadingState,
} from "./dashboard/dashboard-layout";
import { Input } from "@heroui/react";
import { Users, DollarSign, Bed, Building2 } from "lucide-react";

export default function AdminDashboardPage() {
  const {
    bookingAnalyticsData,
    functionHallAnalyticsData,
    roomAnalyticsData,
    functionRoomAnalyticsData,
    isLoading,
    error,
    bookingAnalytics,
    functionHallAnalytics,
    roomAnalytics,
    functionRoomAnalytics,
  } = useAnalytics();

  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  useEffect(() => {
    bookingAnalytics({ start: dateRange.start, end: dateRange.end });
    functionHallAnalytics({ start: dateRange.start, end: dateRange.end });
    roomAnalytics({});
    functionRoomAnalytics({});
  }, [dateRange]);

  if (isLoading && !bookingAnalyticsData?.summary?.total_bookings) {
    return (
      <DashboardLayout>
        <LoadingState message="Loading analytics data..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <DashboardCard>
          <div className="text-danger">Error: {error}</div>
        </DashboardCard>
      </DashboardLayout>
    );
  }

  const statusDistribution =
    bookingAnalyticsData?.distributions?.by_status || {};
  const sourceDistribution =
    bookingAnalyticsData?.distributions?.by_booking_source || {};
  const eventTypeDistribution =
    functionHallAnalyticsData?.distributions?.by_event_type || {};
  const roomStatusDistribution =
    roomAnalyticsData?.distributions?.by_status || {};

  const totalBookings = bookingAnalyticsData?.summary?.total_bookings || 0;
  const totalRevenue = bookingAnalyticsData?.summary?.total_revenue || 0;
  const totalRooms = roomAnalyticsData?.summary?.total_rooms || 0;
  const occupiedRooms = roomAnalyticsData?.summary?.occupied_rooms || 0;
  const occupancyRate = roomAnalyticsData?.summary?.occupancy_rate || 0;
  const functionHallBookings =
    functionHallAnalyticsData?.summary?.total_bookings || 0;
  const functionHallRevenue =
    functionHallAnalyticsData?.summary?.total_revenue || 0;
  const pendingBookings = bookingAnalyticsData?.summary?.pending_bookings || 0;
  const checkedInToday = bookingAnalyticsData?.summary?.checked_in_today || 0;
  const upcomingEvents =
    functionHallAnalyticsData?.summary?.upcoming_bookings || 0;

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Overview of your hotel operations</p>
        </div>
        <div className="flex gap-2">
          <Input
            type="date"
            label="Start Date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
            size="sm"
          />
          <Input
            type="date"
            label="End Date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange({ ...dateRange, end: e.target.value })
            }
            size="sm"
          />
        </div>
      </div>

      <StatGrid columns={4}>
        <KPICard
          title="Total Bookings"
          value={totalBookings}
          subtitle="This period"
          trend={{
            value:
              bookingAnalyticsData?.trends?.weekly_comparison?.percent_change ||
              0,
            isPositive: true,
          }}
          icon={<Users className="w-5 h-5" />}
          color="primary"
        />
        <KPICard
          title="Booking Revenue"
          value={formatPHP(totalRevenue)}
          subtitle="Total revenue"
          icon={<DollarSign className="w-5 h-5" />}
          color="success"
        />
        <KPICard
          title="Room Occupancy"
          value={`${occupancyRate.toFixed(1)}%`}
          subtitle={`${occupiedRooms} occupied`}
          icon={<Bed className="w-5 h-5" />}
          color="secondary"
        />
        <KPICard
          title="Function Halls"
          value={functionHallBookings}
          subtitle="Total events"
          icon={<Building2 className="w-5 h-5" />}
          color="warning"
        />
      </StatGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard
          title="Booking Status Overview"
          subtitle="Distribution by current status"
        >
          <div className="space-y-4">
            {Object.entries(statusDistribution).map(([status, count]) => {
              const percentage =
                totalBookings > 0 ? (Number(count) / totalBookings) * 100 : 0;
              const colorMap: Record<string, string> = {
                pending: "bg-warning-500",
                confirmed: "bg-primary-500",
                checked_in: "bg-success-500",
                checked_out: "bg-secondary-500",
                cancelled: "bg-danger-500",
              };
              return (
                <div key={status}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        color={
                          status === "pending"
                            ? "warning"
                            : status === "confirmed"
                              ? "primary"
                              : status === "checked_in"
                                ? "success"
                                : status === "cancelled"
                                  ? "danger"
                                  : "default"
                        }
                      >
                        {status.replace("_", " ")}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <ProgressBar
                    value={Number(count)}
                    max={totalBookings || 1}
                    color={colorMap[status] || "bg-primary-500"}
                    size="sm"
                  />
                </div>
              );
            })}
            {Object.keys(statusDistribution).length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No booking data available
              </p>
            )}
          </div>
        </DashboardCard>

        <DashboardCard title="Room Status" subtitle="Current room availability">
          <div className="space-y-4">
            {Object.entries(roomStatusDistribution).map(([status, count]) => {
              const percentage =
                totalRooms > 0 ? (Number(count) / totalRooms) * 100 : 0;
              const colorMap: Record<string, string> = {
                available: "bg-success-500",
                occupied: "bg-primary-500",
                maintenance: "bg-danger-500",
                cleaning: "bg-warning-500",
              };
              return (
                <div key={status}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {count} rooms ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <ProgressBar
                    value={Number(count)}
                    max={totalRooms || 1}
                    color={colorMap[status] || "bg-primary-500"}
                    size="sm"
                  />
                </div>
              );
            })}
            {Object.keys(roomStatusDistribution).length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No room data available
              </p>
            )}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Booking Sources"
          subtitle="Distribution by booking channel"
        >
          <div className="space-y-4">
            {Object.entries(sourceDistribution).map(([source, count]) => {
              const percentage =
                totalBookings > 0 ? (Number(count) / totalBookings) * 100 : 0;
              return (
                <div key={source}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {source}
                    </span>
                    <span className="text-sm text-gray-500">{count}</span>
                  </div>
                  <ProgressBar
                    value={percentage}
                    color="bg-primary-500"
                    size="sm"
                  />
                </div>
              );
            })}
            {Object.keys(sourceDistribution).length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No source data available
              </p>
            )}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Function Hall Events"
          subtitle="Distribution by event type"
        >
          <div className="space-y-4">
            {Object.entries(eventTypeDistribution).map(([type, count]) => {
              const percentage =
                functionHallBookings > 0
                  ? (Number(count) / functionHallBookings) * 100
                  : 0;
              return (
                <div key={type}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {type}
                    </span>
                    <span className="text-sm text-gray-500">{count}</span>
                  </div>
                  <ProgressBar
                    value={percentage}
                    color="bg-secondary-500"
                    size="sm"
                  />
                </div>
              );
            })}
            {Object.keys(eventTypeDistribution).length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No event type data available
              </p>
            )}
          </div>
        </DashboardCard>
      </div>

      <DashboardCard title="Quick Stats" subtitle="At a glance metrics">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-primary-600">
              {pendingBookings}
            </p>
            <p className="text-sm text-gray-500">Pending Bookings</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-success-600">
              {checkedInToday}
            </p>
            <p className="text-sm text-gray-500">Checked In Today</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-warning-600">
              {upcomingEvents}
            </p>
            <p className="text-sm text-gray-500">Upcoming Events</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-secondary-600">
              {formatPHP(functionHallRevenue)}
            </p>
            <p className="text-sm text-gray-500">Function Hall Revenue</p>
          </div>
        </div>
      </DashboardCard>
    </DashboardLayout>
  );
}
