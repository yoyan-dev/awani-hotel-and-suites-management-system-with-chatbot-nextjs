"use server";
import { Providers } from "../../providers";
import Sidebar from "./_components/sidebar";
import AdminNavbar from "./_components/navbar";
import { getCurrentUser } from "@/lib/auth";
import React from "react";
import { User } from "@/types/users";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, error } = await getCurrentUser();

  return (
    <div className="flex fixed h-screen  bg-slate-50 dark:bg-gray-800 w-full">
      <Sidebar />
      <main className="w-full min-h-screen max-h-screen overflow-y-auto space-y-4">
        <AdminNavbar user={user as User} isLoading={false} />
        <div className=" rounded ml-4">{children}</div>
      </main>
    </div>
  );
}
