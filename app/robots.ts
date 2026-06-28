import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/guest", "/guest/reservations", "/guest/about-us", "/guest/contact-us"],
      disallow: ["/admin", "/front-office", "/housekeeping", "/api"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
