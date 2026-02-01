import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addToast } from "@heroui/react";

const apiUrl = "/api/housekeeping";

type RoomStatus =
  | "available"
  | "occupied"
  | "maintenance"
  | "cleaning"
  | "dirty";
type CleaningStatus = "clean" | "dirty" | "in_progress" | "inspected";
type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled";

interface RoomGuest {
  guest_name: string;
  check_in: string;
  check_out: string;
  status: BookingStatus;
}

interface RoomDetail {
  id: string;
  room_id: string;
  room_number: number;
  status: string;
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

interface TodayCheckIn {
  id: string;
  room_number: number;
  guest_name: string;
  expected_time?: string;
  status: BookingStatus;
}

interface TodayCheckOut {
  id: string;
  room_number: number;
  guest_name: string;
  status: BookingStatus;
}

interface TodayOperations {
  date: string;
  check_ins: {
    total: number;
    rooms: TodayCheckIn[];
  };
  check_outs: {
    total: number;
    rooms: TodayCheckOut[];
  };
  stayovers: {
    total: number;
    rooms: string[];
  };
}

interface SummaryByStatus {
  available: number;
  occupied: number;
  maintenance: number;
  cleaning: number;
  dirty: number;
}

interface SummaryByCleaning {
  clean: number;
  dirty: number;
  in_progress: number;
  inspected: number;
}

interface HousekeepingSummary {
  total_rooms: number;
  by_status: SummaryByStatus;
  by_cleaning_status: SummaryByCleaning;
  pending_cleaning: number;
  ready_for_check_in: number;
  requires_attention: number;
}

interface RoomListResponse {
  rooms: RoomDetail[];
  summary: HousekeepingSummary;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

interface UpdateRoomResponse {
  room: RoomDetail;
  message: string;
}

interface RoomListParams {
  page?: number;
  limit?: number;
  status?: string;
  cleaning_status?: string;
  room_type_id?: string;
  search?: string;
  sort_by?: string;
  sort_order?: string;
}

interface TodayOperationsParams {
  date?: string;
}

interface UpdateRoomPayload {
  status?: RoomStatus;
  cleaning_status?: CleaningStatus;
  notes?: string;
}

interface StateType {
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

const initialState: StateType = {
  tasks: [],
  task: {},
  pagination: null,
  roomList: {
    data: [],
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      total_pages: 0,
      has_next: false,
      has_prev: false,
    },
  },
  todayOperations: null,
  summary: null,
  selectedRoom: null,
  isLoading: false,
  error: undefined,
};

export const fetchRoomList = createAsyncThunk<
  RoomListResponse,
  RoomListParams | undefined,
  { rejectValue: string }
>("housekeeping/fetchRoomList", async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.status) searchParams.append("status", params.status);
    if (params?.cleaning_status)
      searchParams.append("cleaning_status", params.cleaning_status);
    if (params?.room_type_id)
      searchParams.append("room_type_id", params.room_type_id);
    if (params?.search) searchParams.append("search", params.search);
    if (params?.sort_by) searchParams.append("sort_by", params.sort_by);
    if (params?.sort_order)
      searchParams.append("sort_order", params.sort_order);

    const res = await fetch(`${apiUrl}/rooms?${searchParams.toString()}`);
    const response = await res.json();

    if (!res.ok) {
      addToast({
        title: "Error",
        description: response.error?.message ?? "Failed to fetch room list",
        color: "danger",
      });
      return rejectWithValue(
        response.error?.message ?? "Failed to fetch room list",
      );
    }

    return response.data;
  } catch (err) {
    console.error("Error fetching room list:", err);
    return rejectWithValue("Failed to fetch room list");
  }
});

export const fetchTodayOperations = createAsyncThunk<
  TodayOperations,
  TodayOperationsParams | undefined,
  { rejectValue: string }
>("housekeeping/fetchTodayOperations", async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.date) searchParams.append("date", params.date);

    const res = await fetch(`${apiUrl}/operations?${searchParams.toString()}`);
    const response = await res.json();

    if (!res.ok) {
      addToast({
        title: "Error",
        description:
          response.error?.message ?? "Failed to fetch today's operations",
        color: "danger",
      });
      return rejectWithValue(
        response.error?.message ?? "Failed to fetch today's operations",
      );
    }

    return response.data;
  } catch (err) {
    console.error("Error fetching today's operations:", err);
    return rejectWithValue("Failed to fetch today's operations");
  }
});

export const updateRoomStatus = createAsyncThunk<
  UpdateRoomResponse,
  { room_id: string; payload: UpdateRoomPayload },
  { rejectValue: string }
>(
  "housekeeping/updateRoomStatus",
  async ({ room_id, payload }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apiUrl}/rooms/${room_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const response = await res.json();

      if (!res.ok) {
        addToast({
          title: "Error",
          description:
            response.error?.message ?? "Failed to update room status",
          color: "danger",
        });
        return rejectWithValue(
          response.error?.message ?? "Failed to update room status",
        );
      }

      addToast({
        title: "Success",
        description: "Room status updated successfully",
        color: "success",
      });

      return response.data;
    } catch (err) {
      console.error("Error updating room status:", err);
      return rejectWithValue("Failed to update room status");
    }
  },
);

export const housekeepingSlice = createSlice({
  name: "housekeeping",
  initialState,
  reducers: {
    setSelectedRoom: (state, action: PayloadAction<RoomDetail | null>) => {
      state.selectedRoom = action.payload;
    },
    clearError: (state) => {
      state.error = undefined;
    },
    clearHousekeepingState: (state) => {
      state.roomList = initialState.roomList;
      state.todayOperations = null;
      state.summary = null;
      state.selectedRoom = null;
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomList.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchRoomList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roomList.data = action.payload.rooms;
        const { page, limit, total, total_pages } = action.payload.pagination;
        state.roomList.pagination = {
          page,
          limit,
          total,
          total_pages,
          has_next: page < total_pages,
          has_prev: page > 1,
        };
        state.summary = action.payload.summary;
      })
      .addCase(fetchRoomList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchTodayOperations.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchTodayOperations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todayOperations = action.payload;
      })
      .addCase(fetchTodayOperations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(updateRoomStatus.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(updateRoomStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedRoom = action.payload.room;
        const index = state.roomList.data.findIndex(
          (r) => r.id === updatedRoom.id,
        );
        if (index !== -1) {
          state.roomList.data[index] = updatedRoom;
        }
        if (state.selectedRoom?.id === updatedRoom.id) {
          state.selectedRoom = updatedRoom;
        }
      })
      .addCase(updateRoomStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedRoom, clearError, clearHousekeepingState } =
  housekeepingSlice.actions;
export default housekeepingSlice.reducer;
