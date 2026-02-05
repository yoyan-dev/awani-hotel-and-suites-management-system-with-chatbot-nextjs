"use client";

import React, { useEffect, useState } from "react";
import { useHousekeeping } from "@/hooks/use-housekeeping";
import {
  DashboardLayout,
  DashboardCard,
  KPICard,
  StatGrid,
  ProgressBar,
  Badge,
  LoadingState,
  EmptyState,
} from "@/components/dashboard/dashboard-layout";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import {
  Bed,
  Users,
  Calendar,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { statusColorMap, statusOptions } from "../constants/rooms";

type RoomStatus =
  | "available"
  | "occupied"
  | "maintenance"
  | "cleaning"
  | "dirty";
type CleaningStatus = "clean" | "dirty" | "in_progress" | "inspected";

export default function HousekeepingDashboardPage() {
  const {
    roomList,
    todayOperations,
    summary,
    isLoading,
    error,
    fetchRoomList,
    fetchTodayOperations,
    updateRoomStatus,
    setSelectedRoom,
    clearError,
  } = useHousekeeping();

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [cleaningStatusFilter, setCleaningStatusFilter] = useState<string>("");

  useEffect(() => {
    const status = statusFilter as RoomStatus | undefined;
    const cleaningStatus = cleaningStatusFilter as CleaningStatus | undefined;
    fetchRoomList({
      status: status || undefined,
      cleaning_status: cleaningStatus || undefined,
    });
    fetchTodayOperations({});
  }, [statusFilter, cleaningStatusFilter]);

  const handleRefresh = () => {
    const status = statusFilter as RoomStatus | undefined;
    const cleaningStatus = cleaningStatusFilter as CleaningStatus | undefined;
    fetchRoomList({
      status: status || undefined,
      cleaning_status: cleaningStatus || undefined,
    });
    fetchTodayOperations({});
  };

  if (isLoading && !roomList.data.length) {
    return (
      <DashboardLayout>
        <LoadingState message="Loading housekeeping data..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <DashboardCard>
          <div className="flex items-center justify-between">
            <div className="text-danger">Error: {error}</div>
            <Button size="sm" color="primary" onPress={clearError}>
              Dismiss
            </Button>
          </div>
        </DashboardCard>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 ">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Housekeeping Dashboard
          </h1>
          <p className="text-gray-500">Room status and today's operations</p>
        </div>
        <div className="flex gap-2 items-center">
          <Select
            label="Status"
            placeholder="All"
            size="sm"
            className="w-40"
            onChange={(e) => setStatusFilter(e.target.value)}
            value={statusFilter}
            items={statusOptions}
          >
            {(item) => <SelectItem key={item.uid}>{item.name}</SelectItem>}
          </Select>
          <Select
            label="Cleaning"
            placeholder="All"
            size="sm"
            className="w-40"
            onChange={(e) => setCleaningStatusFilter(e.target.value)}
            value={cleaningStatusFilter}
          >
            <SelectItem key="clean">Clean</SelectItem>
            <SelectItem key="dirty">Dirty</SelectItem>
            <SelectItem key="in_progress">In Progress</SelectItem>
            <SelectItem key="inspected">Inspected</SelectItem>
          </Select>
          <Button size="sm" isIconOnly variant="flat" onPress={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <StatGrid columns={4}>
        <KPICard
          title="Total Rooms"
          value={summary?.total_rooms || 0}
          icon={<Bed className="w-5 h-5" />}
          color="primary"
        />
        <KPICard
          title="Available"
          value={summary?.by_status?.available || 0}
          icon={<CheckCircle className="w-5 h-5" />}
          color="success"
        />
        <KPICard
          title="Occupied"
          value={summary?.by_status?.occupied || 0}
          icon={<Users className="w-5 h-5" />}
          color="secondary"
        />
        <KPICard
          title="Pending Cleaning"
          value={summary?.pending_cleaning || 0}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="warning"
        />
      </StatGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Today's Check-ins"
          subtitle={`${todayOperations?.check_ins?.total || 0} arrivals`}
        >
          {todayOperations?.check_ins?.rooms?.length ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {todayOperations.check_ins.rooms.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium">Room {booking.room_number}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {booking.guest_name}
                    </p>
                  </div>
                  <Badge color={statusColorMap[booking.status || "default"]}>
                    <span className="capitalize">
                      {booking.status.replace(/[-_]/g, " ")}
                    </span>
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No check-ins today</p>
          )}
        </DashboardCard>

        <DashboardCard
          title="Today's Check-outs"
          subtitle={`${todayOperations?.check_outs?.total || 0} departures`}
        >
          {todayOperations?.check_outs?.rooms?.length ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {todayOperations.check_outs.rooms.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium">Room {booking.room_number}</p>
                    <p className="text-xs text-gray-500">
                      {booking.guest_name}
                    </p>
                  </div>
                  <Badge color="warning">Departing</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No check-outs today
            </p>
          )}
        </DashboardCard>

        <DashboardCard
          title="Stayovers"
          subtitle={`${todayOperations?.stayovers?.total || 0} continuing stays`}
        >
          <div className="text-center py-8">
            <p className="text-3xl font-bold text-primary-600">
              {todayOperations?.stayovers?.total || 0}
            </p>
            <p className="text-sm text-gray-500">Guests staying today</p>
          </div>
        </DashboardCard>
      </div>

      <DashboardCard
        title="Room Status"
        subtitle={`${roomList.pagination.total} rooms`}
      >
        {roomList.data.length === 0 ? (
          <EmptyState
            title="No rooms found"
            description="Try adjusting your filters"
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {roomList.data.map((room) => (
              <div
                key={room.id}
                className={`p-4 rounded-lg border-2 ${`border-${statusColorMap[room.status]} bg-${statusColorMap[room.status]}-50
                `}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg">
                    Room {room.room_number}
                  </span>
                </div>
                <div className="space-y-1">
                  <Badge
                    color={statusColorMap[room.status || "default"]}
                    size="sm"
                  >
                    <span className="capitalize">
                      {room.status.replace(/[-_]/g, " ") || "N/A"}
                    </span>
                  </Badge>
                  {/* <Badge
                    color={getCleaningStatusColor(
                      room.cleaning_status || "clean",
                    )}
                    size="sm"
                    variant="flat"
                  >
                    {room.cleaning_status || "clean"}
                  </Badge> */}
                </div>
                {room.current_guest && (
                  <p className="text-xs text-gray-500 mt-2 truncate">
                    {room.current_guest.guest_name}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </DashboardCard>

      <DashboardCard
        title="Cleaning Status Distribution"
        subtitle="Current cleaning progress"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summary &&
            Object.entries(summary.by_cleaning_status).map(
              ([status, count]) => (
                <div
                  key={status}
                  className="text-center p-4 bg-gray-50 rounded-lg"
                >
                  <p
                    className="text-2xl font-bold"
                    style={{
                      color:
                        status === "clean"
                          ? "#17c964"
                          : status === "dirty"
                            ? "#f31260"
                            : status === "in_progress"
                              ? "#f5a524"
                              : "#006fee",
                    }}
                  >
                    {count as number}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {status.replace("_", " ")}
                  </p>
                </div>
              ),
            )}
        </div>
      </DashboardCard>
    </DashboardLayout>
  );
}
