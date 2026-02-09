import { Tables } from "./supabase";

export type Booking = Tables<"bookings">;
export type Room = Tables<"rooms">;

export type RoomStatus =
  | "available"
  | "occupied"
  | "maintenance"
  | "cleaning"
  | "dirty";
export type CleaningStatus = "clean" | "dirty" | "in_progress" | "inspected";
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled";

export type TaskStatus = "pending" | "in_progress" | "done" | "cancelled";

export interface HousekeepingTask {
  id: string;
  room_number?: number;
  guest_name?: string;
  task_type: string;
  requests?: string;
  message?: string;
  scheduled_time?: string;
  status?: TaskStatus;
  createdAt: string;
}

export interface HousekeepingPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface FetchHousekeepingParams {
  page?: number;
  query?: string;
  status?: string | undefined;
}

export interface HousekeepingFilterParams {
  status?: RoomStatus;
  cleaning_status?: CleaningStatus;
  floor?: string;
  room_type_id?: string;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface FilterParams
  extends HousekeepingFilterParams, PaginationParams {}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

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

export interface RoomHousekeepingDetail extends Room {
  cleaning_status?: CleaningStatus;
  last_cleaned_at?: string;
  current_guest?: {
    guest_name: string;
    checked_in: string;
    checked_out: string;
    status: BookingStatus;
  } | null;
  notes?: string;
}

export interface TodayOperations {
  date: string;
  checked_ins: {
    total: number;
    rooms: {
      id: string;
      room_number: number;
      guest_name: string;
      expected_time?: string;
      status: BookingStatus;
    }[];
  };
  checked_outs: {
    total: number;
    rooms: {
      id: string;
      room_number: number;
      guest_name: string;
      status: BookingStatus;
    }[];
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

export interface RoomUpdatePayload {
  status?: RoomStatus;
  cleaning_status?: CleaningStatus;
  notes?: string;
}

export interface HousekeepingState {
  tasks: HousekeepingTask[];
  task: HousekeepingTask;
  pagination: HousekeepingPagination | null;
  roomList: {
    data: RoomHousekeepingDetail[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
  todayOperations: TodayOperations | null;
  summary: HousekeepingSummary | null;
  selectedRoom: RoomHousekeepingDetail | null;
  isLoading: boolean;
  error?: string;
}

export interface RoomListParams extends FilterParams {}
export interface TodayOperationsParams {
  date?: string;
}
export interface UpdateRoomParams {
  room_id: string;
  payload: RoomUpdatePayload;
}
