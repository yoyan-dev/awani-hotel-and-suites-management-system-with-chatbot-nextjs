export interface FunctionHallBooking {
  id: string;
  booking_number?: string;
  guest_id?: string;
  event_type?: string;
  event_start?: string;
  event_end?: string;
  number_of_guest?: number;
  room_id?: string;
  notes?: string;
  status?: string;
  occupancy_type?: "available" | "half occupied" | "full occupied";
  guest?: any;
  banquet_package?: any;
  payment_status?: string;
  payment_method?: string;
  booking_source?: "walk-in" | "online";
  amount_paid?: number;
  total_amount?: number;
  balance?: number;
  room?: any;
}

export interface FunctionHallBookingPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}
export interface FetchFunctionHallBookingParams {
  page?: number;
  query?: string;
  guest_id?: string;
  event_start?: string;
  event_end?: string;
  date_range?: { start: any; end: any };
  status?: string | undefined;
}
export interface FunctionHallBookingState {
  function_hall_bookings: FunctionHallBooking[];
  function_hall_booking: FunctionHallBooking;
  isLoading: boolean;
  pagination: FunctionHallBookingPagination;
  error: string | undefined;
}
