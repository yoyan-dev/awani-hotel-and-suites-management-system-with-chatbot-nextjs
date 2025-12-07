import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RoomType, RoomTypeState } from "@/types/room";
import {
  fetchRoomType,
  fetchRoomTypes,
  addRoomType,
  updateRoomType,
  deleteRoomType,
  fetchAvailableRoomTypes,
} from "./room-types-thunk";

const initialState: RoomTypeState = {
  room_types: [],
  room_type: {} as RoomType,
  availabel_room_types: [],
  isLoading: false,
  error: undefined,
};

const roomTypeSlice = createSlice({
  name: "room_types",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // get single room
      .addCase(fetchRoomType.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        fetchRoomType.fulfilled,
        (state, action: PayloadAction<RoomType>) => {
          state.isLoading = false;
          state.room_type = action.payload;
          state.error = undefined;
        }
      )
      .addCase(fetchRoomType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // get all rooms
      .addCase(fetchRoomTypes.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        fetchRoomTypes.fulfilled,
        (state, action: PayloadAction<RoomType[]>) => {
          state.isLoading = false;
          state.room_types = action.payload;
          state.error = undefined;
        }
      )
      .addCase(fetchRoomTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // get all available rooms
      .addCase(fetchAvailableRoomTypes.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        fetchAvailableRoomTypes.fulfilled,
        (state, action: PayloadAction<RoomType[]>) => {
          state.isLoading = false;
          state.availabel_room_types = action.payload;
          state.error = undefined;
        }
      )
      .addCase(fetchAvailableRoomTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // add room
      .addCase(addRoomType.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        addRoomType.fulfilled,
        (state, action: PayloadAction<RoomType>) => {
          state.isLoading = false;
          state.error = undefined;
          state.room_types.push(action.payload);
        }
      )
      .addCase(addRoomType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // update room
      .addCase(updateRoomType.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        updateRoomType.fulfilled,
        (state, action: PayloadAction<RoomType>) => {
          state.isLoading = false;
          state.error = undefined;
          const index = state.room_types.findIndex(
            (r) => r.id === action.payload.id
          );
          if (index !== -1) {
            state.room_types[index] = action.payload;
          }
        }
      )
      .addCase(updateRoomType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // delete room
      .addCase(deleteRoomType.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(deleteRoomType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = undefined;
        state.room_types = state.room_types.filter(
          (r) => r.id !== action.payload
        );
      })
      .addCase(deleteRoomType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setLoading } = roomTypeSlice.actions;
export default roomTypeSlice.reducer;
