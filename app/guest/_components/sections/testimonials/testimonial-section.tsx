import { Carousel } from "@/components/ui/carousel";
import TestimonialCard from "./testimonial-card";

const TESTIMONIALS = [
  {
    name: "Maria Santos",
    role: "Guest",
    comment:
      "Awani Hotel and Suites provided an amazing experience! The staff were so friendly and helpful.",
  },
  {
    name: "John Cruz",
    role: "Event Planner",
    comment:
      "The banquet halls are perfect for corporate events. Highly recommended!",
  },
  {
    name: "Anna Lim",
    role: "Guest",
    comment:
      "I loved the comfort and cleanliness of the rooms. Will definitely come back.",
  },
  {
    name: "Carlos Reyes",
    role: "Guest",
    comment:
      "Exceptional service and attention to detail. Awani is truly a 5-star experience.",
  },
];

export default function TestimonialsSection() {
  return (
    <main className=" py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-primary">
            What Our Guests Say
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Hear from our satisfied guests at Awani Hotel and Suites
          </p>
        </header>

        <div>
          <Carousel
            autoScroll={true}
            itemsPerView={3}
            hasButton={false}
            autoScrollInterval={5000}
          >
            {TESTIMONIALS.map((t, idx) => (
              <TestimonialCard
                key={idx}
                name={t.name}
                role={t.role}
                comment={t.comment}
              />
            ))}
          </Carousel>
        </div>
      </div>
    </main>
  );
}
