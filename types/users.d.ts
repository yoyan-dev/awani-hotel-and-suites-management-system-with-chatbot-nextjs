export type UserMetadata = {
  full_name?: string;
  name?: string;
  phone?: string;
  gender?: "male" | "female";
  address?: string;
  birthday?: string;
  image?: string;
};

export type AppMetadata = {
  roles?: ["admin", "editor"] | ["housekeeping", "editor"] | ["guest"];
  department?: string;
  permissions?: string[];
  provider?: string;
};

export type User = {
  id: string;
  email: string;
  user_metadata: UserMetadata;
  app_metadata: AppMetadata;
};

export interface UserState {
  users: User[];
  user: User;
  isLoading: boolean;
  error: string | undefined;
}
