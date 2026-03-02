export type BookingFormStep = 1 | 2 | 3;

export interface BookingPreviewData {
  full_name: string;
  contact_number: string;
  email: string;
  address: string;
  nationality: string;
  gender: string;
  event_type: string;
  number_of_guest: string;
  notes: string;
  event_start: string;
  event_end: string;
}
