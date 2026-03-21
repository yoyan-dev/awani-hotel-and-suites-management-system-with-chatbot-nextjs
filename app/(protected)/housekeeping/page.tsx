import HousekeepingDashboardClientPage from "./_components/dashboard/dashboard-client-page";
import type { RoomListResponse } from "@/types/housekeeping";
import { getHousekeepingDashboardInitialData } from "@/lib/housekeeping/dashboard-initial-data";

export default async function HousekeepingDashboardPage() {
  const { initialRoomList, initialTodayOperations, initialError } =
    await getHousekeepingDashboardInitialData();

  return (
    <HousekeepingDashboardClientPage
      initialRoomList={initialRoomList as RoomListResponse}
      initialTodayOperations={initialTodayOperations}
      initialError={initialError}
    />
  );
}
