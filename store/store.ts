import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "@/features/counter/counter-slice";
import roomReducer from "@/features/room/room-slice";
import functionRoomReducer from "@/features/function-room/function-room-slice";
import roomTypeReducer from "@/features/room-types/room-types.slice";
import inventoryReducer from "@/features/inventory/inventory-slice";
import bookingReducer from "@/features/booking/hotel-rooms/booking-slice";
import functionHallBookingReducer from "@/features/booking/function-hall/booking-slice";
import housekeepingReducer from "@/features/housekeeping/housekeeping-slice";
import userReducer from "@/features/users/user-slice";
import guestReducer from "@/features/guest/guest-slice";
import authReducer from "@/features/auth/auth-slice";
import analyticsReducer from "@/features/analytics/analytics-slice";
import roomReportReducer from "@/features/room-reports/room-report-slice";
import notificationReducer from "@/features/notifications/notification-slice";
import feedbackReducer from "@/features/feedback/feedback-slice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    room: roomReducer,
    function_room: functionRoomReducer,
    room_type: roomTypeReducer,
    inventory: inventoryReducer,
    booking: bookingReducer,
    function_hall_booking: functionHallBookingReducer,
    housekeeping: housekeepingReducer,
    users: userReducer,
    guests: guestReducer,
    auth_user: authReducer,
    analytics: analyticsReducer,
    room_reports: roomReportReducer,
    notifications: notificationReducer,
    feedback: feedbackReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
