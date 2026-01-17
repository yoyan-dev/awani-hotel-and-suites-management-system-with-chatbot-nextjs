"use client";

import type { Room } from "@/types/room";
import RoomStatusCard from "./_components/room-status-card";
import { useRooms } from "@/hooks/use-rooms";
import React from "react";
import Loader from "./_components/loader";
import { Input } from "@heroui/input";
import { Search } from "lucide-react";
import { Button, Select, SelectItem } from "@heroui/react";
import { statusOptions } from "@/app/constants/rooms";

export default function HousekeepingRoomsPage() {
  const { rooms, isLoading, pagination, fetchRooms } = useRooms();
  const handleUpdateStatus = (
    roomId?: string,
    status?: string,
    remarks?: string
  ) => {
    console.log("Update room:", roomId, status);
  };

  React.useEffect(() => {
    fetchRooms({});
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-800 pb-10 px-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-primary">
            Housekeeping – Room Status
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor and update room cleanliness across all floors
          </p>
        </header>
        <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white dark:bg-gray-900">
          <Input
            variant="bordered"
            radius="sm"
            startContent={<Search size={16} />}
            placeholder="Search room, type, remarks..."
          />

          <Select selectedKeys={[status]} className="sm:max-w-xs">
            {statusOptions.map((opt) => (
              <SelectItem key={opt.uid}>{opt.name}</SelectItem>
            ))}
          </Select>
        </div>

        {pagination?.total_pages === 0 ? (
          <div className="text-sm text-gray-500 text-center py-10">
            No rooms found
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? [1, 2, 3].map((i) => <Loader />)
              : rooms.map((room) => (
                  <RoomStatusCard
                    key={room.id}
                    room={room}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <span className="text-xs text-gray-500">
            Page {pagination?.page} of {pagination?.total_pages || 1}
          </span>

          <div className="flex gap-2">
            <Button size="sm" variant="bordered">
              Prev
            </Button>

            <Button size="sm" variant="bordered">
              Next
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
