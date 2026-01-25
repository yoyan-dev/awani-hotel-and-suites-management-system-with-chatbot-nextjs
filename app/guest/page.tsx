"use client";

import About from "./_components/sections/about-section";
import { RoomsCarousel } from "./_components/sections/room-carousel";
import HeroBanner from "./_components/sections/hero-section";
import Stats from "./_components/sections/stat-section";
import React from "react";
import HotelPoolSection from "./_components/sections/pool-section";
import { User } from "@/types/users";
import { useRoomTypes } from "@/hooks/use-room-types";
import PeakSeasonDate from "./_components/sections/peak-season.date";
import BanquetSection from "./_components/sections/banquet-section";
import { motion } from "framer-motion";
import Footer from "./_components/footer";
import ContactSection from "./_components/sections/contact/page";
import TestimonialsSection from "./_components/sections/testimonials/testimonial-section";
import BestSellerMenusSection from "./_components/sections/best-seller-menus-section";

export default function page() {
  const { room_types, isLoading, fetchRoomTypes } = useRoomTypes();

  React.useEffect(() => {
    fetchRoomTypes({});
  }, []);

  return (
    <div>
      <HeroBanner />
      <About />
      <Stats />
      <RoomsCarousel rooms={room_types} isLoading={isLoading} />
      <BestSellerMenusSection />
      <BanquetSection />
      {/* <PeakSeasonDate rooms={room_types} isLoading={isLoading} /> */}
      <HotelPoolSection />
      {/* <RoomsAndSuites rooms={room_types} isLoading={isLoading} /> */}
      <div className="bg-white dark:bg-gray-900 ">
        <TestimonialsSection />
        <ContactSection />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Footer />
      </motion.div>
    </div>
  );
}
