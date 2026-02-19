"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function useAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (pathname !== "/auth" || status === "loading") {
      return;
    }

    if (status !== "authenticated" || !session?.user) {
      return;
    }

    const roles = Array.isArray(session.user.roles) ? session.user.roles : [];
    if (roles.includes("admin")) router.replace("/admin");
    else if (roles.includes("housekeeping")) router.replace("/housekeeping");
    else router.replace("/guest");
  }, [pathname, router, session, status]);
}
