"use client";

import React from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Image, Listbox, ListboxItem, Link, cn } from "@heroui/react";
import { siteConfig } from "@/config/site";

export const ListboxWrapper = ({ children, collapsed }: any) => (
  <div
    className={cn(
      "relative h-screen flex flex-col border-r border-default-200 dark:border-default-100 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl transition-all duration-300 ease-in-out",
      collapsed ? "w-[4.2rem]" : "w-[16rem]",
    )}
  >
    {children}
  </div>
);

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);

  const toggleExpand = (label: string) =>
    setExpandedItem((prev) => (prev === label ? null : label));

  return (
    <aside className="hidden lg:flex shadow-xl">
      <ListboxWrapper collapsed={collapsed}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-40 z-20 bg-primary text-white p-1.5 rounded-full shadow-md hover:scale-110 transition-transform duration-300"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        <div className="flex flex-col justify-center items-center py-6 bg-primary text-white transition-all duration-300">
          <Image
            alt="Awani logo"
            src="/awani-logo.png"
            width={collapsed ? 40 : 90}
            className="bg-black/80 p-2 rounded-full transition-all duration-300"
          />
          {!collapsed && (
            <p className="mt-2 text-sm tracking-wide opacity-100 transition-opacity duration-300">
              MA AWANI
            </p>
          )}
        </div>

        <nav className="flex-1 px-2 mt-4 overflow-y-auto scrollbar-hide">
          {siteConfig.navItems.map((item: any) => {
            const isActive = pathname === item.href;
            const isExpanded = expandedItem === item.label;

            return (
              <div key={item.label} className="mb-1">
                <Listbox aria-label="menu">
                  <ListboxItem
                    key={item.href}
                    onClick={() =>
                      item.isExpandable ? toggleExpand(item.label) : null
                    }
                    as={!item.isExpandable ? NextLink : undefined}
                    href={!item.isExpandable ? item.href : undefined}
                    className={cn(
                      "group flex items-center gap-3 py-3 px-3 rounded-lg cursor-pointer transition-all duration-200",
                      isActive
                        ? "text-primary-600 font-semibold"
                        : item.label === "Logout"
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
                    endContent={
                      item.isExpandable && !collapsed ? (
                        <ChevronDown
                          size={18}
                          className={cn(
                            "transition-transform duration-300",
                            isExpanded ? "rotate-180" : "",
                          )}
                        />
                      ) : null
                    }
                  >
                    {!collapsed && item.label}
                  </ListboxItem>
                </Listbox>

                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ml-9 border-l border-gray-300 dark:border-gray-700 pl-3",
                    isExpanded && !collapsed
                      ? "max-h-[400px] opacity-100 py-1"
                      : "max-h-0 opacity-0 py-0",
                  )}
                >
                  {item.Children?.map((child: any, i: number) => (
                    <Link
                      as={NextLink}
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "block text-sm py-1.5 rounded-md transition-all duration-300",
                        pathname === child.href
                          ? "text-primary-600 font-medium"
                          : "text-gray-500 hover:text-primary-500",
                      )}
                      style={{
                        transitionDelay: `${i * 60}ms`,
                      }}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto mb-4 px-4 text-xs text-gray-400 dark:text-gray-500">
          {!collapsed && (
            <p className="transition-opacity duration-300">© 2025 MA AWANI</p>
          )}
        </div>
      </ListboxWrapper>
    </aside>
  );
}
