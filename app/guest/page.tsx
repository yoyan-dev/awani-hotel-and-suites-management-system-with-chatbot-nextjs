"use client";

import React from "react";
import { motion } from "framer-motion";

import Footer from "./_components/footer";
import About from "./_components/sections/about-section";
import AmenitiesSection from "./_components/sections/amenities-section";
import GallerySection from "./_components/sections/gallery-section";
import HeroBanner from "./_components/sections/hero-section";
import LocationPreviewSection from "./_components/sections/location-preview-section";
import { RoomsCarousel } from "./_components/sections/room-carousel";
import TestimonialsSection from "./_components/sections/testimonials/testimonial-section";
import { useRoomTypes } from "@/hooks/use-room-types";

export default function GuestHomePage() {
  const { room_types, isLoading, fetchRoomTypes } = useRoomTypes();

  React.useEffect(() => {
    fetchRoomTypes({});
  }, []);

  return (
    <div className="min-h-screen">
      <HeroBanner />
      <About />
      <AmenitiesSection />
      <RoomsCarousel rooms={room_types} isLoading={isLoading} />
      <TestimonialsSection />
      <GallerySection />
      <LocationPreviewSection />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <Footer />
      </motion.div>
    </div>
  );
}
