"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, UsersRound } from "lucide-react";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Trusted Hospitality",
    description:
      "Reliable service standards and secure bookings for peace of mind.",
  },
  {
    icon: Sparkles,
    title: "Elegant Experience",
    description:
      "Refined rooms, premium finishes, and an atmosphere built for comfort.",
  },
  {
    icon: UsersRound,
    title: "Personalized Service",
    description:
      "Warm, attentive teams dedicated to high-value guest experiences.",
  },
];

export default function About() {
  return (
    <section className="py-16 sm:py-20">
      <div className="grid items-center gap-8 rounded-4xl border border-[#e4d9c8] bg-[#fffdf9] p-6 shadow-[0_25px_55px_-45px_rgba(38,32,24,0.5)] sm:p-10 lg:grid-cols-[1fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="space-y-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a17f4f]">
            About Awani
          </p>
          <h2 className="font-serif text-3xl leading-tight text-[#201e1a] sm:text-4xl">
            Timeless luxury, modern convenience, and heartfelt care.
          </h2>
          <p className="text-sm leading-relaxed text-[#655a4d] sm:text-base">
            Since 2019, Awani Hotel & Suites has welcomed guests with a blend of
            thoughtful design, warm hospitality, and efficient service. Every
            stay is curated to feel effortless, polished, and memorable.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-3">
          {pillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.09 }}
                className="rounded-2xl border border-[#eadfce] bg-[#fcf8f2] p-4"
              >
                <div className="mb-3 inline-flex rounded-full bg-[#efe4d2] p-2 text-[#9b7544]">
                  <Icon size={18} />
                </div>
                <h3 className="font-serif text-lg text-[#2b2722]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-[#6a5f52]">
                  {item.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
