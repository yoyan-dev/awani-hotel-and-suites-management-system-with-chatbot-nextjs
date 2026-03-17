"use client";

import React from "react";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { useAnalytics } from "@/hooks/use-analytics";

type DateRange = {
  start: string;
  end: string;
};

function getDefaultWeekRange(): DateRange {
  const now = new Date();
  return {
    start: format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
    end: format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
  };
}

export function useAdminDashboardPage() {
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

  const [dateRange, setDateRange] = React.useState<DateRange>(() =>
    getDefaultWeekRange(),
  );

  React.useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        bookingAnalytics(dateRange),
        functionHallAnalytics(dateRange),
        roomAnalytics({}),
      ]);
    };

    void loadData();
  }, [dateRange, bookingAnalytics, functionHallAnalytics, roomAnalytics]);

  return {
    dateRange,
    setDateRange,
    bookingAnalyticsData,
    functionHallAnalyticsData,
    roomAnalyticsData,
    isLoading,
    error,
  };
}
