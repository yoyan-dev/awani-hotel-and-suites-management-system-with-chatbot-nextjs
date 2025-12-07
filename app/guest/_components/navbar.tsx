import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button, Image, Spinner, User, Skeleton } from "@heroui/react";
import { Link } from "@heroui/link";
import NextLink from "next/link";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { usePathname } from "next/navigation";
import { User as UserType } from "@/types/users";
import { AvatarPopover } from "./avatar";
import React from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      className="top-0 z-50 bg-white dark:bg-gray-900 "
      isMenuOpen={menuOpen}
      onMenuOpenChange={setMenuOpen}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <div className="sm:hidden">
          <NavbarMenuToggle />
        </div>
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Image alt="Awani logo" src="/awani-logo.png" width={50} />
            <div>
              <p className="font-bold text-inherit">MA. Awani</p>
              <span className="text-gray-500 text-sm font-">
                Hotel and suites
              </span>
            </div>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        {siteConfig.guestNavMenuItems.map((item) => (
          <NavbarItem key={item.href}>
            <Link
              color={item.href === pathname ? "primary" : "foreground"}
              href={item.href}
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
        <Link>
          <ThemeSwitch />
        </Link>
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.guestNavMenuItems.map((item, index) => (
            <NavbarMenuItem
              key={`${item}-${index}`}
              isActive={item.href === pathname ? true : false}
            >
              <Link href={item.href} onPress={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          <ThemeSwitch />
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
}
