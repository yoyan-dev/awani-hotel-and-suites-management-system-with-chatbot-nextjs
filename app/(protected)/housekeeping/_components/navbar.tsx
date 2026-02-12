"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import {
  cn,
  Image,
  Input,
  Listbox,
  ListboxItem,
  Spinner,
  User as UserAccount,
} from "@heroui/react";
import { Link } from "@heroui/link";
import { SearchIcon } from "lucide-react";
import NextLink from "next/link";
import { ThemeSwitch } from "@/components/theme-switch";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { User } from "@/types/users";

interface Props {
  user: User | undefined;
  isLoading: boolean;
}

export default function Navbar({ user, isLoading }: Props) {
  const pathname = usePathname();

  return (
    <HeroUINavbar
      isBlurred
      maxWidth="xl"
      position="sticky"
      className="top-0 z-50 border-b border-gray-200/50 dark:border-gray-800/50 
                 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-sm"
    >
      <NavbarContent className="gap-3" justify="start">
        <NavbarBrand as="li">
          <NextLink
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition"
          >
            <Image
              alt="Awani logo"
              src="/awani-logo.png"
              width={42}
              height={42}
            />
            <div className="leading-tight">
              <p className="font-semibold text-base text-gray-800 dark:text-gray-100">
                Ma. Awani
              </p>
              {/* <span className="text-xs text-gray-500 dark:text-gray-400">
                Hotel & Suites
              </span> */}
            </div>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-3" justify="end">
        <ThemeSwitch />
        {isLoading ? (
          <Spinner />
        ) : (
          <UserAccount
            name={user?.user_metadata?.full_name || user?.user_metadata?.name}
            description={user?.app_metadata?.roles?.[0] || "admin"}
            avatarProps={{
              src:
                user?.user_metadata?.image ||
                "https://static.vecteezy.com/system/resources/previews/021/548/095/original/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg",
            }}
            className="cursor-pointer"
          />
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-2" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu className="backdrop-blur-lg bg-white/80 dark:bg-gray-900/80">
        {siteConfig.housekeepingNavMenuItems.map((item: any) => {
          const isActive = pathname === item.href;

          return (
            <div key={item.label} className="mb-1">
              <Listbox aria-label="menu">
                <ListboxItem
                  key={item.href}
                  as={NextLink}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 py-3 px-3 rounded-lg cursor-pointer transition-all duration-200",
                    isActive
                      ? "text-primary-600 font-semibold"
                      : item.label === "Logout"
                        ? "text-red-500 hover:text-red-600"
                        : "text-gray-600 dark:text-gray-300 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-800",
                  )}
                >
                  {item.label}
                </ListboxItem>
              </Listbox>
            </div>
          );
        })}
      </NavbarMenu>
    </HeroUINavbar>
  );
}
