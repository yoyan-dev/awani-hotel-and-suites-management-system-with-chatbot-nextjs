import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Booking, BookingPagination, BookingState } from "@/types/booking";
import {
  fetchBooking,
  fetchBookings,
  addBooking,
  updateBooking,
  deleteBooking,
  deleteSelectedBooking,
} from "./booking-thunk";

const initialState: BookingState = {
  bookings: [],
  booking: {} as Booking,
  isLoading: false,
  pagination: {} as BookingPagination,
  error: undefined,
};

const bookingSlice = createSlice({
  name: "booking",
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
        (state, action: PayloadAction<Booking>) => {
          state.isLoading = false;
          state.booking = action.payload;
          state.error = undefined;
        }
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
            data: Booking[];
            pagination: BookingPagination;
          }>
        ) => {
          state.isLoading = false;
          state.bookings = action.payload.data;
          state.pagination = action.payload.pagination;
          state.error = undefined;
        }
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
        (state, action: PayloadAction<Booking>) => {
          state.isLoading = false;
          state.error = undefined;
          state.bookings.push(action.payload);
        }
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
        (state, action: PayloadAction<Booking>) => {
          state.isLoading = false;
          state.error = undefined;
          const index = state.bookings.findIndex(
            (r) => r.id === action.payload.id
          );
          if (index !== -1) {
            state.bookings[index] = action.payload;
          }
        }
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
        state.bookings = state.bookings.filter((r) => r.id !== action.payload);
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
        state.bookings = state.bookings.filter(
          (r) => !action.payload.map((room) => room.id).includes(r.id)
        );
      })
      .addCase(deleteSelectedBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setLoading } = bookingSlice.actions;
export default bookingSlice.reducer;
