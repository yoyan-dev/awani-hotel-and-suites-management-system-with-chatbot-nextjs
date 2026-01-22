export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}
export interface ApiResponse<T = any> {
  success: boolean;
  message: {
    title: string;
    description: any;
    color: "success" | "error" | "warning" | "danger";
  };
  data?: T;
  pagination?: Pagination;
  error?: string;
}
