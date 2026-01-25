import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "@/features/counter/counter-slice";
import roomReducer from "@/features/room/room-slice";
import banquetMenuReducer from "@/features/banquet/banquet-menus/baanquet-menu-slice";
import banquetPackageReducer from "@/features/banquet-packages/baanquet-package-slice";
import functionRoomReducer from "@/features/function-room/function-room-slice";
import roomTypeReducer from "@/features/room-types/room-types.slice";
import inventoryReducer from "@/features/inventory/inventory-slice";
import bookingReducer from "@/features/booking/hotel-rooms/booking-slice";
import functionHallBookingReducer from "@/features/booking/function-hall/booking-slice";
import housekeepingReducer from "@/features/housekeeping/housekeeping-slice";
import userReducer from "@/features/users/user-slice";
import guestReducer from "@/features/guest/guest-slice";
import authReducer from "@/features/auth/auth-slice";
import staffReducer from "@/features/staff/staff-slice";
import guestRequestReducer from "@/features/guest-requests/guest-request-slice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    room: roomReducer,
    banquet_menu: banquetMenuReducer,
    banquet_package: banquetPackageReducer,
    function_room: functionRoomReducer,
    room_type: roomTypeReducer,
    inventory: inventoryReducer,
    booking: bookingReducer,
    function_hall_booking: functionHallBookingReducer,
    housekeeping: housekeepingReducer,
    users: userReducer,
    guests: guestReducer,
    auth_user: authReducer,
    staff: staffReducer,
    guest_requests: guestRequestReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
