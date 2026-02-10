export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read?: boolean;
  created_at: Date;
}

export interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error?: string;
}
