"use client";
import { Providers } from "../providers";
import Sidebar from "./_components/sidebar";
import AdminNavbar from "./_components/navbar";
import { getCurrentUser } from "@/lib/auth";
import React from "react";
import { User } from "@/types/users";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = React.useState<{
    user: User;
    isLoading: boolean;
  }>({ user: {} as User, isLoading: false });

  async function fetchCurrentUser() {
    setState({ user: {} as User, isLoading: true });
    const { user, error } = await getCurrentUser();

    setState({ user: user as User, isLoading: false });
  }

  React.useEffect(() => {
    fetchCurrentUser();
  }, []);
  return (
    <div className="flex  h-screen  bg-slate-50 dark:bg-gray-800">
      <Sidebar />
      <main className="w-full min-h-screen max-h-screen overflow-y-auto space-y-4">
        <AdminNavbar state={state} />
        <div className=" rounded ml-4">{children}</div>
      </main>
    </div>
  );
}
