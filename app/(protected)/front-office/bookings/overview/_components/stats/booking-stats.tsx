"use client";

import React from "react";
import { KPICard, StatGrid } from "@/components/dashboard/dashboard-layout";
import { DollarSign, Calendar, Users, TrendingUp } from "lucide-react";
import { formatPHP } from "@/lib/format-php";

interface BookingStatsProps {
  totalRevenue: number;
  totalBookings: number;
  pendingBookings: number;
  checkedInToday: number;
  occupancyRate: number;
}

export function BookingStats({
  totalRevenue,
  totalBookings,
  pendingBookings,
  checkedInToday,
  occupancyRate,
}: BookingStatsProps) {
  return (
    <StatGrid columns={4}>
      <KPICard
        title="Total Revenue"
        value={formatPHP(totalRevenue)}
        subtitle={`${totalBookings} bookings`}
        icon={<DollarSign className="w-5 h-5" />}
        color="success"
      />
      <KPICard
        title="Pending"
        value={pendingBookings}
        subtitle="Awaiting confirmation"
        icon={<Calendar className="w-5 h-5" />}
        color="warning"
      />
      <KPICard
        title="Checked In Today"
        value={checkedInToday}
        subtitle="Arrivals"
        icon={<Users className="w-5 h-5" />}
        color="primary"
      />
      <KPICard
        title="Occupancy Rate"
        value={`${occupancyRate.toFixed(1)}%`}
        subtitle="Room occupancy"
        icon={<TrendingUp className="w-5 h-5" />}
        color="secondary"
      />
    </StatGrid>
  );
}
