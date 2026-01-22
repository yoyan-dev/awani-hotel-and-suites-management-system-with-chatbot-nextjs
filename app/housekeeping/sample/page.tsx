"use client";

import React, { useState, useMemo } from "react";
import GuestCard from "./_components/guest-card";
import { Tabs, Tab } from "@heroui/react";

interface GuestMovement {
  id: string;
  guestName: string;
  roomNumber: string | number;
  nights: number;
  arrival: string;
  departure: string;
}

export default function GuestMovementPage() {
  const guests: GuestMovement[] = [
    {
      id: "1",
      guestName: "John Doe",
      roomNumber: "101",
      nights: 3,
      arrival: "2026-01-17T14:00:00Z",
      departure: "2026-01-20T11:00:00Z",
    },
    {
      id: "2",
      guestName: "Jane Smith",
      roomNumber: "102",
      nights: 2,
      arrival: "2026-01-18T15:00:00Z",
      departure: "2026-01-20T10:00:00Z",
    },
  ];

  const [activeTab, setActiveTab] = React.useState("arrival");

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold text-gray-800">Guest Movements</h1>

      <Tabs
        aria-label="Tabs form"
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(String(key))}
      >
        <Tab value="arrival">Arrival</Tab>
        <Tab value="departure">Departure</Tab>
      </Tabs>

      <div className="grid gap-4 mt-4">
        {guests.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No guests found</p>
        ) : (
          guests.map((guest) => <GuestCard key={guest.id} guest={guest} />)
        )}
      </div>
    </div>
  );
}
