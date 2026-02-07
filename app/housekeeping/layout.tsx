"use client";

import Sidebar from "./_components/sidebar";
import Navbar from "./_components/navbar";
import FooterNav from "./_components/footer";
import { getCurrentUser } from "@/lib/auth";
import { User } from "@/types/users";
import React from "react";
export default function HousekeepingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = React.useState<User>();
  const [isLoading, setIsLoading] = React.useState(false);

  async function fetchCurrentUser() {
    try {
      setIsLoading(true);
      const { user, error } = await getCurrentUser();
      setUser(user as User);

      console.log(user);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    fetchCurrentUser();
  }, []);
  return (
    <div className="h-screen overflow-hidden bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 fixed">
      <div className="flex">
        <Sidebar />

        <div className="w-full min-h-screen max-h-screen overflow-y-auto space-y-4 transition-all duration-300 ease-in-out pb-8">
          <Navbar user={user} isLoading={isLoading} />

          <main className="w-full space-y-4 pb-sm">{children}</main>
        </div>
      </div>
      <FooterNav />
    </div>
  );
}
