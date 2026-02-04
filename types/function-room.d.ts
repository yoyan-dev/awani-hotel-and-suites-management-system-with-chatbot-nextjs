export interface FunctionRoom {
  id?: string;
  image?: string;
  room_number?: number;
  type?: string;
  max_guest?: number;
  size?: string;
  description?: string;
  bookings?: any;
  status?: string;
  total_guests?: number;
  remaining_slots?: number;
  availability?: string;
  availability_status?: "available" | "half occupied" | "full occupied";
  remarks?: string;
}

export interface AvailableFunctionRoom extends FunctionRoom {
  total_guests: number;
  remaining_slots: number;
  availability: string;
  availability_status: "available" | "half occupied" | "full occupied";
}

export interface FunctionRoomPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}
export interface FunctionRoomState {
  function_rooms: FunctionRoom[];
  function_room: FunctionRoom;
  pagination: FunctionRoomPagination | null;
  isLoading: boolean;
  error?: string;
}

export interface FetchFunctionRoomParams {
  page?: number;
  query?: string;
  status?: string | undefined;
  event_date?: any;
  start?: any;
  end?: any;
}
