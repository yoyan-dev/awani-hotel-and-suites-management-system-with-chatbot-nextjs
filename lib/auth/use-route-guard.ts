"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { AppMetadata, User } from "@/types/users";

type Role = NonNullable<AppMetadata["roles"]>[number];

export function useRouteGuard(requiredRole: Role) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const loading = status === "loading";

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated" || !session?.user) {
      router.replace("/auth");
      return;
    }

    const roles = Array.isArray(session.user.roles) ? session.user.roles : [];
    if (!roles.includes(requiredRole)) {
      router.replace("/auth");
      return;
    }

    setUser(session.user as User);
  }, [requiredRole, router, session, status]);

  return { user, loading };
}
