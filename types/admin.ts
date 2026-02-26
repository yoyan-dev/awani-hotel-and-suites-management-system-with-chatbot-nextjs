export type UserMetadata = {
  name?: string;
  phone?: string;
  gender?: "male" | "female";
  address?: string;
  birthday?: string;
  emergency_contact?: {
    name: string;
    phone: string;
  };
};

export type AppMetadata = {
  roles?:
    | ["admin", "editor"]
    | ["front_office", "editor"]
    | ["housekeeping", "editor"]
    | ["guest"];
  department?: string;
  permissions?: string[];
  provider?: string;
};

export type Admin = {
  id: string;
  email: string;
  user_metadata: UserMetadata;
  app_metadata: AppMetadata;
};
