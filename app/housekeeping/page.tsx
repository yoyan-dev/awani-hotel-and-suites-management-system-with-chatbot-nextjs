import { cookies, headers } from "next/headers";
import HousekeepingDashboardClientPage from "./page-client";
import type {
  ApiResponse,
  RoomListResponse,
  TodayOperations,
} from "@/types/housekeeping";

async function getHousekeepingInitialData() {
  const headerStore = await headers();
  const cookieStore = await cookies();

  const host =
    headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "";
  const protocol =
    headerStore.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (host ? `${protocol}://${host}` : "http://localhost:3000");
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const requestInit: RequestInit = {
    cache: "no-store",
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  };

  const [roomsRes, operationsRes] = await Promise.all([
    fetch(`${baseUrl}/api/housekeeping/rooms`, requestInit),
    fetch(`${baseUrl}/api/housekeeping/operations`, requestInit),
  ]);

  const [roomsJson, operationsJson] = await Promise.all([
    roomsRes.json() as Promise<ApiResponse<RoomListResponse>>,
    operationsRes.json() as Promise<ApiResponse<TodayOperations>>,
  ]);

  return {
    initialRoomList: roomsJson.data ?? {
      rooms: [],
      summary: {
        total_rooms: 0,
        by_status: {
          stock_room: 0,
          vacant: 0,
          vacant_dirty: 0,
          occupied: 0,
          out_of_service: 0,
          maintenance: 0,
          cleaning: 0,
          dirty: 0,
        },
        by_cleaning_status: {
          clean: 0,
          dirty: 0,
          in_progress: 0,
          inspected: 0,
        },
        pending_cleaning: 0,
        ready_for_checked_in: 0,
        requires_attention: 0,
      },
      pagination: { page: 1, limit: 100, total: 0, total_pages: 0 },
    },
    initialTodayOperations:
      operationsJson.data ??
      ({
        date: "",
        checked_ins: { total: 0, rooms: [] },
        checked_outs: { total: 0, rooms: [] },
        booking_not_arrived: { total: 0, rooms: [] },
        stayovers: { total: 0, rooms: [] },
      } as TodayOperations),
    initialError:
      roomsJson.error?.message || operationsJson.error?.message || null,
  };
}

export default async function HousekeepingDashboardPage() {
  const { initialRoomList, initialTodayOperations, initialError } =
    await getHousekeepingInitialData();

  return (
    <HousekeepingDashboardClientPage
      initialRoomList={initialRoomList as RoomListResponse}
      initialTodayOperations={initialTodayOperations}
      initialError={initialError}
    />
  );
}
