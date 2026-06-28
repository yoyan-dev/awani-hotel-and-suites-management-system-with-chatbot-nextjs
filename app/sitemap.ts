import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/seo";

const publicRoutes = [
  "/guest",
  "/guest/reservations/hotel-rooms",
  "/guest/reservations/function-room",
  "/guest/about-us",
  "/guest/contact-us",
  "/guest/privacy-policy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/guest" ? "weekly" : "monthly",
    priority: route === "/guest" ? 1 : 0.8,
  }));
}
