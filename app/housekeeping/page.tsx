"use client";

import { ArrivalDepartureCard } from "./_components/dashboard/arrival-departure-card";
import { RoomStatCard } from "./_components/dashboard/room-stat-card";
import { RoomStatusList } from "./_components/dashboard/room-status-list";

export default function RoomsDashboard() {
  const arrivals: any[] = [
    { id: "1", room_number: "301", guest_name: "A. Cruz", movement: "arrival" },
  ];

  const departures: any[] = [
    {
      id: "2",
      room_number: "210",
      guest_name: "M. Santos",
      movement: "departure",
    },
  ];

  const rooms: any[] = [
    { id: "3", room_number: "210", status: "dirty" },
    { id: "4", room_number: "301", status: "ready" },
    { id: "5", room_number: "305", status: "cleaning" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <RoomStatCard
          label="Arrivals Today"
          value={arrivals.length}
          color="text-primary"
        />
        <RoomStatCard
          label="Departures Today"
          value={departures.length}
          color="text-warning"
        />
        <RoomStatCard label="Dirty Rooms" value={1} color="text-danger" />
        <RoomStatCard label="Ready Rooms" value={1} color="text-success" />
      </div>

      {/* Arrivals & Departures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ArrivalDepartureCard
          title="Today's Arrivals"
          type="arrival"
          rooms={arrivals}
        />
        <ArrivalDepartureCard
          title="Today's Departures"
          type="departure"
          rooms={departures}
        />
      </div>

      {/* Room Status */}
      <RoomStatusList rooms={rooms} />
    </div>
  );
}
