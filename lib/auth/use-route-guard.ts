"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserRoles, getStoredSession } from ".";
import type { AppMetadata, User } from "@/types/users";

type Role = NonNullable<AppMetadata["roles"]>[number];

export function useRouteGuard(requiredRole: Role) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const { session } = getStoredSession();
      if (!session?.user) {
        router.replace("/auth");
        return;
      }

      const roles = getCurrentUserRoles();
      if (!roles.includes(requiredRole)) {
        router.replace("/auth");
        return;
      }

      setUser(session.user);
    } finally {
      setLoading(false);
    }
  }, [requiredRole, router]);

  return { user, loading };
}
