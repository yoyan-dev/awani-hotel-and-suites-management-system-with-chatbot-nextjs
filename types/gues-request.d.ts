export interface GuestRequest {
  id?: string;
  fullname?: string;
  room_number?: string;
  request_type?: string;
  request_details?: string;
  status?: "pending" | "completed" | "cancelled";
}

export interface GuestRequestState {
  guest_requests: GuestRequest[];
  guest_request: GuestRequest;
  isLoading: boolean;
  error?: string;
}
