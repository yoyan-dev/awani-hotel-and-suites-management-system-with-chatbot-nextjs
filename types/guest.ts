export type GuestStatus = "active" | "inactive" | "vip" | "banned";

export interface Guest {
  id: string;
  image?: string;
  full_name: string;
  email?: string;
  contact_number?: string;
  address?: string;
  nationality?: string;
  valid_id?: { front: string; back: string };
  created_at: string;
  bookings?: string[];
}

export interface GuestState {
  guests: Guest[];
  guest: Guest;
  isLoading: boolean;
  error: string | undefined;
}
