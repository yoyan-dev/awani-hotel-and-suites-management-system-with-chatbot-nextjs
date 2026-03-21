"use client";

import { motion } from "framer-motion";
import Footer from "./_components/footer";
import About from "./_components/sections/about-section";
import AmenitiesSection from "./_components/sections/amenities-section";
import GallerySection from "./_components/sections/gallery-section";
import HeroBanner from "./_components/sections/hero-section";
import LocationPreviewSection from "./_components/sections/location-preview-section";
import RestaurantFeaturedSection from "./_components/sections/restaurant-featured-section";
import { RoomsCarousel } from "./_components/sections/room-carousel";
import TestimonialsSection from "./_components/sections/testimonials/testimonial-section";
import { useGuestHomePage } from "@/hooks/guest/use-guest-home-page";

export default function GuestHomePage() {
  const { roomTypes, isLoading } = useGuestHomePage();

  return (
    <div className="min-h-screen">
      <HeroBanner />
      <About />
      <AmenitiesSection />
      <RestaurantFeaturedSection />
      <RoomsCarousel rooms={roomTypes} isLoading={isLoading} />
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
