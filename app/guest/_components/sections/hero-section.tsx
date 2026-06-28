"use client";

import { Button, Image, Link } from "@heroui/react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useMemo } from "react";

import { peakSeason } from "@/lib/peak-season-dates";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

export default function HeroBanner() {
  const isPeakSeason = useMemo(() => peakSeason(), []);

  return (
    <section
      id="home"
      className="relative mt-4 scroll-mt-28 overflow-hidden rounded-4xl border border-[#dfd3c1] bg-[#181512] shadow-[0_30px_90px_-55px_rgba(15,10,6,0.9)]"
    >
      <div className="absolute inset-0 bg-[url('/bg-awani.jpg')] bg-cover bg-center opacity-70" />
      <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/55 to-black/35" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/45 to-transparent" />

      <div className="relative z-10 grid gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-14 lg:py-20">
        <div className="max-w-2xl space-y-7">
          <motion.div {...fadeInUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#d2b789]/55 bg-[#b08a53]/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#f2ddbe]">
              <Sparkles size={14} />
              Signature Luxury Stays
            </span>
          </motion.div>

          <motion.div
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.08 }}
          >
            <h1 className="font-serif text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              Your Hospitality Partner With Heart & Positivity
            </h1>
          </motion.div>

          <motion.p
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.16 }}
            className="max-w-xl text-base leading-relaxed text-[#ede3d3] sm:text-lg"
          >
            Discover elevated comfort, refined spaces, and personalized service.
            Book your next premium stay with confidence at Ma. Awani Hotel and Suites.
          </motion.p>

          <motion.div
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.24 }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Button
              as={Link}
              href="/guest/reservations/hotel-rooms"
              className="h-12 bg-[#b08a53] px-8 text-base font-semibold text-white transition-all hover:-translate-y-px hover:bg-[#9a7747]"
              radius="full"
              endContent={<ArrowRight size={18} />}
            >
              {isPeakSeason ? "Book Peak Season Stay" : "Book Now"}
            </Button>
            <Button
              as={Link}
              href="/guest/reservations/hotel-rooms"
              variant="bordered"
              radius="full"
              className="h-12 border-[#dcc5a0] bg-[#fffaf0]/5 px-8 text-base font-semibold text-[#f2ddbe] hover:bg-[#fffaf0]/15"
            >
              Explore Rooms
            </Button>
          </motion.div>
        </div>
        <div>
          <div className="p-4 flex flex-col items-center justify-center">
            <Image src="/feedback-form.png" alt="feedback form" width={200} />
            <span className="text-lg text-[#d9c5a2] text-center">
              Feedback Form
            </span>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 26 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="grid gap-4 self-end sm:grid-cols-2"
          >
            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.2em] text-[#d9c5a2]">
                Guest Rating
              </p>
              <p className="mt-2 font-serif text-4xl text-white">4.9/5</p>
              <p className="text-sm text-[#f1e7d9]">
                Trusted by returning guests
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.2em] text-[#d9c5a2]">
                Premium Rooms
              </p>
              <p className="mt-2 font-serif text-4xl text-white">20+</p>
              <p className="text-sm text-[#f1e7d9]">Elegantly curated suites</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
