import {
  Bed,
  ChartPie,
  LayoutDashboard,
  LogOut,
  Notebook,
  Settings,
  ShieldUser,
  ShoppingCart,
  ChefHatIcon,
  Calendar,
  InfoIcon,
  MessageSquare,
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
    // {
    //   label: "Banquet Packages",
    //   href: "/admin/banquet/packages",
    //   isExpandable: false,
    //   icon: ChefHatIcon,
    //   Children: [
    //     { label: "Banquet Menu", href: "/admin/banquet/menus" },
    //     { label: "Banquet Packages", href: "/admin/banquet/packages" },
    //   ],
    // },
    {
      label: "Room Management",
      href: "/admin/rooms",
      isExpandable: true,
      isExpand: false,
      icon: Bed,
      Children: [
        { label: "Hotel Rooms", href: "/admin/rooms/hotel-rooms" },
        { label: "Hotel Rooms Types", href: "/admin/rooms/room-types" },
        // { label: "Function Rooms", href: "/admin/rooms/function-rooms" },
        {
          label: "Room Reports",
          href: "/admin/rooms/reportings",
        },
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
    {
      label: "Guest Feedbacks",
      href: "/admin/feedback",
      isExpandable: false,
      icon: MessageSquare,
    },
    // {
    //   label: "Guest",
    //   href: "/admin/guest",
    //   isExpandable: false,
    //   icon: Users,
    // },
    {
      label: "Account Management",
      href: "/admin/accounts",
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
      label: "Room Reports",
      href: "/housekeeping/reportings",
      icon: InfoIcon,
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
    // {
    //   label: "Sections",
    //   href: "",
    //   isExpandable: true,
    //   Children: [
    //     { label: "Hero", href: "/guest#home" },
    //     { label: "About", href: "/guest#about" },
    //     { label: "Amenities", href: "/guest#amenities" },
    //     { label: "Ridgeview", href: "/guest#ridgeview" },
    //     { label: "Rooms", href: "/guest#rooms" },
    //     { label: "Testimonials", href: "/guest#testimonials" },
    //     { label: "Gallery", href: "/guest#gallery" },
    //     { label: "Location", href: "/guest#location" },
    //   ],
    // },
    {
      label: "Hotel Rooms",
      href: "/guest/reservations/hotel-rooms",
      isExpandable: false,
      // Children: [
      //   { label: "Book Hotel Rooms", href: "/guest/reservations/hotel-rooms" },
      //   {
      //     label: "Event Reservations",
      //     href: "/guest/reservations/function-room",
      //   },
      // ],
    },
    {
      label: "Event Reservations",
      href: "/guest/reservations/function-room",
      isExpandable: false,
    },
    // {
    //   label: "Your Stay",
    //   href: "/guest/guest-request",
    //   isExpandable: false,
    // },
    {
      label: "About Us",
      href: "/guest/about-us",
      isExpandable: false,
    },
    // {
    //   label: "Contact",
    //   href: "#contact",
    //   isExpandable: false,
    // },
  ],
};
