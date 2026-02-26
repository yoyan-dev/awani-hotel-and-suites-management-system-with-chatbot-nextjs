export type UserMetadata = {
  full_name?: string;
  phone?: string;
  gender?: "male" | "female";
  address?: string;
  birthday?: string;
  image?: string;
  shift_type?: "AM" | "MID" | "PM" | "GY";
};

export type AppMetadata = {
  roles?:
    | ["admin", "editor"]
    | ["housekeeping", "editor"]
    | ["admin"]
    | ["housekeeping"];
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

export interface UserFormData {
  email: string;
  full_name: string;
  current_password: string;
  new_password: string;
  confirm_password: string;
  user_metadata: UserMetadata;
  image: string;
  user: User;
}
