"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Image, Listbox, ListboxItem, cn } from "@heroui/react";
import { siteConfig } from "@/config/site";
import { useState } from "react";
import UserPopover from "./user-popover";
import { signOut } from "next-auth/react";

export const ListboxWrapper = ({ children, collapsed }: any) => {
  return (
    <div
      className={cn(
        "relative h-screen flex flex-col border-r border-default-200 dark:border-default-100 transition-all duration-300 ease-in-out",
        collapsed ? "w-[5rem]" : "w-[16rem]",
      )}
    >
      {children}
    </div>
  );
};

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl hidden lg:flex shadow-xl">
      <ListboxWrapper collapsed={collapsed}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-40 z-10 bg-primary-400 text-white p-1.5 rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-transform"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* <div
          className={cn(
            "flex items-center gap-2 bg-gradient-to-r from-primary-100/60 to-primary-50/60 dark:from-gray-800 dark:to-gray-700 p-3 rounded-lg shadow-sm m-3 transition-all duration-300",
            collapsed && "justify-center"
          )}
        >
          <UserPopover collapsed={collapsed} />
        </div> */}
        <div className="flex flex-col justify-center items-center  bg-primary py-4 text-white transition">
          <Image
            alt="Awani logo"
            src="/awani-logo.png"
            width={collapsed ? 40 : 100}
            className="bg-black/80 p-2"
            radius="full"
          />
          {!collapsed ? "Ma AWANI" : ""}
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-hide px-2 mt-3">
          {siteConfig.housekeepingNavMenuItems.map((item: any) => {
            const isActive = pathname === item.href;
            const isLogoutItem = item.href === "/api/auth/signout";

            return (
              <div key={item.label} className="mb-1">
                <Listbox aria-label="menu">
                  <ListboxItem
                    key={item.href}
                    onClick={() => {
                      if (isLogoutItem) {
                        signOut({ callbackUrl: "/auth" });
                      }
                    }}
                    as={!item.isExpandable && !isLogoutItem ? NextLink : undefined}
                    href={
                      !item.isExpandable && !isLogoutItem ? item.href : undefined
                    }
                    className={cn(
                      "group flex items-center gap-3 py-3 px-3 rounded-lg cursor-pointer transition-all duration-200",
                      isActive
                        ? "text-primary-600 font-semibold"
                        : isLogoutItem
                          ? "text-red-500 hover:text-red-600"
                          : "text-gray-600 dark:text-gray-300 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-800",
                    )}
                    startContent={
                      <item.icon
                        size={20}
                        className={cn(
                          "transition-all duration-300",
                          isActive
                            ? "text-primary-500"
                            : "text-gray-400 group-hover:text-primary-500",
                        )}
                      />
                    }
                  >
                    {!collapsed && item.label}
                  </ListboxItem>
                </Listbox>
              </div>
            );
          })}
        </nav>

        <div className="mt-auto mb-3 px-4 text-xs text-gray-400 dark:text-gray-500">
          {!collapsed && <p>© 2025 MA. AWANI</p>}
        </div>
      </ListboxWrapper>
    </aside>
  );
}
