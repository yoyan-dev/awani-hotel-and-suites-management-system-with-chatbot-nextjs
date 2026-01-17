"use client";

import { useState, useMemo } from "react";
import GuestTabs from "./_components/guest-tabs";
import GuestCard from "./_components/guest-card";

interface GuestMovement {
  id: string;
  guestName: string;
  roomNumber: string | number;
  nights: number;
  arrival: string; // ISO date string
  departure: string; // ISO date string
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

  const [activeTab, setActiveTab] = useState<"arrival" | "departure">(
    "arrival"
  );

  const filteredGuests = useMemo(() => {
    return guests.slice().sort((a, b) => {
      const dateA = new Date(a[activeTab]).getTime();
      const dateB = new Date(b[activeTab]).getTime();
      return dateA - dateB;
    });
  }, [guests, activeTab]);

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold text-gray-800">Guest Movements</h1>

      <GuestTabs activeTab={activeTab} onChange={setActiveTab} />

      <div className="grid gap-4 mt-4">
        {filteredGuests.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No guests found</p>
        ) : (
          filteredGuests.map((guest) => (
            <GuestCard key={guest.id} guest={guest} />
          ))
        )}
      </div>
    </div>
  );
}
