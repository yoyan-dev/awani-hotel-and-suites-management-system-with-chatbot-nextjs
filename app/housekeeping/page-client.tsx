"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useHousekeeping } from "@/hooks/use-housekeeping";
import {
  DashboardLayout,
  DashboardCard,
  KPICard,
  StatGrid,
  LoadingState,
} from "@/components/dashboard/dashboard-layout";
import { Button, Chip } from "@heroui/react";
import {
  Bed,
  Users,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { RoomStatus } from "@/types/room";
import { bookingStatusColorMap } from "../constants/booking";
import type { RoomListResponse, TodayOperations } from "@/types/housekeeping";

type CleaningStatus = "clean" | "dirty" | "in_progress" | "inspected";

type HousekeepingDashboardClientPageProps = {
  initialRoomList: RoomListResponse;
  initialTodayOperations: TodayOperations;
  initialError: string | null;
};

export default function HousekeepingDashboardClientPage({
  initialRoomList,
  initialTodayOperations,
  initialError,
}: HousekeepingDashboardClientPageProps) {
  const {
    roomList,
    todayOperations,
    summary,
    isLoading,
    error,
    fetchRoomList,
    fetchTodayOperations,
    clearError,
  } = useHousekeeping();

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [cleaningStatusFilter, setCleaningStatusFilter] = useState<string>("");
  const [hasFetchedClientData, setHasFetchedClientData] = useState(false);

  useEffect(() => {
    const status = statusFilter as RoomStatus | undefined;
    const cleaningStatus = cleaningStatusFilter as CleaningStatus | undefined;

    const loadData = async () => {
      await Promise.all([fetchRoomList({}), fetchTodayOperations({})]);
      setHasFetchedClientData(true);
      void status;
      void cleaningStatus;
    };

    void loadData();
  }, [statusFilter, cleaningStatusFilter, fetchRoomList, fetchTodayOperations]);

  const handleRefresh = async () => {
    const status = statusFilter as RoomStatus | undefined;
    const cleaningStatus = cleaningStatusFilter as CleaningStatus | undefined;

    await Promise.all([fetchRoomList({}), fetchTodayOperations({})]);
    setHasFetchedClientData(true);
    void status;
    void cleaningStatus;
  };

  const displayRoomList = useMemo(
    () =>
      hasFetchedClientData
        ? roomList
        : {
            data: initialRoomList.rooms,
            pagination: {
              ...roomList.pagination,
              ...initialRoomList.pagination,
              has_next:
                initialRoomList.pagination.page <
                initialRoomList.pagination.total_pages,
              has_prev: initialRoomList.pagination.page > 1,
            },
          },
    [hasFetchedClientData, roomList, initialRoomList],
  );

  const displaySummary = hasFetchedClientData ? summary : initialRoomList.summary;
  const displayTodayOperations = hasFetchedClientData
    ? todayOperations
    : initialTodayOperations;
  const displayError = error || (!hasFetchedClientData ? initialError : null);

  if (isLoading && !displayRoomList.data.length) {
    return (
      <DashboardLayout>
        <LoadingState message="Loading housekeeping data..." />
      </DashboardLayout>
    );
  }

  if (displayError) {
    return (
      <DashboardLayout>
        <DashboardCard>
          <div className="flex items-center justify-between">
            <div className="text-danger">Error: {displayError}</div>
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
          <Button size="sm" isIconOnly variant="flat" onPress={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <StatGrid columns={4}>
        <KPICard
          title="Total Rooms"
          value={displaySummary?.total_rooms || 0}
          icon={<Bed className="w-5 h-5" />}
          color="primary"
        />
        <KPICard
          title="Vacant"
          value={displaySummary?.by_status?.vacant || 0}
          icon={<CheckCircle className="w-5 h-5" />}
          color="success"
        />
        <KPICard
          title="Occupied"
          value={displaySummary?.by_status?.occupied || 0}
          icon={<Users className="w-5 h-5" />}
          color="secondary"
        />
        <KPICard
          title="Pending Cleaning"
          value={displaySummary?.pending_cleaning || 0}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="warning"
        />
      </StatGrid>

      <div className="grid grid-cols-1  lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Today's checked ins"
          subtitle={`${displayTodayOperations?.checked_ins?.total || 0} arrivals`}
        >
          {displayTodayOperations?.checked_ins?.rooms?.length ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {displayTodayOperations.checked_ins.rooms.map((booking) => (
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
                  <Chip
                    size="sm"
                    className={`${bookingStatusColorMap[booking.status || "default"]}`}
                  >
                    <span className="capitalize text-sm">
                      {booking.status.replace(/[-_]/g, " ")}
                    </span>
                  </Chip>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No checked_ins today
            </p>
          )}
        </DashboardCard>

        <DashboardCard
          title="Today's checked outs"
          subtitle={`${displayTodayOperations?.checked_outs?.total || 0} departures`}
        >
          {displayTodayOperations?.checked_outs?.rooms?.length ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {displayTodayOperations.checked_outs.rooms.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded"
                >
                  <div>
                    <p className="font-medium">Room {booking.room_number}</p>
                    <p className="text-xs text-gray-500">
                      {booking.guest_name}
                    </p>
                  </div>
                  <Chip color="warning">Departing</Chip>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No checked_outs today
            </p>
          )}
        </DashboardCard>

        <DashboardCard
          title="Stayovers"
          subtitle={`${displayTodayOperations?.stayovers?.total || 0} guests staying`}
        >
          <div className="text-center py-8">
            <p className="text-3xl font-bold text-primary-600">
              {displayTodayOperations?.stayovers?.total || 0}
            </p>
            <p className="text-sm text-gray-500">Guests staying today</p>
          </div>
        </DashboardCard>
      </div>

      <DashboardCard
        title="Cleaning Status Distribution"
        subtitle="Current cleaning progress"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {displaySummary &&
            Object.entries(displaySummary.by_cleaning_status).map(
              ([status, count]) => (
                <div
                  key={status}
                  className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
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
