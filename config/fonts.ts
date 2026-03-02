import {
  Fira_Code as FontMono,
  Inter as FontSans,
  Manrope as FontGuestSans,
  Playfair_Display as FontSerif,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontGuestSans = FontGuestSans({
  subsets: ["latin"],
  variable: "--font-guest-sans",
});

export const fontSerif = FontSerif({
  subsets: ["latin"],
  variable: "--font-serif",
});
