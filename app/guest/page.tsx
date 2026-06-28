import type { Metadata } from "next";
import { GuestHomePage } from "./_components/guest-home-page";
import {
  defaultSeoDescription,
  localHotelKeywords,
  siteUrl,
} from "@/config/seo";

export const metadata: Metadata = {
  title: "San Carlos City Hotel in Negros Occidental",
  description: defaultSeoDescription,
  keywords: localHotelKeywords,
  alternates: {
    canonical: "/guest",
  },
  openGraph: {
    title: "Ma. Awani Hotel and Suites | San Carlos City Hotel",
    description: defaultSeoDescription,
    url: "/guest",
    images: [
      {
        url: "/bg-awani.jpg",
        width: 1200,
        height: 630,
        alt: "Ma. Awani Hotel and Suites in San Carlos City, Negros Occidental",
      },
    ],
  },
};

export default function Page() {
  const hotelSchema = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: "Ma. Awani Hotel and Suites",
    description: defaultSeoDescription,
    url: `${siteUrl}/guest`,
    image: `${siteUrl}/bg-awani.jpg`,
    telephone: "+63 917 302 4794",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Corner-East Euzkara Avenue",
      addressLocality: "San Carlos City",
      addressRegion: "Negros Occidental",
      postalCode: "6127",
      addressCountry: "PH",
    },
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Hotel rooms",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Function room reservations",
        value: true,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelSchema) }}
      />
      <GuestHomePage />
    </>
  );
}
