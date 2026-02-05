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
  FunctionRoomStats,
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

  const bookingsData = bookingOverview?.bookings || {
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

  const functionHallBookings = bookingOverview?.function_hall_bookings || {
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

  const rooms = bookingOverview?.rooms || {
    summary: {
      total_rooms: 0,
      available_rooms: 0,
      occupied_rooms: 0,
      maintenance_rooms: 0,
      occupancy_rate: 0,
      average_room_rate: 0,
    },
    status_distribution: {},
    recent_bookings: [],
  };

  const functionRooms = bookingOverview?.function_rooms || {
    summary: {
      total_rooms: 0,
      available_rooms: 0,
      booked_rooms: 0,
      maintenance_rooms: 0,
      utilization_rate: 0,
      total_revenue: 0,
    },
    status_distribution: {},
    recent_bookings: [],
  };

  const stats = {
    totalRevenue: Number(bookingsData.summary.total_revenue) || 0,
    totalBookings: Number(bookingsData.summary.total_bookings) || 0,
    pendingBookings: Number(bookingsData.summary.pending_bookings) || 0,
    confirmedBookings: Number(bookingsData.summary.confirmed_bookings) || 0,
    checkedInToday: Number(bookingsData.summary.checked_in_today) || 0,
    checkedOutToday: Number(bookingsData.summary.checked_out_today) || 0,
    cancelledBookings: Number(bookingsData.summary.cancelled_bookings) || 0,
    upcomingBookings: Number(bookingsData.summary.upcoming_bookings) || 0,
    occupancyRate: Number(bookingsData.summary.occupancy_rate) || 0,
    averageBookingValue:
      Number(bookingsData.summary.average_booking_value) || 0,
  };

  const fhStats = {
    totalBookings: Number(functionHallBookings.summary.total_bookings) || 0,
    totalRevenue: Number(functionHallBookings.summary.total_revenue) || 0,
    upcomingBookings:
      Number(functionHallBookings.summary.upcoming_bookings) || 0,
    pendingBookings: Number(functionHallBookings.summary.pending_bookings) || 0,
    completedBookings:
      Number(functionHallBookings.summary.completed_bookings) || 0,
    totalGuests:
      Number(functionHallBookings.summary.total_guests_expected) || 0,
  };

  const roomStats = {
    totalRooms: Number(rooms.summary.total_rooms) || 0,
    availableRooms: Number(rooms.summary.available_rooms) || 0,
    occupiedRooms: Number(rooms.summary.occupied_rooms) || 0,
    maintenanceRooms: Number(rooms.summary.maintenance_rooms) || 0,
    occupancyRate: Number(rooms.summary.occupancy_rate) || 0,
  };

  const frStats = {
    totalRooms: Number(functionRooms.summary.total_rooms) || 0,
    availableRooms: Number(functionRooms.summary.available_rooms) || 0,
    bookedRooms: Number(functionRooms.summary.booked_rooms) || 0,
    maintenanceRooms: Number(functionRooms.summary.maintenance_rooms) || 0,
    utilizationRate: Number(functionRooms.summary.utilization_rate) || 0,
  };

  const statusDistribution = bookingsData.status_distribution || {
    pending: 0,
    confirmed: 0,
    checked_in: 0,
    checked_out: 0,
    cancelled: 0,
  };

  const bookings = bookingsData.recent_bookings || [];
  const totalCount =
    Number(bookingsData.summary.total_bookings) || bookings.length;

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <FunctionHallStats
          totalBookings={fhStats.totalBookings}
          totalRevenue={fhStats.totalRevenue}
          upcomingBookings={fhStats.upcomingBookings}
          pendingBookings={fhStats.pendingBookings}
          completedBookings={fhStats.completedBookings}
          totalGuests={fhStats.totalGuests}
        />
        <RoomStats
          totalRooms={roomStats.totalRooms}
          availableRooms={roomStats.availableRooms}
          occupiedRooms={roomStats.occupiedRooms}
          maintenanceRooms={roomStats.maintenanceRooms}
          occupancyRate={roomStats.occupancyRate}
        />
        <FunctionRoomStats
          totalRooms={frStats.totalRooms}
          availableRooms={frStats.availableRooms}
          bookedRooms={frStats.bookedRooms}
          maintenanceRooms={frStats.maintenanceRooms}
          utilizationRate={frStats.utilizationRate}
        />
      </div>

      <RecentBookingsTable bookings={bookings} totalCount={totalCount} />
    </DashboardLayout>
  );
}
