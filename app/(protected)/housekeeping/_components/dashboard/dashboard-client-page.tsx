"use client";

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
import { bookingStatusColorMap } from "@/app/constants/booking";
import type { RoomListResponse, TodayOperations } from "@/types/housekeeping";
import { useHousekeepingDashboardPage } from "@/hooks/housekeeping/use-housekeeping-dashboard-page";

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
    displayRoomList,
    displaySummary,
    displayTodayOperations,
    displayError,
    isLoading,
    clearError,
    handleRefresh,
  } = useHousekeepingDashboardPage({
    initialRoomList,
    initialTodayOperations,
    initialError,
  });

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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between ">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Housekeeping Dashboard
          </h1>
          <p className="text-gray-500">Room status and today's operations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" isIconOnly variant="flat" onPress={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <DashboardCard
          title="Today's checked ins"
          subtitle={`${displayTodayOperations?.checked_ins?.total || 0} arrivals`}
        >
          {displayTodayOperations?.checked_ins?.rooms?.length ? (
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {displayTodayOperations.checked_ins.rooms.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between rounded bg-gray-50 p-2"
                >
                  <div>
                    <p className="font-medium">Room {booking.room_number}</p>
                    <p className="text-xs capitalize text-gray-500">
                      {booking.guest_name}
                    </p>
                  </div>
                  <Chip
                    size="sm"
                    className={`${bookingStatusColorMap[booking.status || "default"]}`}
                  >
                    <span className="text-sm capitalize">
                      {booking.status.replace(/[-_]/g, " ")}
                    </span>
                  </Chip>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-gray-500">
              No checked_ins today
            </p>
          )}
        </DashboardCard>

        <DashboardCard
          title="Today's checked outs"
          subtitle={`${displayTodayOperations?.checked_outs?.total || 0} departures`}
        >
          {displayTodayOperations?.checked_outs?.rooms?.length ? (
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {displayTodayOperations.checked_outs.rooms.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between rounded bg-gray-50 p-2 dark:bg-gray-900"
                >
                  <div>
                    <p className="font-medium">Room {booking.room_number}</p>
                    <p className="text-xs text-gray-500">{booking.guest_name}</p>
                  </div>
                  <Chip color="warning">Departing</Chip>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-gray-500">
              No checked_outs today
            </p>
          )}
        </DashboardCard>

        <DashboardCard
          title="Stayovers"
          subtitle={`${displayTodayOperations?.stayovers?.total || 0} guests staying`}
        >
          <div className="py-8 text-center">
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
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {displaySummary &&
            Object.entries(displaySummary.by_cleaning_status).map(
              ([status, count]) => (
                <div
                  key={status}
                  className="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-900"
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
                  <p className="text-sm capitalize text-gray-500">
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
