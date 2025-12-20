"use client";

import About from "./_components/sections/about-section";
import { RoomsCarousel } from "./_components/sections/room-carousel";
import HeroBanner from "./_components/sections/hero-section";
import Stats from "./_components/sections/stat-section";
import React from "react";
import HotelPoolSection from "./_components/sections/pool-section";
import Testimonials from "./_components/sections/review-section";
import { User } from "@/types/users";
import { supabase } from "@/lib/supabase/supabase-client";
import { useRoomTypes } from "@/hooks/use-room-types";
import PeakSeasonDate from "./_components/sections/peak-season.date";
import BanquetSection from "./_components/sections/banquet-section";
import { motion } from "framer-motion";
import Footer from "./_components/footer";

export default function page() {
  const { room_types, isLoading, fetchRoomTypes } = useRoomTypes();
  return (
    <div>
      <HeroBanner />
      <About />
      <Stats />
      <RoomsCarousel rooms={room_types} isLoading={isLoading} />
      <BanquetSection />
      {/* <PeakSeasonDate rooms={room_types} isLoading={isLoading} /> */}
      <HotelPoolSection />
      {/* <RoomsAndSuites rooms={room_types} isLoading={isLoading} /> */}
      <Testimonials />
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
