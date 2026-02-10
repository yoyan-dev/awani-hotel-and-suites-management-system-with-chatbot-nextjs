import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RoomDetail, StateType } from "@/types/housekeeping";
import {
  fetchRoomList,
  fetchTodayOperations,
  updateRoomStatus,
} from "./housekeeping-thunk";

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
