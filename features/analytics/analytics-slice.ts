import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { bookingAnalytics, functionHallAnalytics } from "./analytics-thunk";
import {
  AnalyticsState,
  FunctionHallAnalyticsResponse,
} from "@/types/analytics";
import { BookingAnalyticsResponse } from "@/types/analytics";

const initialState: AnalyticsState = {
  bookingAnalyticsData: {} as BookingAnalyticsResponse,
  functionHallAnalyticsData: {} as FunctionHallAnalyticsResponse,
  isLoading: false,
  error: undefined,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Booking Analytics
      .addCase(bookingAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        bookingAnalytics.fulfilled,
        (state, action: PayloadAction<BookingAnalyticsResponse>) => {
          state.isLoading = false;
          state.bookingAnalyticsData = action.payload;
        },
      )
      .addCase(bookingAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // 🔹 Function Hall Analytics
      .addCase(functionHallAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        functionHallAnalytics.fulfilled,
        (state, action: PayloadAction<FunctionHallAnalyticsResponse>) => {
          state.isLoading = false;
          state.functionHallAnalyticsData = action.payload;
        },
      )
      .addCase(functionHallAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLoading } = analyticsSlice.actions;
export default analyticsSlice.reducer;
