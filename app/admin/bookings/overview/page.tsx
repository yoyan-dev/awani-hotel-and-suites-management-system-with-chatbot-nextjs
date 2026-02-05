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
        case "today": {
          params.start = format(startOfDay(today), "yyyy-MM-dd");
          params.end = format(endOfDay(today), "yyyy-MM-dd");
          break;
        }

        case "week": {
          params.start = format(
            startOfWeek(today, { weekStartsOn: 1 }),
            "yyyy-MM-dd",
          );
          params.end = format(
            endOfWeek(today, { weekStartsOn: 1 }),
            "yyyy-MM-dd",
          );
          break;
        }

        case "month": {
          params.start = format(startOfMonth(today), "yyyy-MM-dd");
          params.end = format(endOfMonth(today), "yyyy-MM-dd");
          break;
        }
      }
    }

    fetchBookingOverview(params);
  }, [searchQuery, statusFilter, dateFilter]);

  const handleRefresh = () => {
    const params: Record<string, string> = {};
    if (statusFilter) params.status = statusFilter;
    fetchBookingOverview({ ...params, limit: 100 });
  };

  const stats = {
    totalRevenue: Number(bookingOverview?.summary.total_revenue) || 0,
    totalBookings: Number(bookingOverview?.summary.total_bookings) || 0,
    pendingBookings: Number(bookingOverview?.summary.pending_bookings) || 0,
    confirmedBookings: Number(bookingOverview?.summary.confirmed_bookings) || 0,
    checkedInToday: Number(bookingOverview?.summary.checked_in_today) || 0,
    checkedOutToday: Number(bookingOverview?.summary.checked_out_today) || 0,
    cancelledBookings: Number(bookingOverview?.summary.cancelled_bookings) || 0,
    upcomingBookings: Number(bookingOverview?.summary.upcoming_bookings) || 0,
    occupancyRate: Number(bookingOverview?.summary.occupancy_rate) || 0,
    averageBookingValue:
      Number(bookingOverview?.summary.average_booking_value) || 0,
  };

  const statusDistribution = bookingOverview?.status_distribution || {
    pending: 0,
    confirmed: 0,
    checked_in: 0,
    checked_out: 0,
    cancelled: 0,
  };

  const bookings = bookingOverview?.recent_bookings || [];
  const totalCount =
    Number(bookingOverview?.summary.total_bookings) || bookings.length;

  if (isLoading && !bookings.length) {
    return (
      <DashboardLayout>
        <LoadingState message="Loading bookings..." />
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
          bookings={bookings}
          statusDistribution={statusDistribution}
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

      <RecentBookingsTable bookings={bookings} totalCount={totalCount} />
    </DashboardLayout>
  );
}
