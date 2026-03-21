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

export type AuthLogApiResponse = {
  success: boolean;
  data?: {
    items: AuthLog[];
    total: number;
    page: number;
    limit: number;
  };
};
