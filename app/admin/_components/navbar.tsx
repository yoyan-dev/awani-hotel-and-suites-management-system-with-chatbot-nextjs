import React from "react";
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
  Link,
  Listbox,
  ListboxItem,
  Spinner,
  User as UserAccount,
} from "@heroui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { ChevronDown } from "lucide-react";
import { User } from "@/types/users";

interface Props {
  user: User | undefined;
  isLoading: boolean;
}

export default function AdminNavbar({ user, isLoading }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);

  const toggleExpand = (label: string) =>
    setExpandedItem((prev) => (prev === label ? null : label));
  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      className="top-0 z-40 bg-white dark:bg-gray-900"
      isMenuOpen={menuOpen}
      onMenuOpenChange={setMenuOpen}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Image alt="Awani logo" src="/awani-logo.png" width={50} />
            <div>
              <p className="font-bold text-inherit">Ma. Awani</p>
              {/* <span className="text-gray-500 text-sm flex gap-2">
                Hotel and suites{" "}
                <span className="hidden md:block">management system</span>
              </span> */}
            </div>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
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
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
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
                  endContent={
                    item.isExpandable ? (
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
                  {item.label}
                </ListboxItem>
              </Listbox>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ml-9 border-l border-gray-300 dark:border-gray-700 pl-3",
                  isExpanded
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
      </NavbarMenu>
    </HeroUINavbar>
  );
}
