import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Room, RoomPagination, RoomState, RoomStatus } from "@/types/room";
import {
  fetchRoom,
  fetchRooms,
  addRoom,
  updateRoom,
  deleteRoom,
  deleteRooms,
  fetchAvailableRooms,
} from "./room-thunk";

const initialState: RoomState = {
  rooms: [],
  room: {} as Room,
  available_rooms: [],
  pagination: {} as RoomPagination,
  isLoading: false,
  error: undefined,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // get single room
      .addCase(fetchRoom.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchRoom.fulfilled, (state, action: PayloadAction<Room>) => {
        state.isLoading = false;
        state.room = action.payload;
        state.error = undefined;
      })
      .addCase(fetchRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // get all rooms
      .addCase(fetchRooms.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        fetchRooms.fulfilled,
        (
          state,
          action: PayloadAction<{ data: Room[]; pagination: RoomPagination }>
        ) => {
          state.isLoading = false;
          state.rooms = action.payload.data;
          state.pagination = action.payload.pagination;
          state.error = undefined;
        }
      )

      .addCase(fetchRooms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      //fetch availbale rooms
      .addCase(fetchAvailableRooms.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        fetchAvailableRooms.fulfilled,
        (state, action: PayloadAction<{ data: Room[] }>) => {
          state.isLoading = false;
          state.available_rooms = action.payload.data;
          state.error = undefined;
        }
      )
      .addCase(fetchAvailableRooms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // add room
      .addCase(addRoom.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(addRoom.fulfilled, (state, action: PayloadAction<Room>) => {
        state.isLoading = false;
        state.error = undefined;
        state.rooms.push(action.payload);
      })
      .addCase(addRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // update room
      .addCase(updateRoom.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(updateRoom.fulfilled, (state, action: PayloadAction<Room>) => {
        state.isLoading = false;
        state.error = undefined;
        const index = state.rooms.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.rooms[index] = action.payload;
        }
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // delete room
      .addCase(deleteRoom.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = undefined;
        state.rooms = state.rooms.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // delete rooms
      .addCase(deleteRooms.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(deleteRooms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = undefined;
        state.rooms = state.rooms.filter(
          (r) => !action.payload.map((room) => room.id).includes(r.id)
        );
      })
      .addCase(deleteRooms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setLoading } = roomSlice.actions;
export default roomSlice.reducer;
