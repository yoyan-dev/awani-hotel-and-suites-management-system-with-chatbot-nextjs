import {
  FunctionRoom,
  FunctionRoomPagination,
  FunctionRoomState,
} from "@/types/function-room";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addFunctionRoom,
  deleteFunctionRoom,
  deleteFunctionRooms,
  fetchFunctionRoom,
  fetchFunctionRooms,
  updateFunctionRoom,
} from "./function-room-thunk";

const initialState: FunctionRoomState = {
  function_rooms: [],
  function_room: {} as FunctionRoom,
  pagination: {} as FunctionRoomPagination,
  isLoading: false,
  error: undefined,
};

const FunctionRoomSlice = createSlice({
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
      .addCase(fetchFunctionRoom.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        fetchFunctionRoom.fulfilled,
        (state, action: PayloadAction<FunctionRoom>) => {
          state.isLoading = false;
          state.function_room = action.payload;
          state.error = undefined;
        }
      )
      .addCase(fetchFunctionRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // get all rooms
      .addCase(fetchFunctionRooms.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        fetchFunctionRooms.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: FunctionRoom[];
            pagination: FunctionRoomPagination;
          }>
        ) => {
          state.isLoading = false;
          state.function_rooms = action.payload.data;
          state.pagination = action.payload.pagination;
          state.error = undefined;
        }
      )

      .addCase(fetchFunctionRooms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      //fetch availbale rooms
      // .addCase(fetchAvailableRooms.pending, (state) => {
      //   state.isLoading = true;
      //   state.error = undefined;
      // })
      // .addCase(
      //   fetchAvailableRooms.fulfilled,
      //   (state, action: PayloadAction<{ data: Room[] }>) => {
      //     state.isLoading = false;
      //     state.rooms = action.payload.data;
      //     state.error = undefined;
      //   }
      // )
      // .addCase(fetchAvailableRooms.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error = action.error.message;
      // })

      // add room
      .addCase(addFunctionRoom.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        addFunctionRoom.fulfilled,
        (state, action: PayloadAction<FunctionRoom>) => {
          state.isLoading = false;
          state.error = undefined;
          state.function_rooms.push(action.payload);
        }
      )
      .addCase(addFunctionRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // update room
      .addCase(updateFunctionRoom.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        updateFunctionRoom.fulfilled,
        (state, action: PayloadAction<FunctionRoom>) => {
          state.isLoading = false;
          state.error = undefined;
          const index = state.function_rooms.findIndex(
            (r) => r.id === action.payload.id
          );
          if (index !== -1) {
            state.function_rooms[index] = action.payload;
          }
        }
      )
      .addCase(updateFunctionRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // delete room
      .addCase(deleteFunctionRoom.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(deleteFunctionRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = undefined;
        state.function_rooms = state.function_rooms.filter(
          (r) => r.id !== action.payload
        );
      })
      .addCase(deleteFunctionRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // delete rooms
      .addCase(deleteFunctionRooms.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(deleteFunctionRooms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = undefined;
        state.function_rooms = state.function_rooms.filter(
          (r) => !action.payload.map((room) => room.id).includes(r.id)
        );
      })
      .addCase(deleteFunctionRooms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setLoading } = FunctionRoomSlice.actions;
export default FunctionRoomSlice.reducer;
