import "next-auth";
import "next-auth/jwt";
import type { DefaultSession } from "next-auth";

import type { AppMetadata, UserMetadata } from "@/types/users";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles: string[];
      user_metadata: UserMetadata;
      app_metadata: AppMetadata;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    roles: string[];
    user_metadata: UserMetadata;
    app_metadata: AppMetadata;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    roles?: string[];
    user_metadata?: UserMetadata;
    app_metadata?: AppMetadata;
  }
}
