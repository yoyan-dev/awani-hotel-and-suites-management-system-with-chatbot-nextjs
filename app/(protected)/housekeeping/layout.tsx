"use client";
import Sidebar from "./_components/sidebar";
import Navbar from "./_components/navbar";
import FooterNav from "./_components/footer";
import React from "react";
import { useSession } from "next-auth/react";
import { User } from "@/types/users";

export default function HousekeepingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const user = session?.user as User | undefined;
  if (!user || status === "loading") return "loading...";

  return (
    <div className="h-screen overflow-hidden bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 fixed w-full">
      <div className="flex">
        <Sidebar />

        <div className="w-full min-h-screen max-h-screen overflow-y-auto space-y-4 transition-all duration-300 ease-in-out pb-8">
          <Navbar user={user} isLoading={false} />

          <main className="w-full space-y-4 pb-sm p-4">{children}</main>
        </div>
      </div>
      <FooterNav />
    </div>
  );
}
