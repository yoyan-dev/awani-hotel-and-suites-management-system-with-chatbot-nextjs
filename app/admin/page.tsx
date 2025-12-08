"use client";

import { Card, Button } from "@heroui/react";
import { StatCard } from "./_components/stat-card";
import { SectionHeader } from "./_components/section-header";
import RoomStatusCard from "./_components/room-status-card";
import { FunctionHallStatusCard } from "./_components/function-hall-status-card";
import { useRooms } from "@/hooks/use-rooms";
import React from "react";

export default function DashboardPage() {
  const { analytics, isLoading: roomLoading, fetchAnalytics } = useRooms();

  React.useEffect(() => {
    fetchAnalytics();
  }, []);
  return (
    <div className="p-6 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Hotel & Suites Admin Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Manage operations, bookings, and room statuses in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Bookings" value="248" trend="+12%" />
        <StatCard title="Occupied Rooms" value="56" trend="-3%" />
        <StatCard title="Pending Check-ins" value="14" trend="+8%" />
        <StatCard title="Revenue Today" value="₱54,380" trend="+19%" />
      </div>

      <SectionHeader title="Room Status Overview" />
      <div>
        <RoomStatusCard analytics={analytics} />
      </div>

      <SectionHeader title="Function Hall Status" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FunctionHallStatusCard type="Available" count={3} color="green" />
        <FunctionHallStatusCard type="Reserved" count={5} color="purple" />
        <FunctionHallStatusCard type="Ongoing Event" count={1} color="red" />
      </div>

      {/* <SectionHeader title="Recent Bookings" /> */}
      {/* <Card className="p-4 shadow-xl">
        <BookingTable />
      </Card> */}
    </div>
  );
}
