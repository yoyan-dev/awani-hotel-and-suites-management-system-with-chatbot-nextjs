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
  RoomAnalyticsResponse,
} from "@/types/analytics";

type DateRange = {
  start: string;
  end: string;
};

export default function AdminClient() {
  const {
    bookingAnalyticsData,
    functionHallAnalyticsData,
    roomAnalyticsData,
    isLoading,
    error,
    bookingAnalytics,
    functionHallAnalytics,
    roomAnalytics,
  } = useAnalytics();

  const [dateRange, setDateRange] = useState<DateRange>({ start: "", end: "" });

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        bookingAnalytics(dateRange),
        functionHallAnalytics(dateRange),
        roomAnalytics({}),
      ]);
    };

    void loadData();
  }, [
    dateRange,
    bookingAnalytics,
    functionHallAnalytics,
    roomAnalytics,
  ]);

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
          <p className="text-danger">Error: {error}</p>
        </DashboardCard>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardHeader dateRange={dateRange} setDateRange={setDateRange} />

      <KPISection
        booking={bookingAnalyticsData}
        rooms={roomAnalyticsData}
        functionHall={functionHallAnalyticsData}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookingStatusCard data={bookingAnalyticsData} />
        <RoomStatusCard data={roomAnalyticsData} />
        <BookingSourceCard data={bookingAnalyticsData} />
        <FunctionHallEventCard data={functionHallAnalyticsData} />
      </div>

      <QuickStatsCard
        booking={bookingAnalyticsData}
        functionHall={functionHallAnalyticsData}
      />
    </DashboardLayout>
  );
}
