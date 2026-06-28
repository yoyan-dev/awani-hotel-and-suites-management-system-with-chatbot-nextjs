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
  name: "Awani Hotel & Suites",
  description: "Make beautiful websites regardless of your design experience.",
  navAdminItems: [
    {
      label: "Dashboard",
      href: "/admin",
      isExpandable: false,
      icon: ChartPie,
    },
    {
      label: "Inventory",
      href: "/admin/inventory",
      isExpandable: false,
      icon: ShoppingCart,
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
  navFrontOfficeItems: [
    {
      label: "Dashboard",
      href: "/front-office",
      isExpandable: false,
      icon: ChartPie,
    },
    // {
    //   label: "Banquet Packages",
    //   href: "/front-office/banquet/packages",
    //   isExpandable: false,
    //   icon: ChefHatIcon,
    //   Children: [
    //     { label: "Banquet Menu", href: "/front-office/banquet/menus" },
    //     { label: "Banquet Packages", href: "/front-office/banquet/packages" },
    //   ],
    // },
    {
      label: "Room Management",
      href: "/front-office/rooms",
      isExpandable: true,
      isExpand: false,
      icon: Bed,
      Children: [
        { label: "Hotel Rooms", href: "/front-office/rooms/hotel-rooms" },
        { label: "Hotel Rooms Types", href: "/front-office/rooms/room-types" },
        // { label: "Function Rooms", href: "/front-office/rooms/function-rooms" },
        {
          label: "Room Reports",
          href: "/front-office/rooms/reportings",
        },
      ],
    },
    {
      label: "Bookings",
      href: "/front-office/bookings",
      isExpandable: true,
      icon: Notebook,
      Children: [
        { label: "Overview", href: "/front-office/bookings/overview" },
        { label: "Calendar", href: "/front-office/bookings/calendar" },
        {
          label: "Room Bookings",
          href: "/front-office/bookings/room-bookings",
        },
        {
          label: "Function Room Reservation",
          href: "/front-office/bookings/function-hall-bookings",
        },
      ],
    },
    {
      label: "Guest Feedbacks",
      href: "/front-office/feedback",
      isExpandable: false,
      icon: MessageSquare,
    },
    // {
    //   label: "Guest",
    //   href: "/front-office/guest",
    //   isExpandable: false,
    //   icon: Users,
    // },
    {
      label: "Account Management",
      href: "/front-office/accounts",
      isExpandable: false,
      icon: ShieldUser,
    },
    {
      label: "Settings",
      href: "/front-office/settings",
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
