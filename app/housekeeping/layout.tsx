"use client";

import Sidebar from "./_components/sidebar";
import Navbar from "./_components/navbar";
import FooterNav from "./_components/footer";
export default function HousekeepingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
      <div className="flex">
        <Sidebar />

        <div className="w-full min-h-screen max-h-screen overflow-y-auto space-y-4 transition-all duration-300 ease-in-out">
          <Navbar />

          <main className="w-full space-y-4 pb-sm">{children}</main>
        </div>
      </div>
      <FooterNav />
    </div>
  );
}
