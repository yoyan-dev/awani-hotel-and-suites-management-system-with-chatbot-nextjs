"use client";

import React, { useEffect, useState } from "react";
import { useAnalytics } from "@/hooks/use-analytics";
import {
  DashboardLayout,
  LoadingState,
  DashboardCard,
} from "../../../components/dashboard/dashboard-layout";
import DashboardHeader from "./_components/dashboard/dashboard-header";
import KPISection from "./_components/dashboard/KPI-section";
import BookingStatusCard from "./_components/dashboard/booking-status-card";
import RoomStatusCard from "./_components/dashboard/room-status-card";
import QuickStatsCard from "./_components/dashboard/quick-stats-card";
import BookingSourceCard from "./_components/dashboard/booking-source-card";
import FunctionHallEventCard from "./_components/dashboard/function-hall-event-card";
import type {
  BookingAnalyticsResponse,
  FunctionHallAnalyticsResponse,
  FunctionRoomAnalyticsResponse,
  RoomAnalyticsResponse,
} from "@/types/analytics";

type DateRange = {
  start: string;
  end: string;
};

type AdminClientProps = {
  initialBookingAnalyticsData: BookingAnalyticsResponse;
  initialFunctionHallAnalyticsData: FunctionHallAnalyticsResponse;
  initialRoomAnalyticsData: RoomAnalyticsResponse;
  initialFunctionRoomAnalyticsData: FunctionRoomAnalyticsResponse;
  initialError: string | null;
};

export default function AdminClient({
  initialBookingAnalyticsData,
  initialFunctionHallAnalyticsData,
  initialRoomAnalyticsData,
  initialFunctionRoomAnalyticsData,
  initialError,
}: AdminClientProps) {
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

  const [dateRange, setDateRange] = useState<DateRange>({ start: "", end: "" });
  const [hasFetchedClientData, setHasFetchedClientData] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        bookingAnalytics(dateRange),
        functionHallAnalytics(dateRange),
        roomAnalytics({}),
        functionRoomAnalytics({}),
      ]);
      setHasFetchedClientData(true);
    };

    void loadData();
  }, [
    dateRange,
    bookingAnalytics,
    functionHallAnalytics,
    roomAnalytics,
    functionRoomAnalytics,
  ]);

  const displayBookingAnalyticsData = hasFetchedClientData
    ? bookingAnalyticsData
    : initialBookingAnalyticsData;
  const displayFunctionHallAnalyticsData = hasFetchedClientData
    ? functionHallAnalyticsData
    : initialFunctionHallAnalyticsData;
  const displayRoomAnalyticsData = hasFetchedClientData
    ? roomAnalyticsData
    : initialRoomAnalyticsData;
  const displayFunctionRoomAnalyticsData = hasFetchedClientData
    ? functionRoomAnalyticsData
    : initialFunctionRoomAnalyticsData;
  const displayError = error || (!hasFetchedClientData ? initialError : null);

  if (
    isLoading &&
    !displayBookingAnalyticsData?.summary?.total_bookings &&
    !displayFunctionRoomAnalyticsData?.summary?.total_function_rooms
  ) {
    return (
      <DashboardLayout>
        <LoadingState message="Loading analytics data..." />
      </DashboardLayout>
    );
  }

  if (displayError) {
    return (
      <DashboardLayout>
        <DashboardCard>
          <p className="text-danger">Error: {displayError}</p>
        </DashboardCard>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardHeader dateRange={dateRange} setDateRange={setDateRange} />

      <KPISection
        booking={displayBookingAnalyticsData}
        rooms={displayRoomAnalyticsData}
        functionHall={displayFunctionHallAnalyticsData}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookingStatusCard data={displayBookingAnalyticsData} />
        <RoomStatusCard data={displayRoomAnalyticsData} />
        <BookingSourceCard data={displayBookingAnalyticsData} />
        <FunctionHallEventCard data={displayFunctionHallAnalyticsData} />
      </div>

      <QuickStatsCard
        booking={displayBookingAnalyticsData}
        functionHall={displayFunctionHallAnalyticsData}
      />
    </DashboardLayout>
  );
}
