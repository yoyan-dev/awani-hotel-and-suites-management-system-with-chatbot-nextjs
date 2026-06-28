"use client";

import { motion } from "framer-motion";
import Footer from "./footer";
import About from "./sections/about-section";
import AmenitiesSection from "./sections/amenities-section";
import GallerySection from "./sections/gallery-section";
import HeroBanner from "./sections/hero-section";
import LocationPreviewSection from "./sections/location-preview-section";
import RestaurantFeaturedSection from "./sections/restaurant-featured-section";
import { RoomsCarousel } from "./sections/room-carousel";
import TestimonialsSection from "./sections/testimonials/testimonial-section";
import { useGuestHomePage } from "@/hooks/guest/use-guest-home-page";

export function GuestHomePage() {
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
