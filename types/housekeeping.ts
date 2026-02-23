import { BookingStatus } from "./booking";
import { RoomStatus } from "./room";
import { Tables } from "./supabase";

export type Booking = Tables<"bookings">;
export type Room = Tables<"rooms">;

export type CleaningStatus = "clean" | "dirty" | "not_available";
export type TaskStatus = "pending" | "in_progress" | "done" | "cancelled";

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface HousekeepingFilterParams {
  status?: string;
  cleaning_status?: string;
  room_type_id?: string;
  search?: string;
}

export interface FilterParams
  extends HousekeepingFilterParams,
    PaginationParams {}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: {
    generated_at: string;
    filters_applied: Record<string, unknown>;
    execution_time_ms: number;
  };
}

export interface RoomGuest {
  guest_name: string;
  checked_in: string;
  checked_out: string;
  status: BookingStatus;
}

export interface RoomDetail extends Room {
  cleaning_status?: CleaningStatus;
  last_cleaned_at?: string;
  current_guest?: RoomGuest | null;
  notes?: string;
}

export interface TodayCheckIn {
  id: string;
  room_number: number;
  guest_name: string;
  expected_time?: string;
  status: BookingStatus;
}

export interface TodayCheckOut {
  id: string;
  room_number: number;
  guest_name: string;
  status: BookingStatus;
}

export interface TodayOperations {
  date: string;
  checked_ins: {
    total: number;
    rooms: TodayCheckIn[];
  };
  checked_outs: {
    total: number;
    rooms: TodayCheckOut[];
  };
  booking_not_arrived: {
    total: number;
    rooms: string[];
  };
  stayovers: {
    total: number;
    rooms: string[];
  };
}

export interface HousekeepingSummary {
  total_rooms: number;
  by_status: Record<RoomStatus, number>;
  by_cleaning_status: Record<CleaningStatus, number>;
  pending_cleaning: number;
  ready_for_checked_in: number;
  requires_attention: number;
}

export interface RoomListResponse {
  rooms: RoomDetail[];
  summary: HousekeepingSummary;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface RoomListParams extends FilterParams {}

export interface TodayOperationsParams {
  date?: string;
}

export interface RoomUpdatePayload {
  status?: RoomStatus;
  cleaning_status?: CleaningStatus;
  notes?: string;
}

export interface UpdateRoomParams {
  room_id: string;
  payload: RoomUpdatePayload;
}

export interface UpdateRoomResponse {
  room: RoomDetail;
  message: string;
}

export interface HousekeepingTask {
  id?: string;
  status?: TaskStatus;
  [key: string]: unknown;
}

export interface HousekeepingPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface StateType {
  tasks: HousekeepingTask[];
  task: HousekeepingTask;
  pagination: HousekeepingPagination | null;
  roomList: {
    data: RoomDetail[];
    pagination: HousekeepingPagination;
  };
  todayOperations: TodayOperations | null;
  summary: HousekeepingSummary | null;
  selectedRoom: RoomDetail | null;
  isLoading: boolean;
  error: string | undefined;
}
