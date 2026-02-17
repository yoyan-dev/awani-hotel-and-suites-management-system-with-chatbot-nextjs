import {
  FeedbackPagination,
  FeedbackPayload,
  GuestFeedbackState,
} from "@/types/feedback";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addGuestFeedback,
  deleteGuestFeedback,
  deleteSelectedGuestFeedback,
  fetchGuestFeedback,
  fetchGuestFeedbacks,
  updateGuestFeedback,
} from "./feedback-request-thunk";

const initialState: GuestFeedbackState = {
  guest_feedbacks: [],
  guest_feedback: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  },
  isLoading: false,
  error: undefined,
};

const guestRequestFeedback = createSlice({
  name: "guest_feedback",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // get single
      .addCase(fetchGuestFeedback.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        fetchGuestFeedback.fulfilled,
        (state, action: PayloadAction<FeedbackPayload>) => {
          state.isLoading = false;
          state.guest_feedback = action.payload;
          state.error = undefined;
        },
      )
      .addCase(fetchGuestFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // get all
      .addCase(fetchGuestFeedbacks.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        fetchGuestFeedbacks.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: FeedbackPayload[];
            pagination: FeedbackPagination;
          }>,
        ) => {
          state.isLoading = false;
          state.guest_feedbacks = action.payload.data;
          state.pagination = action.payload.pagination;
          state.error = undefined;
        },
      )
      .addCase(fetchGuestFeedbacks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // add
      .addCase(addGuestFeedback.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        addGuestFeedback.fulfilled,
        (state, action: PayloadAction<FeedbackPayload>) => {
          state.isLoading = false;
          state.error = undefined;
          state.guest_feedbacks.push(action.payload);
        },
      )
      .addCase(addGuestFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // update
      .addCase(updateGuestFeedback.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        updateGuestFeedback.fulfilled,
        (state, action: PayloadAction<FeedbackPayload>) => {
          state.isLoading = false;
          state.error = undefined;
          const index = state.guest_feedbacks.findIndex(
            (r) => r.id === action.payload.id,
          );
          if (index !== -1) {
            state.guest_feedbacks[index] = action.payload;
          }
        },
      )
      .addCase(updateGuestFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // delete
      .addCase(deleteGuestFeedback.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(deleteGuestFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = undefined;
        state.guest_feedbacks = state.guest_feedbacks.filter(
          (r) => r.id !== action.payload,
        );
      })
      .addCase(deleteGuestFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // delete many
      .addCase(deleteSelectedGuestFeedback.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(deleteSelectedGuestFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = undefined;
        state.guest_feedbacks = state.guest_feedbacks.filter(
          (r) => !action.payload.map((room) => room.id).includes(r.id),
        );
      })
      .addCase(deleteSelectedGuestFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setLoading } = guestRequestFeedback.actions;
export default guestRequestFeedback.reducer;
