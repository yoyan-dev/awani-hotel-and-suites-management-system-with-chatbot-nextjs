import { Pagination } from "@supabase/supabase-js";
import { Booking } from "./booking";

export type RoomStatus =
  | "available"
  | "cleaning"
  | "reserved"
  | "occupied"
  | "dirty"
  | "maintenance"
  | "out_of_service"
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
  isLoading: boolean;
  error?: string;
}

export interface FetchRoomTypesParams {
  query?: string;
  max_guest?: string;
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
  totalPages: number;
}
export interface FetchRoomsParams {
  page?: number;
  query?: string;
  roomTypeID?: string;
  status?: string | undefined;
  minPrice?: number;
  maxPrice?: number;
  checkIn?: any;
  checkOut?: any;
}
export interface RoomState {
  rooms: Room[];
  room: Room;
  pagination: RoomPagination | null;
  isLoading: boolean;
  error?: string;
}
