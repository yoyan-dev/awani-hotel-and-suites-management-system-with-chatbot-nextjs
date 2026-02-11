"use client";
import AccountCard from "./_components/account-card";
import React from "react";
import { User, UserFormData } from "@/types/users";
import { getCurrentUser } from "@/lib/auth";
import {
  DashboardLayout,
  LoadingState,
} from "@/components/dashboard/dashboard-layout";
import { useUsers } from "@/hooks/use-users";
import { addToast } from "@heroui/react";
import { redirect } from "next/navigation";

export default function AccountSettingsPage() {
  const { isLoading: updateUserLoading, updateUserProfile } = useUsers();
  const [user, setUser] = React.useState<User>();
  const [formData, setFormData] = React.useState<UserFormData>(
    {} as UserFormData,
  );
  const [isLoading, setIsLoading] = React.useState(false);

  async function fetchCurrentUser() {
    try {
      setIsLoading(true);
      const { user, error: userError } = await getCurrentUser();
      setUser(user as any);
      setFormData({
        email: user?.email || "",
        full_name: user?.user_metadata?.full_name || "",
        current_password: "",
        new_password: "",
        confirm_password: "",
        user_metadata: user?.user_metadata || {},
      });
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

  async function onSubmit(e: any, payload: UserFormData) {
    e.preventDefault();
    await updateUserProfile({
      ...payload,
      user_metadata: { ...payload.user_metadata, full_name: payload.full_name },
    });
    await fetchCurrentUser();
    if (formData.new_password) {
      addToast({
        title: "Password updated successfully",
        description: "Please login with your new password",
        color: "success",
      });

      redirect("/auth");
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState message="Loading user data..." />
      </DashboardLayout>
    );
  }

  if (!user) return <div>Error: User not found</div>;

  return (
    <main className="min-h-screen bg-default-50 p-6">
      <h1 className="text-lg font-semibold mb-4">Account Settings</h1>
      <AccountCard
        user={user}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isLoading={updateUserLoading}
      />
    </main>
  );
}
