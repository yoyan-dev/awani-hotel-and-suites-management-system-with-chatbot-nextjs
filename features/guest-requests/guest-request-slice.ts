import { GuestRequest, GuestRequestState } from "@/types/gues-request";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addGuestRequest,
  deleteGuestRequest,
  deleteSelectedGuestRequest,
  fetchGuestRequest,
  fetchGuestRequests,
  updateGuestRequest,
} from "./guest-request-thunk";

const initialState: GuestRequestState = {
  guest_requests: [],
  guest_request: {} as GuestRequest,
  isLoading: false,
  error: undefined,
};

const guestRequestSlice = createSlice({
  name: "guest_request",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // get single
      .addCase(fetchGuestRequest.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        fetchGuestRequest.fulfilled,
        (state, action: PayloadAction<GuestRequest>) => {
          state.isLoading = false;
          state.guest_request = action.payload;
          state.error = undefined;
        },
      )
      .addCase(fetchGuestRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // get all
      .addCase(fetchGuestRequests.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        fetchGuestRequests.fulfilled,
        (state, action: PayloadAction<GuestRequest[]>) => {
          state.isLoading = false;
          state.guest_requests = action.payload;
          state.error = undefined;
        },
      )
      .addCase(fetchGuestRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // add
      .addCase(addGuestRequest.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        addGuestRequest.fulfilled,
        (state, action: PayloadAction<GuestRequest>) => {
          state.isLoading = false;
          state.error = undefined;
          state.guest_requests.push(action.payload);
        },
      )
      .addCase(addGuestRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // update
      .addCase(updateGuestRequest.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        updateGuestRequest.fulfilled,
        (state, action: PayloadAction<GuestRequest>) => {
          state.isLoading = false;
          state.error = undefined;
          const index = state.guest_requests.findIndex(
            (r) => r.id === action.payload.id,
          );
          if (index !== -1) {
            state.guest_requests[index] = action.payload;
          }
        },
      )
      .addCase(updateGuestRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // delete
      .addCase(deleteGuestRequest.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(deleteGuestRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = undefined;
        state.guest_requests = state.guest_requests.filter(
          (r) => r.id !== action.payload,
        );
      })
      .addCase(deleteGuestRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // delete many
      .addCase(deleteSelectedGuestRequest.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(deleteSelectedGuestRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = undefined;
        state.guest_requests = state.guest_requests.filter(
          (r) => !action.payload.map((room) => room.id).includes(r.id),
        );
      })
      .addCase(deleteSelectedGuestRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setLoading } = guestRequestSlice.actions;
export default guestRequestSlice.reducer;
