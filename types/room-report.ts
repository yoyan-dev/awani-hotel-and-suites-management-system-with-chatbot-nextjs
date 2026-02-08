export type ReportType = "lost" | "damaged" | "audit" | "incident";
export type ItemCategory =
  | "furniture"
  | "electronics"
  | "linen"
  | "decor"
  | "other";
export type DamageType =
  | "broken"
  | "stained"
  | "scratched"
  | "missing"
  | "none";
export type ReportStatus = "pending" | "in_progress" | "resolved" | "returned";
export type ReportedBy = "guest" | "staff";

export interface RoomReport {
  id?: string;
  room_number?: string;
  guest_name?: string;
  report_type?: ReportType;
  item_name?: string;
  item_category?: ItemCategory;
  quantity?: number;
  damage_type?: DamageType;
  status?: ReportStatus;
  estimated_cost?: number;
  reported_by?: ReportedBy;
  report_date?: Date;
  resolved_date?: Date;
  notes?: string;
}

export interface RoomReportFetchParams {
  query?: string;
  page?: number;
  room_number?: string;
  guest_name?: string;
  report_type?: ReportType;
  status?: ReportStatus;
}

export interface RoomReportPagination {
  page?: number;
  limit?: number;
  total?: number;
  total_pages?: number;
}

export interface RoomReportState {
  room_reports?: RoomReport[];
  room_report?: RoomReport;
  pagination?: RoomReportPagination;
  isLoading?: boolean;
  error?: any;
}
