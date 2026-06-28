"use client";

import React from "react";
import { Button, Image, Link, cn } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";

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
  const closeMenus = React.useCallback(() => {
    setMenuOpen(false);
    setExpandedDesktop(null);
    setExpandedMobile(null);
  }, []);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setMenuOpen(false);
    setExpandedDesktop(null);
    setExpandedMobile(null);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-6">
      <div
        className={cn(
          "mx-auto flex w-full max-w-[1320px] items-center justify-between rounded-2xl border px-4 py-3 transition-all duration-300 sm:px-6",
          scrolled
            ? "border-[#d8cbb7]/70 bg-[#f9f4eb]/90 shadow-[0_18px_45px_-28px_rgba(46,40,29,0.6)] backdrop-blur-md dark:border-[#3a3127]/70 dark:bg-[#1b1510]/90"
            : "border-transparent bg-[#f9f4eb]/65 backdrop-blur-sm dark:border-transparent dark:bg-[#1b1510]/60",
        )}
      >
        <NextLink
          href="/guest"
          className="flex items-center gap-3"
          onClick={closeMenus}
        >
          <Image src="/awani-logo.png" alt="Ma. Awani Hotel and Suites" width={44} />
          <div className="leading-tight">
            <p className="text-xs uppercase tracking-[0.25em] text-[#7c6a52]">
              Luxury Stay
            </p>
            <p className="font-serif text-lg font-semibold text-[#1f1e1b]">
              Ma. Awani Hotel and Suites
            </p>
          </div>
        </NextLink>

        <nav className="hidden items-center gap-8 lg:flex">
          {siteConfig.guestNavMenuItems.map((item: any) => {
            const isActive =
              pathname === item.href ||
              item?.Children?.some((child: any) => child.href === pathname);

            if (!item.isExpandable) {
              return (
                <NextLink
                  key={item.label}
                  href={item.href}
                  onClick={closeMenus}
                  className={cn(
                    "relative text-sm font-semibold tracking-wide text-[#5d5549] transition-colors hover:text-[#1f1e1b]",
                    isActive && "text-[#1f1e1b]",
                  )}
                >
                  {item.label}
                  {isActive ? (
                    <span className="absolute -bottom-2 left-0 h-[2px] w-full bg-[#b08a53]" />
                  ) : null}
                </NextLink>
              );
            }

            return (
              <div key={item.label} className="relative">
                <button
                  className={cn(
                    "flex items-center gap-1 text-sm font-semibold tracking-wide text-[#5d5549] transition-colors hover:text-[#1f1e1b]",
                    isActive && "text-[#1f1e1b]",
                  )}
                  onClick={() =>
                    setExpandedDesktop((prev) =>
                      prev === item.label ? null : item.label,
                    )
                  }
                  type="button"
                >
                  {item.label}
                  {expandedDesktop === item.label ? (
                    <ChevronUp size={15} />
                  ) : (
                    <ChevronDown size={15} />
                  )}
                </button>

                <AnimatePresence>
                  {expandedDesktop === item.label ? (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute left-0 mt-4 min-w-[220px] rounded-xl border border-[#e0d4c1] bg-[#fffdf9] p-2 shadow-[0_20px_45px_-30px_rgba(31,30,27,0.55)]"
                    >
                      {item.Children?.map((child: any) => (
                        <NextLink
                          key={child.href}
                          href={child.href}
                          onClick={closeMenus}
                          className={cn(
                            "block rounded-lg px-3 py-2 text-sm font-medium text-[#5f5445] transition-colors hover:bg-[#f5ede1] hover:text-[#201f1c]",
                            pathname === child.href &&
                              "bg-[#f5ede1] text-[#201f1c]",
                          )}
                        >
                          {child.label}
                        </NextLink>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeSwitch className="text-[#5d5549] dark:text-[#d2b789]" />
          <Button
            as={Link}
            href="/guest/contact-us"
            onClick={closeMenus}
            variant="bordered"
            radius="full"
            className="border-[#ceb894] text-[#4a4033]"
          >
            Contact
          </Button>
          <Button
            as={Link}
            href="/guest/reservations/hotel-rooms"
            onClick={closeMenus}
            radius="full"
            className="bg-[#b08a53] font-semibold text-white hover:bg-[#9d7948]"
          >
            Book Now
          </Button>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-full border border-[#d9ccb9] bg-[#fffaf0] p-2 text-[#4a4033] lg:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          type="button"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto mt-3 w-full max-w-[1320px] rounded-2xl border border-[#dfd2bf] bg-[#fffdf9] p-4 shadow-[0_18px_40px_-28px_rgba(32,28,22,0.55)] lg:hidden"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="font-serif text-lg text-[#27231f]">Navigation</p>
              <ThemeSwitch className="text-[#5d5549] dark:text-[#d2b789]" />
            </div>

            <div className="space-y-2">
              {siteConfig.guestNavMenuItems.map((item: any) => {
                if (!item.isExpandable) {
                  return (
                    <NextLink
                      key={item.label}
                      href={item.href}
                      onClick={closeMenus}
                      className={cn(
                        "block rounded-xl px-3 py-3 text-sm font-medium text-[#52493d] transition-colors hover:bg-[#f4ece0]",
                        pathname === item.href && "bg-[#f4ece0] text-[#1f1e1b]",
                      )}
                    >
                      {item.label}
                    </NextLink>
                  );
                }

                const isExpanded = expandedMobile === item.label;

                return (
                  <div
                    key={item.label}
                    className="rounded-xl border border-[#ece0ce]"
                  >
                    <button
                      className="flex w-full items-center justify-between px-3 py-3 text-left text-sm font-semibold text-[#3f382f]"
                      onClick={() =>
                        setExpandedMobile((prev) =>
                          prev === item.label ? null : item.label,
                        )
                      }
                      type="button"
                    >
                      {item.label}
                      <ChevronDown
                        size={15}
                        className={cn(
                          "transition-transform",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </button>
                    <AnimatePresence>
                      {isExpanded ? (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-1 border-t border-[#ece0ce] px-2 py-2"
                        >
                          {item.Children?.map((child: any) => (
                            <NextLink
                              key={child.href}
                              href={child.href}
                              onClick={closeMenus}
                              className={cn(
                                "block rounded-lg px-3 py-2 text-sm text-[#5b5145] transition-colors hover:bg-[#f4ece0]",
                                pathname === child.href &&
                                  "bg-[#f4ece0] text-[#1f1e1b]",
                              )}
                            >
                              {child.label}
                            </NextLink>
                          ))}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                as={Link}
                href="/guest/contact-us"
                onClick={closeMenus}
                variant="bordered"
                className="border-[#ceb894] text-[#4a4033]"
              >
                Contact
              </Button>
              <Button
                as={Link}
                href="/guest/reservations/hotel-rooms"
                onClick={closeMenus}
                className="bg-[#b08a53] font-semibold text-white"
              >
                Book Now
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
