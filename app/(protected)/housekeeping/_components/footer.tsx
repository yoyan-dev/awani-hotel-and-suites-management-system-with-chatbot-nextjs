"use client";

import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { cn } from "@heroui/react";
import { useState } from "react";
import LogoutConfirmationModal from "@/components/auth/logout-confirmation-modal";

export default function FooterNav() {
  const pathname = usePathname();
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center
                 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-800/50
                 px-4 py-2 sm:hidden"
    >
      <LogoutConfirmationModal
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
      />
      {siteConfig.housekeepingNavMenuItems.map((item) => {
        const isActive = pathname === item.href;
        const isLogoutItem = item.href === "/api/auth/signout";

        return (
          <Link
            key={item.href}
            href={isLogoutItem ? "#" : item.href}
            onClick={(e) => {
              if (isLogoutItem) {
                e.preventDefault();
                setLogoutOpen(true);
              }
            }}
            className={cn(
              "py-4 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 transition-all duration-200 hover:text-primary-500",
              isActive && "text-primary-600 dark:text-primary-400 scale-110",
            )}
          >
            <item.icon size={22} strokeWidth={2} />
          </Link>
        );
      })}
    </footer>
  );
}
