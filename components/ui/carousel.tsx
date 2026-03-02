"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps extends React.PropsWithChildren {
  options?: EmblaOptionsType;
  className?: string;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  itemsPerView?: number;
  responsive?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  dotType?: "button" | "image" | "none"; // ✅ new
  images?: string[]; // ✅ for thumbnails
  hasButton?: boolean;
}

export function Carousel({
  children,
  options = { loop: true },
  className = "",
  autoScroll = false,
  autoScrollInterval = 3000,
  itemsPerView = 1,
  responsive,
  dotType = "button",
  images = [],
  hasButton = true,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [slides, setSlides] = React.useState<number>(
    React.Children.count(children),
  );
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Track selected index
  React.useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      const idx = emblaApi.selectedScrollSnap();
      setSelectedIndex(typeof idx === "number" ? idx : 0);
    };

    setSlides(emblaApi.scrollSnapList().length);
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi?.off("select", onSelect);
      emblaApi?.off("reInit", onSelect);
    };
  }, [emblaApi, children]);

  // Auto scroll
  React.useEffect(() => {
    if (!emblaApi || !autoScroll) return;

    intervalRef.current = setInterval(() => {
      if (!emblaApi) return;
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0); // loop back
      }
    }, autoScrollInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [emblaApi, autoScroll, autoScrollInterval]);

  const scrollPrev = React.useCallback(
    () => emblaApi?.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = React.useCallback(
    () => emblaApi?.scrollNext(),
    [emblaApi],
  );
  const scrollTo = React.useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  );

  // Width styles
  const baseWidth = `${100 / itemsPerView}%`;
  const responsiveStyles = {
    "--carousel-sm": responsive?.sm ? `${100 / responsive.sm}%` : baseWidth,
    "--carousel-md": responsive?.md ? `${100 / responsive.md}%` : baseWidth,
    "--carousel-lg": responsive?.lg ? `${100 / responsive.lg}%` : baseWidth,
    "--carousel-xl": responsive?.xl ? `${100 / responsive.xl}%` : baseWidth,
  } as React.CSSProperties;

  return (
    <div className={`relative w-full max-w-6xl mx-auto ${className}`}>
      {/* viewport */}
      <div ref={emblaRef} className="overflow-hidden rounded-2xl">
        <div className="flex" style={responsiveStyles}>
          {React.Children.map(children, (child) => (
            <div
              className="
                shrink-0
                w-full
                sm:w-(--carousel-sm)
                md:w-(--carousel-md)
                lg:w-(--carousel-lg)
                l:w-(--carousel-xl)
              "
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      {hasButton ? (
        <>
          <button
            onClick={scrollPrev}
            aria-label="Previous"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-zinc-800/70 backdrop-blur-sm p-2 rounded-full shadow-sm hover:scale-105 transition"
          >
            <ChevronLeft className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-zinc-800/70 backdrop-blur-sm p-2 rounded-full shadow-sm hover:scale-105 transition"
          >
            <ChevronRight className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
          </button>
        </>
      ) : null}

      {/* Dots or Images */}
      <div className="flex items-center justify-center gap-2 mt-3">
        {Array.from({ length: slides }).map((_, i) => {
          if (dotType === "image" && images[i]) {
            return (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-12 w-16 overflow-hidden rounded-md border-2 ${
                  i === selectedIndex
                    ? "border-zinc-900 dark:border-zinc-100"
                    : "border-transparent"
                }`}
              >
                <img
                  src={images[i]}
                  alt={`Slide ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            );
          } else if (dotType === "none") {
            return null;
          }

          return (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-transform ${
                i === selectedIndex
                  ? "scale-125 bg-zinc-900 dark:bg-zinc-100"
                  : "bg-zinc-300 dark:bg-zinc-600"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

export function CarouselItem({ children }: React.PropsWithChildren) {
  return <div className="p-2">{children}</div>;
}

//usage
//<Carousel
//     autoScroll
//     autoScrollInterval={2500}
//     itemsPerView={1}
//     responsive={{ sm: 1, md: 2, lg: 3, xl: 4 }}
//     dotType="image"
//   >
//     {items.map((num) => (
//       <CarouselItem key={num}>
//         <div className="h-40 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 rounded-xl">
//           Slide {num}
//         </div>
//       </CarouselItem>
//     ))}
//   </Carousel>
