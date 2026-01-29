"use client";

import React from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { Button, Image } from "@heroui/react";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp, X } from "lucide-react";
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
        className="top-0 z-40 bg-white dark:bg-gray-900"
      >
        <NavbarContent justify="start">
          <NavbarBrand>
            <NextLink href="/" className="flex items-center gap-2">
              <Image src="/awani-logo.png" alt="logo" width={45} />
              <div className="hidden sm:block">
                <p className="font-bold">MA. Awani</p>
                {/* <span className="text-xs text-gray-500">Hotel and Suites</span> */}
              </div>
            </NextLink>
          </NavbarBrand>
        </NavbarContent>

        {/* ───────── DESKTOP MENU ───────── */}
        <NavbarContent className="hidden sm:flex flex-1" justify="center">
          <div className="flex gap-8 items-center">
            {siteConfig.guestNavMenuItems.map((item: any) => {
              const isActive =
                pathname === item.href ||
                item?.Children?.some((child: any) => child.href === pathname);

              return (
                <div key={item.label} className="relative">
                  {!item.isExpandable ? (
                    <NextLink
                      href={item.href}
                      className={cn(
                        "relative  font-medium text-gray-700 hover:text-black transition",
                        isActive && "text-black",
                      )}
                    >
                      {item.label}

                      {isActive && (
                        <motion.span
                          layoutId="navbar-underline"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                        />
                      )}
                    </NextLink>
                  ) : (
                    <button
                      onClick={() =>
                        setExpandedDesktop((p) =>
                          p === item.label ? null : item.label,
                        )
                      }
                      className={cn(
                        "flex items-center gap-1  font-medium text-gray-700 hover:text-black",
                        isActive && "text-black",
                      )}
                    >
                      {item.label}
                      {expandedDesktop === item.label ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </button>
                  )}

                  {/* Dropdown */}
                  <AnimatePresence>
                    {item.isExpandable && expandedDesktop === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className="absolute left-0 mt-3 w-44 bg-white shadow-md rounded-sm"
                      >
                        {item.Children?.map((child: any) => (
                          <NextLink
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block px-4 py-2 text-sm hover:bg-gray-100  font-medium text-gray-700 hover:text-black",
                              isActive && "text-black",
                            )}
                            onClick={() =>
                              setExpandedDesktop((p) =>
                                p === item.label ? null : item.label,
                              )
                            }
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
          </div>
        </NavbarContent>

        {/* ───────── CTA BUTTON ───────── */}
        <NavbarContent justify="end" className="">
          <ThemeSwitch />
          <Button
            as={Link}
            href="/guest/contact-us"
            color="primary"
            radius="full"
          >
            Contact Us
          </Button>
          <div className="sm:hidden">
            <NavbarMenuToggle />
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
