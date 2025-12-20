import {
  Bed,
  BrushCleaning,
  ChartPie,
  Home,
  icons,
  Inbox,
  LayoutDashboard,
  Paintbrush,
  LogOut,
  Notebook,
  Settings,
  ShieldUser,
  ShoppingCart,
  User,
  Users,
  ArrowRightLeft,
  House,
  SatelliteDish,
  ChefHatIcon,
  Calendar,
  Utensils,
} from "lucide-react";
import { Children } from "react";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Awani Hotel Management System",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Dashboard",
      href: "/admin",
      isExpandable: false,
      icon: ChartPie,
    },
    {
      label: "Room Management",
      href: "/admin/rooms",
      isExpandable: true,
      isExpand: false,
      icon: Bed,
      Children: [
        { label: "Hotel Rooms", href: "/admin/rooms/hotel-rooms" },
        { label: "Hotel Rooms Types", href: "/admin/rooms/room-types" },
        { label: "Function Rooms", href: "/admin/rooms/function-rooms" },
      ],
    },
    {
      label: "Banquet",
      href: "/admin/banquet",
      isExpandable: true,
      icon: ChefHatIcon,
      Children: [
        { label: "Banquet Menu", href: "/admin/banquet/menus" },
        { label: "Banquet Packages", href: "/admin/banquet/packages" },
      ],
    },
    {
      label: "Bookings",
      href: "/admin/bookings",
      isExpandable: true,
      icon: Notebook,
      Children: [
        { label: "Overview", href: "/admin/bookings/overview" },
        { label: "Calendar", href: "/admin/bookings/calendar" },
        { label: "Room Bookings", href: "/admin/bookings/room-bookings" },
        {
          label: "Function Room Reservation",
          href: "/admin/bookings/function-hall-bookings",
        },
      ],
    },
    // {
    //   label: "Restaurant Menus",
    //   href: "/admin/restaurant-menus",
    //   isExpandable: true,
    //   icon: Utensils,
    // },
    {
      label: "Guest",
      href: "/admin/guest",
      isExpandable: false,
      icon: Users,
    },
    {
      label: "Staff Management",
      href: "/admin/account",
      isExpandable: false,
      icon: ShieldUser,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      isExpandable: false,
      icon: Settings,
    },
    {
      label: "Log out",
      href: "/api/auth/signout",
      isExpandable: false,
      icon: LogOut,
    },
  ],
  navMenuItems: [
    {
      label: "Dashboard",
      href: "/admin",
    },
    {
      label: "Rooms",
      href: "/admin/room",
    },
    {
      label: "Inventory",
      href: "/admin/inventory",
    },
    {
      label: "Bookings",
      href: "/admin/booking",
    },
    {
      label: "Housekeeping",
      href: "/admin/housekeeping",
    },
    {
      label: "Account Management",
      href: "/admin/accounts",
    },
    {
      label: "Settings",
      href: "/admin/settings",
    },
  ],
  housekeepingNavMenuItems: [
    {
      label: "Dashboard",
      href: "/housekeeping",
      icon: LayoutDashboard,
    },
    {
      label: "Calendar",
      href: "/housekeeping/calendar",
      icon: Calendar,
    },
    {
      label: "Room Status",
      href: "/housekeeping/rooms",
      icon: Bed,
    },
    {
      label: "Guest Movement",
      href: "/housekeeping/guests",
      icon: ArrowRightLeft,
    },
    {
      label: "Guest Requests",
      href: "/housekeeping/requests",
      icon: Inbox,
    },
    {
      label: "Inventory",
      href: "/housekeeping/inventory",
      icon: ShoppingCart,
    },
    {
      label: "Settings",
      href: "/housekeeping/settings",
      icon: Settings,
    },
    {
      label: "Logout",
      href: "/api/auth/signout",
      icon: LogOut,
    },
  ],
  guestNavMenuItems: [
    {
      label: "Home",
      href: "/guest",
      isExpandable: false,
    },
    {
      label: "Reservations",
      href: "",
      isExpandable: true,
      Children: [
        { label: "Hotel Rooms", href: "/guest/reservations/hotel-rooms" },
        { label: "Function Room", href: "/guest/reservations/function-room" },
      ],
    },
    {
      label: "Your Stay",
      href: "/guest/booking",
      isExpandable: false,
    },
    {
      label: "About Us",
      href: "/guest/about",
      isExpandable: false,
    },
    {
      label: "Contact",
      href: "/guest/contact",
      isExpandable: false,
    },
  ],
};
