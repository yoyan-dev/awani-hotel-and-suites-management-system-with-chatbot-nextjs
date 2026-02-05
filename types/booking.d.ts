export type BookingStatus =
  | "pending"
  | "proceding"
  | "reserved"
  | "confirmed"
  | "cancelled"
  | "check-in"
  | "check-out";

export interface Booking {
  id: string;
  booking_number?: string;
  guest_id: string;
  room_id: string;
  room_type_id: string;
  check_in: string;
  check_out: string;
  company?: string;
  special_requests: any;
  places_last_visited?: string;
  purpose?: string;
  number_of_guests?: number;
  recent_sickness?: string[];
  total_add_ons: string;
  total: string;
  request_messages?: string;
  payment_status?: "pending" | "paid" | "unpaid" | "downpayment";
  payment_method?: string;
  booking_source?: "walk-in" | "online";
  amount_paid?: number;
  status: BookingStatus;
  room?: any;
  user?: any;
  room_type?: any;
  created_at: any;
}

export interface BookingPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}
export interface FetchBookingParams {
  page?: number;
  query?: string;
  guest_id?: string;
  check_in?: any;
  check_out?: any;
  date_range?: { start: any; end: any };
  roomTypeID?: string;
  room_id?: string;
  status?: string | undefined;
  limit?: any;
}
export interface BookingState {
  bookings: Booking[];
  booking: Booking;
  isLoading: boolean;
  pagination: BookingPagination;
  error: string | undefined;
}
