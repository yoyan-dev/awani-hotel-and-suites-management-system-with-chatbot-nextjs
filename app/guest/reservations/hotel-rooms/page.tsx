import type { Metadata } from "next";
import { HotelRoomsPage } from "./_components/hotel-rooms-page";
import { localHotelKeywords } from "@/config/seo";

export const metadata: Metadata = {
  title: "Hotel Rooms in San Carlos City",
  description:
    "Book hotel rooms at Ma. Awani Hotel and Suites in San Carlos City, Negros Occidental. Check room availability for your stay.",
  keywords: [
    ...localHotelKeywords,
    "hotel rooms San Carlos City",
    "book hotel San Carlos City",
    "San Carlos City hotel rooms",
  ],
  alternates: {
    canonical: "/guest/reservations/hotel-rooms",
  },
};

export default function Page() {
  return <HotelRoomsPage />;
}
