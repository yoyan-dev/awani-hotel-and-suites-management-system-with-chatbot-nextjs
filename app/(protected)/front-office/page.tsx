"use client";

import {
  DashboardLayout,
  LoadingState,
  DashboardCard,
} from "../../../components/dashboard/dashboard-layout";
import { useFrontOfficeDashboardPage } from "@/hooks/front-office/use-front-office-dashboard-page";
import DashboardHeader from "./_components/dashboard/dashboard-header";
import KPISection from "./_components/dashboard/KPI-section";
import BookingStatusCard from "./_components/dashboard/booking-status-card";
import RoomStatusCard from "./_components/dashboard/room-status-card";
import QuickStatsCard from "./_components/dashboard/quick-stats-card";
import BookingSourceCard from "./_components/dashboard/booking-source-card";
import FunctionHallEventCard from "./_components/dashboard/function-hall-event-card";

export default function AdminClient() {
  const {
    dateRange,
    setDateRange,
    bookingAnalyticsData,
    functionHallAnalyticsData,
    roomAnalyticsData,
    isLoading,
    error,
  } = useFrontOfficeDashboardPage();

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
