export type TaskStatus = "pending" | "in_progress" | "done" | "cancelled";

export interface HousekeepingTask {
  id: string;
  room_number?: number;
  guest_name?: string;
  task_type: string;
  requests?: string;
  message?: string;
  scheduled_time?: string;
  status?: TaskStatus;
  createdAt: string;
}

export interface HousekeepingPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}
export interface FetchHousekeepingParams {
  page?: number;
  query?: string;
  status?: string | undefined;
}

export interface HousekeepingState {
  tasks: HousekeepingTask[];
  task: HousekeepingTask;
  pagination: HousekeepingPagination | null;
  isLoading: boolean;
  error: string | undefined;
}
