"use client";

import React, { useEffect, useState } from "react";
import {
  DashboardLayout,
  LoadingState,
} from "@/components/dashboard/dashboard-layout";
import { BookingFilters } from "./_components/filters";
import {
  BookingStats,
  StatusDistribution,
  TodayActivity,
  QuickStats,
  FunctionHallStats,
  RoomStats,
} from "./_components/stats";
import { RecentBookingsTable } from "./_components/tables";

import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

import { useAnalytics } from "@/hooks/use-analytics";

export default function OverviewPage() {
  const { bookingOverview, isLoading, error, fetchBookingOverview } =
    useAnalytics();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const params: Record<string, string> = {};

    if (searchQuery) params.search = searchQuery;
    if (statusFilter) params.status = statusFilter;

    if (dateFilter) {
      const today = new Date();

      switch (dateFilter) {
        case "today":
          params.start = format(startOfDay(today), "yyyy-MM-dd");
          params.end = format(endOfDay(today), "yyyy-MM-dd");
          break;

        case "week":
          params.start = format(
            startOfWeek(today, { weekStartsOn: 1 }),
            "yyyy-MM-dd",
          );
          params.end = format(
            endOfWeek(today, { weekStartsOn: 1 }),
            "yyyy-MM-dd",
          );
          break;

        case "month":
          params.start = format(startOfMonth(today), "yyyy-MM-dd");
          params.end = format(endOfMonth(today), "yyyy-MM-dd");
          break;
      }
    }

    fetchBookingOverview(params);
  }, [searchQuery, statusFilter, dateFilter]);

  const handleRefresh = () => {
    fetchBookingOverview({});
  };

  const bookingsData = bookingOverview?.bookings ?? {
    summary: {
      total_revenue: 0,
      total_bookings: 0,
      pending_bookings: 0,
      confirmed_bookings: 0,
      checked_in_today: 0,
      checked_out_today: 0,
      cancelled_bookings: 0,
      upcoming_bookings: 0,
      occupancy_rate: 0,
      average_booking_value: 0,
    },
    status_distribution: {},
    recent_bookings: [],
  };

  const functionHallBookings = bookingOverview?.function_hall_bookings ?? {
    summary: {
      total_bookings: 0,
      total_revenue: 0,
      upcoming_bookings: 0,
      pending_bookings: 0,
      completed_bookings: 0,
      cancelled_bookings: 0,
      total_guests_expected: 0,
    },
    status_distribution: {},
    recent_bookings: [],
  };

  const rooms = bookingOverview?.rooms ?? {
    summary: {
      total_rooms: 0,
      vacant_rooms: 0,
      vacant_dirty_rooms: 0,
      dirty_rooms: 0,
      occupied_rooms: 0,
      maintenance_rooms: 0,
      out_of_service_rooms: 0,
      stock_rooms: 0,
      occupancy_rate: 0,
      average_room_rate: 0,
      total_room_revenue: 0,
    },
    status_distribution: {},
    recent_bookings: [],
  };

  const stats = {
    totalRevenue: bookingsData.summary.total_revenue,
    totalBookings: bookingsData.summary.total_bookings,
    pendingBookings: bookingsData.summary.pending_bookings,
    confirmedBookings: bookingsData.summary.confirmed_bookings,
    checkedInToday: bookingsData.summary.checked_in_today,
    checkedOutToday: bookingsData.summary.checked_out_today,
    cancelledBookings: bookingsData.summary.cancelled_bookings,
    upcomingBookings: bookingsData.summary.upcoming_bookings,
    occupancyRate: bookingsData.summary.occupancy_rate,
    averageBookingValue: bookingsData.summary.average_booking_value,
  };

  const functionHallStats = {
    totalBookings: functionHallBookings.summary.total_bookings,
    totalRevenue: functionHallBookings.summary.total_revenue,
    upcomingBookings: functionHallBookings.summary.upcoming_bookings,
    pendingBookings: functionHallBookings.summary.pending_bookings,
    completedBookings: functionHallBookings.summary.completed_bookings,
    totalGuests: functionHallBookings.summary.total_guests_expected,
  };

  const roomStats = { ...rooms.summary };

  const bookings = bookingsData.recent_bookings;
  const totalCount = bookingsData.summary.total_bookings;

  if (isLoading && !bookings.length) {
    return (
      <DashboardLayout>
        <LoadingState message="Loading analytics..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4 bg-danger-50 text-danger rounded-lg">
          Error: {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bookings Overview
          </h1>
          <p className="text-gray-500">Manage and monitor all hotel bookings</p>
        </div>

        <BookingFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          onRefresh={handleRefresh}
          isLoading={isLoading}
        />
      </div>

      <BookingStats
        totalRevenue={stats.totalRevenue}
        totalBookings={stats.totalBookings}
        pendingBookings={stats.pendingBookings}
        checkedInToday={stats.checkedInToday}
        occupancyRate={stats.occupancyRate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatusDistribution
          totalBookings={bookings.length}
          statusDistribution={bookingsData.status_distribution}
        />
        <TodayActivity
          checkedInToday={stats.checkedInToday}
          checkedOutToday={stats.checkedOutToday}
          pendingBookings={stats.pendingBookings}
          confirmedBookings={stats.confirmedBookings}
        />
        <QuickStats
          totalBookings={stats.totalBookings}
          upcomingBookings={stats.upcomingBookings}
          cancelledBookings={stats.cancelledBookings}
          averageBookingValue={stats.averageBookingValue}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <FunctionHallStats {...functionHallStats} />
        <RoomStats
          summary={
            roomStats as {
              total_rooms: number;
              vacant_rooms: number;
              vacant_dirty_rooms: number;
              dirty_rooms: number;
              occupied_rooms: number;
              maintenance_rooms: number;
              out_of_service_rooms: number;
              stock_rooms: number;
              occupancy_rate: number;
            }
          }
        />
      </div>

      <RecentBookingsTable bookings={bookings} totalCount={totalCount} />
    </DashboardLayout>
  );
}
