import { Users, Leaf, Home } from "lucide-react";
import PageHeader from "./components/page-header";
import AboutSection from "./components/about/about-section";
import Footer from "../_components/footer";

const ABOUT_ITEMS = [
  {
    title: "Our Mission",
    description:
      "At Awani Hotel and Suites, we strive to provide our guests with unparalleled hospitality, comfort, and memorable experiences during their stay.",
    icon: <Home size={24} className="text-[#9a7647]" />,
  },
  {
    title: "Our Vision",
    description:
      "To become the preferred hotel destination in the region, known for exceptional service, elegant accommodations, and world-class amenities.",
    icon: <Leaf size={24} className="text-[#9a7647]" />,
  },
  {
    title: "Our Team",
    description:
      "Our dedicated team of professionals is committed to delivering excellence, ensuring each guest enjoys a warm and welcoming environment.",
    icon: <Users size={24} className="text-[#9a7647]" />,
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen py-10 sm:py-14">
      <div className="mx-auto max-w-[1200px] rounded-4xl border border-[#e2d6c6] bg-[#fffdf8] px-5 py-10 shadow-[0_24px_55px_-42px_rgba(35,30,24,0.48)] sm:px-8">
        <PageHeader
          title="About Awani Hotel and Suites"
          subtitle="Learn more about our story, mission, and dedicated team"
        />

        <AboutSection items={ABOUT_ITEMS} />
      </div>
      <Footer />
    </main>
  );
}
