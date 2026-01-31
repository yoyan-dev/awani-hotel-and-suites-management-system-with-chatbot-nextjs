"use client";

import React, { useEffect, useState } from "react";
import { FilterBar } from "./_components/ui/filter-bar";
import { KPI } from "./_components/ui/kpi";
import { Card } from "./_components/ui/card";
import { useAnalytics } from "@/hooks/use-analytics";
import { formatPHP } from "@/lib/format-php";
import {
  BookingAnalyticsResponse,
  FunctionHallAnalyticsResponse,
} from "@/types/analytics";

export default function Page() {
  const {
    bookingAnalyticsData,
    functionHallAnalyticsData,
    isLoading,
    error,
    bookingAnalytics,
    functionHallAnalytics,
  } = useAnalytics();

  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  useEffect(() => {
    bookingAnalytics({ start: dateRange.start, end: dateRange.end });
    functionHallAnalytics({ start: dateRange.start, end: dateRange.end });
  }, [dateRange]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Booking Status distribution
  const statusData = bookingAnalyticsData?.statusDistribution
    ? Object.entries(bookingAnalyticsData.statusDistribution).map(
        ([name, value]) => ({ name, value }),
      )
    : [];

  // Booking Source distribution
  const sourceData = bookingAnalyticsData?.bookingSourceDistribution
    ? [
        {
          name: "Walk-in",
          value: bookingAnalyticsData.bookingSourceDistribution.walk_in || 0,
        },
        {
          name: "Online",
          value: bookingAnalyticsData.bookingSourceDistribution.online || 0,
        },
      ]
    : [
        { name: "Walk-in", value: 0 },
        { name: "Online", value: 0 },
      ];

  // Function Hall event type distribution
  const eventTypeData = functionHallAnalyticsData?.eventTypeDistribution
    ? Object.entries(functionHallAnalyticsData.eventTypeDistribution).map(
        ([name, value]) => ({ name, value }),
      )
    : [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>

      {/* Filter */}
      <FilterBar
        startDate={dateRange.start}
        endDate={dateRange.end}
        onChange={(start, end) =>
          setDateRange({ start: start || "", end: end || "" })
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPI
          label="Total Bookings"
          value={bookingAnalyticsData?.totalBookings || 0}
        />
        <KPI
          label="Total Revenue"
          value={`${formatPHP(bookingAnalyticsData?.totalRevenue || 0)}`}
        />
        <KPI
          label="Function Hall Bookings"
          value={functionHallAnalyticsData?.totalBookings || 0}
        />
        <KPI
          label="Function Hall Revenue"
          value={`${formatPHP(functionHallAnalyticsData?.totalRevenue || 0)}`}
        />
      </div>

      {/* Booking Status */}
      <Card title="Booking Status Distribution">
        {statusData.length === 0 ? (
          <p className="text-gray-500">No bookings yet.</p>
        ) : (
          <div className="space-y-2">
            {statusData.map((item) => {
              const percentage =
                bookingAnalyticsData && bookingAnalyticsData.totalBookings
                  ? Math.round(
                      (item.value / bookingAnalyticsData.totalBookings) * 100,
                    )
                  : 0;
              return (
                <div key={item.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="text-gray-500">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Booking Source */}
      <Card title="Booking Source Distribution">
        {sourceData.length === 0 ? (
          <p className="text-gray-500">No bookings yet.</p>
        ) : (
          <div className="space-y-2">
            {sourceData.map((item) => {
              const percentage =
                bookingAnalyticsData && bookingAnalyticsData.totalBookings
                  ? Math.round(
                      (item.value / bookingAnalyticsData.totalBookings) * 100,
                    )
                  : 0;
              return (
                <div key={item.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="text-gray-500">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Function Hall Event Types */}
      <Card title="Function Hall Event Type Distribution">
        {eventTypeData.length === 0 ? (
          <p className="text-gray-500">No function hall events yet.</p>
        ) : (
          <div className="space-y-2">
            {eventTypeData.map((item) => {
              const percentage =
                functionHallAnalyticsData &&
                functionHallAnalyticsData.totalBookings
                  ? Math.round(
                      (item.value / functionHallAnalyticsData.totalBookings) *
                        100,
                    )
                  : 0;
              return (
                <div key={item.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="text-gray-500">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
