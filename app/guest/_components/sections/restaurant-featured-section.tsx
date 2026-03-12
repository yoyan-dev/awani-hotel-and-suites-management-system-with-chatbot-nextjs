"use client";

import { Button, Link } from "@heroui/react";
import { motion } from "framer-motion";
import { Clock3, MapPin, Star, UtensilsCrossed } from "lucide-react";

const featuredDishes = [
  {
    name: "Deatons Rack of Ribs",
    description: "Slow-cooked and tender pork back ribs, glazed with or signature smoky-sweet BBQ sauce.",
    image: "/best-seller/back-of-ribs.jpg",
  },
  {
    name: "Deatons Back Ribs",
    description: "Slow-cooked and tender pork back ribs, glazed with our signature smoky-sweet BBQ sauce.",
    image: "/best-seller/deaton-back-ribs.jpg",
  },
  {
    name: "Mabuhay Breakfast",
    description: "Hearty, classic Filipino breakfast plates Silog served with your choice if savory meat, garlic rice, and a fried egg. A taste of home to start your day.",
    image: "/best-seller/mabuhay-breakfast.jpg",
  },
  {
    name: "Negrense Kansi Soup",
    description: "A hearty and flavorful soup made from beef shanks and bone marrow, characterized by its unique sourness from Batwan fruit and a savory broth made with annatto seeds.",
    image: "/best-seller/negrense-kansi-soup.jpg",
  },
];

export default function RestaurantFeaturedSection() {
  return (
    <section id="ridgeview" className="scroll-mt-28 py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="grid gap-8 rounded-4xl border border-[#e2d5c4] bg-[#fffdf9] p-6 shadow-[0_24px_54px_-44px_rgba(36,30,22,0.5)] sm:p-10 lg:grid-cols-[0.95fr_1.05fr]"
      >
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a7647]">
            Featured Dining
          </p>
          <h2 className="font-serif text-3xl leading-tight text-[#231f1a] sm:text-4xl">
            Ridgeview Restaurant — Serving You with Heart.
          </h2>
          <p className="text-sm leading-relaxed text-[#665b4e] sm:text-base">
            Discover elevated dining with bold local flavors and refined
            presentation. Ridgeview offers a warm, intimate atmosphere for
            breakfast meetings, relaxed lunches, and memorable dinner evenings.
          </p>

          <div className="grid gap-3 text-sm text-[#564a3a] sm:grid-cols-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f0e3d1] px-4 py-2">
              <Clock3 size={15} />
              Open Daily | 11:00 AM - 10:00 PM
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f0e3d1] px-4 py-2">
              <MapPin size={15} />
              Lobby Level, Awani Hotel
            </div>
          </div>

          <div className="rounded-3xl border border-[#eadfcf] bg-[#fcf8f2] p-4 text-[#665b4e]">
            <div className="mb-2 inline-flex items-center gap-2 text-[#9a7647]">
              <Star size={16} className="fill-current" />
              <span className="text-sm font-semibold">Guest Favorite</span>
            </div>
            <p className="text-sm leading-relaxed">
              Signature dishes crafted with fresh ingredients, attentive table
              service, and a curated menu that balances comfort classics with
              chef-driven specials.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              as={Link}
              href="/guest/contact-us"
              radius="full"
              className="bg-[#b08a53] font-semibold text-white hover:bg-[#9d7948]"
              startContent={<UtensilsCrossed size={16} />}
            >
              Reserve a Table
            </Button>
            <Button
              as={Link}
              href="/guest/reservations/hotel-rooms"
              variant="bordered"
              radius="full"
              className="border-[#ceb48f] text-[#4f4436]"
            >
              Plan Your Stay
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {featuredDishes.map((dish, index) => (
            <motion.article
              key={dish.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.42, delay: index * 0.08 }}
              className="overflow-hidden rounded-3xl border border-[#e8dccb] bg-[#f8f2e9]"
            >
              <img
                src={dish.image}
                alt={`${dish.name} at Ridgeview Restaurant`}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-serif text-lg text-[#29241e]">
                  {dish.name}
                </h3>
                <p className="mt-1 text-sm text-[#6a5f52]">
                  {dish.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
