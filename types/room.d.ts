import { Pagination } from "@supabase/supabase-js";
import { Booking } from "./booking";

export type RoomStatus =
  | "vacant"
  | "cleaning"
  | "reserved"
  | "occupied"
  | "dirty"
  | "maintenance"
  | "out_of_service"
  | "booked"
  | undefined;

export interface RoomType {
  id?: string;
  image?: string;
  name?: string;
  description?: string;
  add_ons?: any;
  room_size?: string;
  max_guest?: number;
  price?: number;
  peak_season_price?: number;
}

export interface RoomTypeState {
  room_types: RoomType[];
  room_type: RoomType;
  availabel_room_types: RoomType[];
  isLoading: boolean;
  error?: string;
}

export interface FetchRoomTypesParams {
  query?: string;
  maxGuest?: number;
  checkIn?: any;
  checkOut?: any;
}

export interface Room {
  id?: string;
  room_id?: string;
  room_number?: number;
  room_type_id?: string;
  room_type?: any;
  area?: string;
  description?: string;
  status?: RoomStatus;
  images?: string[];
  remarks?: string;
  bookings?: Booking[];
  availability?: string;
}

export interface RoomPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}
export interface FetchRoomsParams {
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  query?: string;
  isStatusSelected?: boolean;
  roomTypeID?: string;
  status?: string | undefined;
  checkIn?: any;
  checkOut?: any;
  selectedDate?: any;
}
export interface RoomState {
  analytics: any;
  rooms: Room[];
  room: Room;
  available_rooms: Room[];
  pagination: RoomPagination | null;
  isLoading: boolean;
  error?: string;
}
