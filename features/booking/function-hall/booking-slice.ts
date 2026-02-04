import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchBooking,
  fetchBookings,
  addBooking,
  updateBooking,
  deleteBooking,
  deleteSelectedBooking,
  completeBooking,
} from "./booking-thunk";
import {
  FunctionHallBooking,
  FunctionHallBookingPagination,
  FunctionHallBookingState,
} from "@/types/function-room-booking";

const initialState: FunctionHallBookingState = {
  function_hall_bookings: [],
  function_hall_booking: {} as FunctionHallBooking,
  isLoading: false,
  pagination: {} as FunctionHallBookingPagination,
  error: undefined,
};

const FunctionHallBookingSlice = createSlice({
  name: "function-hall-booking",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // get single room
      .addCase(fetchBooking.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        fetchBooking.fulfilled,
        (state, action: PayloadAction<FunctionHallBooking>) => {
          state.isLoading = false;
          state.function_hall_booking = action.payload;
          state.error = undefined;
        },
      )
      .addCase(fetchBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // get all rooms
      .addCase(fetchBookings.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        fetchBookings.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: FunctionHallBooking[];
            pagination: FunctionHallBookingPagination;
          }>,
        ) => {
          state.isLoading = false;
          state.function_hall_bookings = action.payload.data;
          state.pagination = action.payload.pagination;
          state.error = undefined;
        },
      )
      .addCase(fetchBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // add
      .addCase(addBooking.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        addBooking.fulfilled,
        (state, action: PayloadAction<FunctionHallBooking>) => {
          state.isLoading = false;
          state.error = undefined;
          state.function_hall_bookings.push(action.payload);
        },
      )
      .addCase(addBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // update
      .addCase(updateBooking.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        updateBooking.fulfilled,
        (state, action: PayloadAction<FunctionHallBooking>) => {
          state.isLoading = false;
          state.error = undefined;
          const index = state.function_hall_bookings.findIndex(
            (r) => r.id === action.payload.id,
          );
          if (index !== -1) {
            state.function_hall_bookings[index] = action.payload;
          }
        },
      )
      .addCase(updateBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // delete
      .addCase(deleteBooking.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = undefined;
        state.function_hall_bookings = state.function_hall_bookings.filter(
          (r) => r.id !== action.payload,
        );
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // delete many
      .addCase(deleteSelectedBooking.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(deleteSelectedBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = undefined;
        state.function_hall_bookings = state.function_hall_bookings.filter(
          (r) => !action.payload.map((room) => room.id).includes(r.id),
        );
      })
      .addCase(deleteSelectedBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // complete booking
      .addCase(completeBooking.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        completeBooking.fulfilled,
        (state, action: PayloadAction<FunctionHallBooking>) => {
          state.isLoading = false;
          state.error = undefined;
          const index = state.function_hall_bookings.findIndex(
            (r) => r.id === action.payload.id,
          );
          if (index !== -1) {
            state.function_hall_bookings[index] = action.payload;
          }
          if (state.function_hall_booking.id === action.payload.id) {
            state.function_hall_booking = action.payload;
          }
        },
      )
      .addCase(completeBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setLoading } = FunctionHallBookingSlice.actions;
export default FunctionHallBookingSlice.reducer;
