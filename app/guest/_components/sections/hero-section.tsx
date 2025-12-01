"use client";

import { User } from "@/types/users";
import { Button, Link } from "@heroui/react";
import LoginPromptModal from "../modals/login-prompt-modal";
import { peakSeason } from "@/lib/peak-season-dates";
import { useMemo } from "react";

interface Props {
  user: User | null;
  isLoading: boolean;
}

export const HeroBanner: React.FC<Props> = ({ user, isLoading }) => {
  const isPeakSeason = useMemo(() => peakSeason(), []);

  return (
    <section
      className={`relative h-[500px] flex flex-col items-center justify-center text-center transition-all duration-500 
        bg-cover bg-center overflow-hidden
        
      `}
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      {/* Gradient Overlay */}
      <div
        className={`absolute inset-0 transition-all duration-500 backdrop-blur-[2px]
          ${
            isPeakSeason
              ? "bg-gradient-to-b from-red-600/70 via-red-900/60 to-black/70 dark:from-red-900/60 dark:via-red-950/60 dark:to-black/80"
              : "bg-black/50 dark:bg-black/60"
          }
        `}
      />

      {/* Content */}
      <div className="relative z-10 px-6">
        <h1
          className={`text-4xl font-extrabold drop-shadow-xl transition-all 
            ${
              isPeakSeason
                ? "text-yellow-300 dark:text-yellow-200"
                : "text-white dark:text-gray-100"
            }
          `}
        >
          {isPeakSeason
            ? "✨ Peak Season Celebration ✨"
            : "Welcome to Our Luxurious Hotel & Suites"}
        </h1>

        <p
          className={`mt-3 text-lg transition-all 
            ${
              isPeakSeason
                ? "text-yellow-200/90 dark:text-yellow-300/80"
                : "text-gray-200 dark:text-gray-300"
            }
          `}
        >
          {isPeakSeason
            ? "Experience holiday magic, premium comfort, and festive exclusives!"
            : "Modern Luxury and Timeless Elegance"}
        </p>

        {/* Button */}
        {user?.id && !isLoading ? (
          <Button
            className={`mt-6 font-semibold px-6 py-2 rounded-xl transition-all
              ${
                isPeakSeason
                  ? "bg-yellow-300 text-red-900 shadow-lg hover:bg-yellow-200 hover:scale-105 dark:bg-yellow-400 dark:hover:bg-yellow-300"
                  : "bg-primary text-white hover:scale-105"
              }
            `}
            as={Link}
            href="/guest/rooms/reservation/null"
          >
            {isPeakSeason ? "Book Peak Season Stay ✨" : "Book Apartments"}
          </Button>
        ) : (
          <div className="mt-6">
            <LoginPromptModal
              name={
                isPeakSeason ? "Book Peak Season Stay ✨" : "Book Apartments"
              }
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;
