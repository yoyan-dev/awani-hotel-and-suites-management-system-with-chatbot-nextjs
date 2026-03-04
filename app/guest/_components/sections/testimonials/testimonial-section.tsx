"use client";

import { useEffect } from "react";

import { Carousel } from "@/components/ui/carousel";
import { useGuestFeedback } from "@/hooks/use-feedback";

import TestimonialCard from "./testimonial-card";

export default function TestimonialsSection() {
  const { guest_feedbacks, isLoading, fetchGuestFeedbacks } =
    useGuestFeedback();

  useEffect(() => {
    fetchGuestFeedbacks({});
  }, []);

  if (isLoading) {
    return (
      <section id="testimonials" className="scroll-mt-28 py-16 sm:py-20">
        <div className="rounded-4xl border border-[#e5d9c9] bg-[#fffdf8] p-8 text-center text-[#6a5e4f]">
          Loading guest testimonials...
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="scroll-mt-28 py-16 sm:py-20">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a7647]">
          Testimonials
        </p>
        <h2 className="mt-3 font-serif text-3xl text-[#201e1a] sm:text-4xl">
          What our guests say
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-[#665c4f] sm:text-base">
          Feedback from travelers and event guests who chose Awani Hotel &
          Suites.
        </p>
      </div>

      <Carousel
        autoScroll
        itemsPerView={1}
        responsive={{ sm: 1, md: 2, lg: 3 }}
        autoScrollInterval={4600}
        hasButton={false}
      >
        {guest_feedbacks.map((feedback) => (
          <TestimonialCard
            key={feedback.id}
            name={feedback.full_name}
            role="Guest"
            rating={feedback.rating}
            comment={feedback.comments || ""}
          />
        ))}
      </Carousel>
    </section>
  );
}
