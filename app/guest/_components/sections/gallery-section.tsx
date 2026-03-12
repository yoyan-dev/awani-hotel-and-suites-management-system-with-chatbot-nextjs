"use client";

import { motion } from "framer-motion";

const galleryImages = [
  // "/pool.png",
  "/banquet/image-7.jpg",
  "/banquet/image-8.jpg",
  "/banquet/image-9.png",
  "/banquet/image-10.png",
  "/banquet/image-11.png",
  "/banquet/image-12.png",
  "/banquet/image-13.png",
  "/banquet/image-14.png",
  "/banquet/image-15.png",
];

export default function GallerySection() {
  return (
    <section id="gallery" className="scroll-mt-28 py-16 sm:py-20">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a7647]">
          Gallery
        </p>
        <h2 className="mt-3 font-serif text-3xl text-[#201e1a] sm:text-4xl">
          A glimpse of your next signature stay
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {galleryImages.map((src, index) => (
          <motion.div
            key={`${src}-${index}`}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group relative overflow-hidden rounded-3xl border border-[#e4d8c8] bg-[#f4eee4]"
          >
            <img
              src={src}
              alt={`Awani gallery ${index + 1}`}
              className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-[1.05] sm:h-64"
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-60" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
