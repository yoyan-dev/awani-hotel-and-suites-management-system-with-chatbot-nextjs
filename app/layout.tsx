import "@/styles/globals.css";
import "@/styles/guest-theme.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { fontGuestSans, fontSans, fontSerif } from "@/config/fonts";
import { defaultSeoDescription, localHotelKeywords, siteUrl } from "@/config/seo";

import { ToastProvider } from "@heroui/toast";

import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ma. Awani Hotel and Suites | San Carlos City Hotel",
    template: `%s - ${siteConfig.name}`,
  },
  description: defaultSeoDescription,
  keywords: localHotelKeywords,
  applicationName: siteConfig.name,
  authors: [{ name: "Ma. Awani Hotel and Suites" }],
  creator: "Ma. Awani Hotel and Suites",
  publisher: "Ma. Awani Hotel and Suites",
  alternates: {
    canonical: "/guest",
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "/guest",
    siteName: siteConfig.name,
    title: "Ma. Awani Hotel and Suites | San Carlos City Hotel",
    description: defaultSeoDescription,
    images: [
      {
        url: "/bg-awani.jpg",
        width: 1200,
        height: 630,
        alt: "Ma. Awani Hotel and Suites in San Carlos City, Negros Occidental",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ma. Awani Hotel and Suites | San Carlos City Hotel",
    description: defaultSeoDescription,
    images: ["/bg-awani.jpg"],
  },
  icons: {
    icon: "/awani-logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased w-full",
          fontSans.variable,
          fontGuestSans.variable,
          fontSerif.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <ToastProvider />
          {children}
        </Providers>
      </body>
    </html>
  );
}
