import { ApiResponse } from "@/types/response";

export type AuthLog = {
  id: string;
  user_id: string | null;
  email: string | null;
  role: string | null;
  event_type: "login" | "logout";
  event_at: string;
  ip_address?: string | null;
  user_agent?: string | null;
  device_name?: string | null;
};

export interface AuthLogPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface AuthLogFetchParams {
  page?: number;
  query?: string;
  userId?: string;
}

export interface AuthLogState {
  logs: AuthLog[];
  pagination: AuthLogPagination;
  isLoading: boolean;
  error: string | undefined;
}

export interface AuthLogApiResponse extends ApiResponse<AuthLog[]> {
  pagination?: AuthLogPagination;
}
