"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBookings } from "@/features/booking/hotel-rooms/booking-thunk";
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
import { format } from "date-fns";

interface BookingStats {
  totalRevenue: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  checkedInToday: number;
  checkedOutToday: number;
  upcomingBookings: number;
  cancelledBookings: number;
  occupancyRate: number;
  averageBookingValue: number;
}

export default function OverviewPage() {
  const dispatch = useAppDispatch();
  const { bookings, pagination, isLoading, error } = useAppSelector(
    (state) => state.booking,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const params: Record<string, string> = {};

    if (searchQuery) params.query = searchQuery;
    if (statusFilter) params.status = statusFilter;
    if (dateFilter) {
      const today = new Date();
      switch (dateFilter) {
        case "today":
          params.check_in = format(today, "yyyy-MM-dd");
          break;
        case "week":
          params.start = format(today, "yyyy-MM-dd");
          break;
        case "month":
          params.start = format(today, "yyyy-MM-dd");
          break;
      }
    }

    dispatch(fetchBookings(params));
  }, [dispatch, searchQuery, statusFilter, dateFilter]);

  const handleRefresh = () => {
    const params: Record<string, string> = {};
    if (statusFilter) params.status = statusFilter;
    dispatch(fetchBookings(params));
  };

  const stats: BookingStats = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    const totalRevenue = bookings.reduce(
      (sum, b) => sum + Number(b.total || 0),
      0,
    );
    const pendingBookings = bookings.filter(
      (b) => b.status === "pending",
    ).length;
    const confirmedBookings = bookings.filter(
      (b) => b.status === "confirmed",
    ).length;
    const checkedInToday = bookings.filter((b) => {
      if (b.status !== "check-in" || !b.check_in) return false;
      const checkIn = new Date(b.check_in);
      return checkIn >= todayStart && checkIn < todayEnd;
    }).length;
    const checkedOutToday = bookings.filter((b) => {
      if (b.status !== "check-out" || !b.check_out) return false;
      const checkOut = new Date(b.check_out);
      return checkOut >= todayStart && checkOut < todayEnd;
    }).length;
    const upcomingBookings = bookings.filter((b) => {
      if (!b.check_in) return false;
      return new Date(b.check_in) > now;
    }).length;
    const cancelledBookings = bookings.filter(
      (b) => b.status === "cancelled",
    ).length;
    const occupiedCount = bookings.filter(
      (b) => b.status === "check-in",
    ).length;
    const occupancyRate =
      bookings.length > 0 ? (occupiedCount / bookings.length) * 100 : 0;
    const averageBookingValue =
      bookings.length > 0 ? totalRevenue / bookings.length : 0;

    return {
      totalRevenue,
      totalBookings: bookings.length,
      pendingBookings,
      confirmedBookings,
      checkedInToday,
      checkedOutToday,
      upcomingBookings,
      cancelledBookings,
      occupancyRate,
      averageBookingValue,
    };
  }, [bookings]);

  const statusDistribution = useMemo(() => {
    const distribution: Record<string, number> = {
      pending: 0,
      confirmed: 0,
      checked_in: 0,
      checked_out: 0,
      cancelled: 0,
    };
    bookings.forEach((b) => {
      const status = b.status || "unknown";
      distribution[status] = (distribution[status] || 0) + 1;
    });
    return distribution;
  }, [bookings]);

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

      <RecentBookingsTable
        bookings={bookings}
        totalCount={pagination.total || bookings.length}
      />
    </DashboardLayout>
  );
}
