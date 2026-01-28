"use client";

import React from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { Image } from "@heroui/react";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@heroui/react";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";

export default function Navbar() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [expandedDesktop, setExpandedDesktop] = React.useState<string | null>(
    null,
  );
  const [expandedMobile, setExpandedMobile] = React.useState<string | null>(
    null,
  );
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    siteConfig.guestNavMenuItems.forEach((item: any) => {
      if (item.Children?.some((c: any) => c.href === pathname)) {
        setExpandedDesktop(item.label);
        setExpandedMobile(item.label);
      }
    });
  }, [pathname]);

  React.useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <HeroUINavbar
        maxWidth="xl"
        position="sticky"
        isMenuOpen={menuOpen}
        onMenuOpenChange={setMenuOpen}
        className={cn(
          "top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-md border-b border-white/20"
            : "bg-transparent",
        )}
      >
        <NavbarContent justify="start">
          <div className="sm:hidden">
            <NavbarMenuToggle />
          </div>

          <NavbarBrand>
            <NextLink href="/" className="flex items-center gap-2">
              <Image src="/awani-logo.png" alt="logo" width={45} />
              <div>
                <p className="font-bold">MA. Awani</p>
                <span className="text-xs text-gray-500">Hotel and Suites</span>
              </div>
            </NextLink>
          </NavbarBrand>
        </NavbarContent>

        {/* ───────── DESKTOP MENU ───────── */}
        <NavbarContent className="hidden sm:flex " justify="end">
          <div className="w-full sm:flex gap-6 items-center justify-end">
            {siteConfig.guestNavMenuItems.map((item: any) => {
              const isActive =
                pathname === item.href ||
                item?.Children?.some((child: any) => child.href === pathname);
              const isExpanded = expandedDesktop === item.label;

              return (
                <div key={item.label} className="relative">
                  {/* MAIN ITEM */}
                  {item.isExpandable ? (
                    <button
                      onClick={() =>
                        item.isExpandable
                          ? setExpandedDesktop((p) =>
                              p === item.label ? null : item.label,
                            )
                          : null
                      }
                      className={cn(
                        "relative px-2 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "text-primary-600"
                          : "text-gray-600 dark:text-gray-300 hover:text-primary-500",
                      )}
                    >
                      {item.label}

                      {/* 🔥 Animated underline */}
                      {isActive && (
                        <motion.span
                          layoutId="navbar-underline"
                          className="absolute left-0 right-0 -bottom-1 h-0.5 bg-primary-600 rounded-full"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </button>
                  ) : (
                    <NextLink
                      href={item.href}
                      className={cn(
                        "relative px-2 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "text-primary-600"
                          : "text-gray-600 dark:text-gray-300 hover:text-primary-500",
                      )}
                    >
                      {item.label}

                      {/* 🔥 Animated underline */}
                      {isActive && (
                        <motion.span
                          layoutId="navbar-underline"
                          className="absolute left-0 right-0 -bottom-1 h-0.5 bg-primary-600 rounded-full"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </NextLink>
                  )}

                  {/* SUBMENU */}
                  <AnimatePresence>
                    {item.isExpandable && isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="
                        absolute left-0  min-w-[180px]
                        rounded-sm bg-white dark:bg-gray-900
                        shadow-lg border border-gray-200 dark:border-gray-700
                        p-2
                      "
                      >
                        {item.Children?.map((child: any) => (
                          <NextLink
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block px-3 py-2 text-sm rounded-md transition",
                              pathname === child.href
                                ? "bg-primary-50 text-primary-600"
                                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800",
                            )}
                          >
                            {child.label}
                          </NextLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
            <ThemeSwitch />
          </div>
        </NavbarContent>
      </HeroUINavbar>

      {/* ───────── FULLSCREEN MOBILE MENU ───────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="
              fixed inset-0 z-100
              bg-white dark:bg-gray-900
              px-6 pt-6
            "
          >
            {/* CLOSE */}
            <div className="flex justify-between items-center mb-6">
              <p className="font-bold text-lg">Menu</p>
              <button onClick={() => setMenuOpen(false)}>
                <X />
              </button>
            </div>

            {/* MOBILE ITEMS */}
            {siteConfig.guestNavMenuItems.map((item: any) => {
              const isExpanded = expandedMobile === item.label;

              return (
                <div key={item.label} className="mb-2">
                  <button
                    onClick={() =>
                      item.isExpandable
                        ? setExpandedMobile((p) =>
                            p === item.label ? null : item.label,
                          )
                        : setMenuOpen(false)
                    }
                    className="flex items-center justify-between w-full py-3 text-lg"
                  >
                    {item.label}
                    {item.isExpandable && (
                      <ChevronDown
                        className={cn(
                          "transition-transform",
                          isExpanded && "rotate-180",
                        )}
                      />
                    )}
                  </button>

                  <AnimatePresence>
                    {item.isExpandable && isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="ml-4 border-l pl-4"
                      >
                        {item.Children?.map((child: any) => (
                          <NextLink
                            key={child.href}
                            href={child.href}
                            className="block py-2 text-gray-500"
                            onClick={() => setMenuOpen(false)}
                          >
                            {child.label}
                          </NextLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            <div className="mt-6">
              <ThemeSwitch />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
