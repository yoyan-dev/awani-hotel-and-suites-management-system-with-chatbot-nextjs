export type RatingScale = 1 | 2 | 3 | 4 | 5;
export type RecommendationValue = "yes" | "no";
export type ContactManagerValue = "yes" | "no";

export interface GuestInfo {
  full_name: string;
  email: string;
}

export interface StayDetails {
  room_type: string;
  room_number: string;
  check_in: string;
  check_out: string;
}
export interface FeedbackCore {
  rating: RatingScale;
  comments?: string;
  recommend: RecommendationValue;
}

export interface FeedbackPayload extends GuestInfo, StayDetails, FeedbackCore {
  id?: string;
  created_at?: string;
}

export interface FeedbackPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface FeedbackFetchParams {
  page?: number;
  query?: string;
}

export interface GuestFeedbackState {
  guest_feedbacks: FeedbackPayload[];
  guest_feedback: FeedbackPayload | null;
  pagination: FeedbackPagination;
  isLoading: boolean;
  error: string | undefined;
}
