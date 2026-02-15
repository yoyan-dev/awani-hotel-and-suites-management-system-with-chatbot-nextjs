"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getStoredSession, getCurrentUserRoles } from ".";

export function useAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/auth") {
      return;
    }

    const { session } = getStoredSession();
    if (!session?.user) {
      return;
    }

    const roles = getCurrentUserRoles();
    if (roles.includes("admin")) router.replace("/admin");
    else if (roles.includes("housekeeping")) router.replace("/housekeeping");
    else router.replace("/guest");
  }, [pathname, router]);
}
