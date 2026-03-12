import { addToast } from "@heroui/react";
import type { Booking, FetchBookingParams } from "@/types/booking";
import type {
  FetchFunctionHallBookingParams,
  FunctionHallBooking,
} from "@/types/function-room-booking";

const roomBookingsApiUrl = "/api/bookings/hotel-rooms";
const functionHallBookingsApiUrl = "/api/bookings/function-hall";

const buildRoomSearchParams = (
  params: FetchBookingParams | undefined,
  page: number,
) => {
  const searchParams = new URLSearchParams();
  searchParams.append("page", String(page));
  if (params?.query) searchParams.append("query", params.query);
  if (params?.guest_id) searchParams.append("guest_id", params.guest_id);
  if (params?.checked_in) searchParams.append("checked_in", params.checked_in);
  if (params?.checked_out)
    searchParams.append("checked_out", params.checked_out);
  if (params?.date_range) {
    searchParams.append("start", params.date_range.start);
    searchParams.append("end", params.date_range.end);
  }
  if (params?.roomTypeID) searchParams.append("roomTypeID", params.roomTypeID);
  if (params?.status) searchParams.append("status", params.status);
  return searchParams;
};

const buildFunctionHallSearchParams = (
  params: FetchFunctionHallBookingParams | undefined,
  page: number,
) => {
  const searchParams = new URLSearchParams();
  searchParams.append("page", String(page));
  if (params?.query) searchParams.append("query", params.query);
  if (params?.guest_id) searchParams.append("guest_id", params.guest_id);
  if (params?.event_start) searchParams.append("start", params.event_start);
  if (params?.event_end) searchParams.append("end", params.event_end);
  if (params?.status) searchParams.append("status", params.status);
  return searchParams;
};

const fetchAllPages = async <T>(
  url: string,
  buildParams: (page: number) => URLSearchParams,
) => {
  const results: T[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const searchParams = buildParams(page);
    const res = await fetch(`${url}?${searchParams}`);
    const payload = await res.json();

    if (!res.ok || !payload.success) {
      throw new Error(
        payload.message?.description ?? "Failed to fetch export data",
      );
    }

    const data = Array.isArray(payload.data) ? payload.data : [];
    results.push(...data);

    const pagination = payload.pagination;
    totalPages =
      typeof pagination?.total_pages === "number" && pagination.total_pages > 0
        ? pagination.total_pages
        : 1;
    page += 1;
  }

  return results;
};

export async function fetchAllRoomBookings(
  params: FetchBookingParams | undefined,
) {
  try {
    return await fetchAllPages<Booking>(roomBookingsApiUrl, (page) =>
      buildRoomSearchParams(params, page),
    );
  } catch (error: any) {
    addToast({
      title: "Export Error",
      description: error.message ?? "Failed to fetch room bookings",
      color: "danger",
    });
    return [];
  }
}

export async function fetchAllFunctionHallBookings(
  params: FetchFunctionHallBookingParams | undefined,
) {
  try {
    return await fetchAllPages<FunctionHallBooking>(
      functionHallBookingsApiUrl,
      (page) => buildFunctionHallSearchParams(params, page),
    );
  } catch (error: any) {
    addToast({
      title: "Export Error",
      description: error.message ?? "Failed to fetch function hall bookings",
      color: "danger",
    });
    return [];
  }
}
