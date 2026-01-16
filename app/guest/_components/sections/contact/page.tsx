import { MapPin, Phone, Mail } from "lucide-react";
import PageHeader from "./components/page-header";
import InputField from "./components/ui/input-field";
import ContactInfoCard from "./components/contact/contact-info-card";
import TextAreaField from "./components/ui/text-area-field";
import { Button } from "@heroui/button";

export default function ContactSection() {
  return (
    <main className="min-h-screen py-10 px-4" id="contact">
      <div className="max-w-5xl mx-auto">
        <PageHeader
          title="Contact Us"
          subtitle="Reach out to Awani Hotel and Suites for inquiries or bookings"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form className="flex flex-col gap-4 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-900 p-6 rounded-md shadow-sm">
            <InputField label="Name" placeholder="Your full name" required />
            <InputField
              label="Email"
              placeholder="you@example.com"
              type="email"
              required
            />
            <InputField
              label="Subject"
              placeholder="Subject of your message"
              required
            />
            <TextAreaField
              label="Message"
              placeholder="Write your message here"
              required
            />

            <Button
              type="submit"
              color="primary"
              radius="md"
              className=" px-4 py-2  text-sm font-medium"
            >
              Send Message
            </Button>
          </form>

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            <ContactInfoCard
              title="Address"
              details="Corner-East Euzkara Avenue , San Carlos City, Philippines, 6127"
              icon={<MapPin size={20} />}
            />
            <ContactInfoCard
              title="Phone"
              details="+63 917 302 4794"
              icon={<Phone size={20} />}
            />
            <ContactInfoCard
              title="Email"
              details="awanihotel2019@yahoo.com"
              icon={<Mail size={20} />}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
