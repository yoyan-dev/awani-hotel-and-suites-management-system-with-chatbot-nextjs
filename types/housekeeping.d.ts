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

export interface RoomGuest {
  guest_name: string;
  checked_in: string;
  checked_out: string;
  status: BookingStatus;
}

export interface RoomDetail {
  id: string;
  room_id: string;
  room_number: number;
  status: RoomStatus;
  room_type_id: string | null;
  area: string | null;
  description: string | null;
  images: string[] | null;
  remarks: string | null;
  bookings: any[] | null;
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
  stayovers: {
    total: number;
    rooms: string[];
  };
}

export interface SummaryByStatus {
  stock_room: number;
  vacant: number;
  vacant_dirty: number;
  occupied: number;
  out_of_service: number;
  maintenance: number;
  cleaning: number;
  dirty: number;
}

export interface SummaryByCleaning {
  clean: number;
  dirty: number;
  in_progress: number;
  inspected: number;
}

export interface HousekeepingSummary {
  total_rooms: number;
  by_status: SummaryByStatus;
  by_cleaning_status: SummaryByCleaning;
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

export interface UpdateRoomResponse {
  room: RoomDetail;
  message: string;
}

export interface RoomListParams {
  page?: number;
  limit?: number;
  status?: string;
  cleaning_status?: string;
  room_type_id?: string;
  search?: string;
  sort_by?: string;
  sort_order?: string;
}

export interface TodayOperationsParams {
  date?: string;
}

export interface UpdateRoomPayload {
  status?: RoomStatus;
  cleaning_status?: CleaningStatus;
  notes?: string;
}

export interface StateType {
  tasks: any[];
  task: any;
  pagination: any;
  roomList: {
    data: RoomDetail[];
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
  selectedRoom: RoomDetail | null;
  isLoading: boolean;
  error: string | undefined;
}
