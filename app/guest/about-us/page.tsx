import { Users, Leaf, Home } from "lucide-react";
import PageHeader from "./components/page-header";
import AboutSection from "./components/about/about-section";

const ABOUT_ITEMS = [
  {
    title: "Our Mission",
    description:
      "At Awani Hotel and Suites, we strive to provide our guests with unparalleled hospitality, comfort, and memorable experiences during their stay.",
    icon: <Home size={24} className="text-primary-300" />,
  },
  {
    title: "Our Vision",
    description:
      "To become the preferred hotel destination in the region, known for exceptional service, elegant accommodations, and world-class amenities.",
    icon: <Leaf size={24} className="text-green-500" />,
  },
  {
    title: "Our Team",
    description:
      "Our dedicated team of professionals is committed to delivering excellence, ensuring each guest enjoys a warm and welcoming environment.",
    icon: <Users size={24} className="text-primary-300" />,
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <PageHeader
          title="About Awani Hotel and Suites"
          subtitle="Learn more about our story, mission, and dedicated team"
        />

        <AboutSection items={ABOUT_ITEMS} />
      </div>
    </main>
  );
}
