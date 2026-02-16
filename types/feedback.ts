/* =========================================
   Core Feedback Types
========================================= */

export type RatingScale = 1 | 2 | 3 | 4 | 5;
export type RecommendationValue = "yes" | "no";
export type ContactManagerValue = "yes" | "no";

/* =========================================
   Guest Info
========================================= */

export interface GuestInfo {
  full_name: string;
  email: string;
}

/* =========================================
   Stay Details
========================================= */

export interface StayDetails {
  room_type: string;
  room_number: string;
  check_in: string; // ISO date string
  check_out: string; // ISO date string
}

/* =========================================
   Feedback Core
========================================= */

export interface FeedbackCore {
  rating: RatingScale;
  comments?: string;
  recommend: RecommendationValue;
  contact_manager?: ContactManagerValue;
}

/* =========================================
   Full Feedback Payload
========================================= */

export interface FeedbackPayload extends GuestInfo, StayDetails, FeedbackCore {
  id?: string; // optional for DB
  created_at?: string; // ISO timestamp
}

export interface GuestFeedbackState {
  guest_feedbacks: FeedbackPayload[];
  guest_feedback: FeedbackPayload | null;
  isLoading: boolean;
  error: string | undefined;
}
