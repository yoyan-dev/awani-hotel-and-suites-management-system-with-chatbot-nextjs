"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";

const galleryImages = [
  // "/pool.png",
  // "/banquet/image-7.jpg",
  // "/banquet/image-5.jpg",
  // "/banquet/image-9.png",
  "/banquet/image-10.png",
  "/banquet/image-11.png",
  "/banquet/image-12.png",
  "/banquet/image-13.png",
  "/banquet/image-14.png",
  "/banquet/image-15.png",
];

export default function GallerySection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeImage =
    activeIndex === null ? null : galleryImages[activeIndex] ?? null;

  function closeLightbox() {
    setActiveIndex(null);
  }

  function showPrevious() {
    setActiveIndex((current) =>
      current === null
        ? current
        : (current - 1 + galleryImages.length) % galleryImages.length,
    );
  }

  function showNext() {
    setActiveIndex((current) =>
      current === null ? current : (current + 1) % galleryImages.length,
    );
  }

  useEffect(() => {
    if (activeIndex === null) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex]);

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
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="block h-full w-full cursor-zoom-in text-left"
              aria-label={`Open gallery image ${index + 1}`}
            >
              <img
                src={src}
                alt={`Ma. Awani Hotel and Suites gallery ${index + 1}`}
                className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-[1.05] sm:h-64"
              />
            </button>
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-60" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeImage ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 py-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Gallery image preview"
            onClick={closeLightbox}
          >
            <motion.div
              className="relative max-h-full w-full max-w-6xl"
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.26, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeLightbox}
                className="absolute right-0 top-0 z-10 flex size-11 -translate-y-14 items-center justify-center rounded-full bg-white text-[#201e1a] shadow-lg transition hover:bg-[#f2e8d8]"
                aria-label="Close gallery preview"
              >
                <X size={22} />
              </button>

              <button
                type="button"
                onClick={showPrevious}
                className="absolute left-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#201e1a] shadow-lg transition hover:bg-white"
                aria-label="Previous gallery image"
              >
                <ChevronLeft size={24} />
              </button>

              <img
                src={activeImage}
                alt={`Ma. Awani Hotel and Suites gallery preview ${(activeIndex ?? 0) + 1}`}
                className="max-h-[82vh] w-full rounded-2xl object-contain shadow-2xl"
              />

              <button
                type="button"
                onClick={showNext}
                className="absolute right-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#201e1a] shadow-lg transition hover:bg-white"
                aria-label="Next gallery image"
              >
                <ChevronRight size={24} />
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
