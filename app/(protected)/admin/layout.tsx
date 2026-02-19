"use client";
import Sidebar from "./_components/sidebar";
import AdminNavbar from "./_components/navbar";
import React from "react";
import { useRouteGuard } from "@/lib/auth/use-route-guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { user, loading } = useRouteGuard("admin");

  // if (loading || !user) return "loading...";
  return (
    <div className="flex fixed h-screen  bg-slate-50 dark:bg-gray-800 w-full">
      <Sidebar />
      <main className="w-full min-h-screen max-h-screen overflow-y-auto space-y-4">
        {/* <AdminNavbar user={user} isLoading={false} /> */}
        <div className=" rounded ml-4">{children}</div>
      </main>
    </div>
  );
}
