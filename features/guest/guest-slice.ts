import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Guest, GuestState } from "@/types/guest";
import {
  addGuest,
  deleteGuest,
  deleteSelectedGuest,
  fetchGuest,
  fetchGuests,
  updateGuest,
} from "./guest-thunk";

const initialState: GuestState = {
  guests: [],
  guest: {} as Guest,
  isLoading: false,
  error: undefined,
};

const guestSlice = createSlice({
  name: "guest",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // get single
      .addCase(fetchGuest.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchGuest.fulfilled, (state, action: PayloadAction<Guest>) => {
        state.isLoading = false;
        state.guest = action.payload;
        state.error = undefined;
      })
      .addCase(fetchGuest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // get all s
      .addCase(fetchGuests.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        fetchGuests.fulfilled,
        (state, action: PayloadAction<Guest[]>) => {
          state.isLoading = false;
          state.guests = action.payload;
          state.error = undefined;
        },
      )
      .addCase(fetchGuests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // add
      .addCase(addGuest.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(addGuest.fulfilled, (state, action: PayloadAction<Guest>) => {
        state.isLoading = false;
        state.error = undefined;
        state.guest = action.payload;
        state.guests.push(action.payload);
      })
      .addCase(addGuest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // update
      .addCase(updateGuest.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(updateGuest.fulfilled, (state, action: PayloadAction<Guest>) => {
        state.isLoading = false;
        state.error = undefined;
        const index = state.guests.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.guests[index] = action.payload;
        }
      })
      .addCase(updateGuest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // delete
      .addCase(deleteGuest.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(deleteGuest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = undefined;
        state.guests = state.guests.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteGuest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // delete s
      .addCase(deleteSelectedGuest.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(deleteSelectedGuest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = undefined;
        state.guests = state.guests.filter(
          (r) => !action.payload.map((row) => row.id).includes(r.id),
        );
      })
      .addCase(deleteSelectedGuest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setLoading } = guestSlice.actions;
export default guestSlice.reducer;
