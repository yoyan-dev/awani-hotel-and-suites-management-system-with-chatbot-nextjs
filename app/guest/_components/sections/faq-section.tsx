"use client";
import { Accordion, AccordionItem } from "@heroui/react";

export default function FAQSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find answers to the most common questions about our hotel, rooms, and
          services.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <Accordion
          selectionMode="multiple"
          variant="shadow"
          className="rounded-2xl"
        >
          <AccordionItem
            key="1"
            aria-label="check_in & check_out"
            title="What are the check_in and check_out times?"
          >
            <p className="text-gray-600 leading-relaxed">
              check_in time starts at <strong>2:00 PM</strong> and check_out is
              until <strong>12:00 PM</strong>. Early check_in and late check_out
              may be arranged depending on availability.
            </p>
          </AccordionItem>

          <AccordionItem
            key="2"
            aria-label="Pool Access"
            title="Is the swimming pool accessible to all guests?"
          >
            <p className="text-gray-600 leading-relaxed">
              Yes, all registered guests have complimentary access to our
              infinity pool, open daily from <strong>6:00 AM – 10:00 PM</strong>
              .
            </p>
          </AccordionItem>

          <AccordionItem
            key="3"
            aria-label="Cancellations"
            title="What is your cancellation policy?"
          >
            <p className="text-gray-600 leading-relaxed">
              Reservations can be cancelled free of charge up to{" "}
              <strong>48 hours before arrival</strong>. Cancellations made later
              may incur a fee.
            </p>
          </AccordionItem>

          <AccordionItem
            key="4"
            aria-label="WiFi & Internet"
            title="Do you provide free WiFi?"
          >
            <p className="text-gray-600 leading-relaxed">
              Yes, complimentary high-speed WiFi is available throughout the
              hotel, including rooms, lobby, and poolside areas.
            </p>
          </AccordionItem>

          <AccordionItem
            key="5"
            aria-label="Parking"
            title="Is parking available?"
          >
            <p className="text-gray-600 leading-relaxed">
              We offer free secure parking for all in-house guests. Valet
              service is also available upon request.
            </p>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
