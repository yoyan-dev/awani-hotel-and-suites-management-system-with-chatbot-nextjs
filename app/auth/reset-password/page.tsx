"use client";

import React from "react";
import { Button, Form, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import { LockIcon } from "lucide-react";
import { supabase } from "@/lib/supabase/supabase-client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{
    error: boolean;
    message: string;
  } | null>(null);

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 6) {
      setMessage({
        error: true,
        message: "Password must be at least 6 characters.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ error: true, message: "Passwords do not match." });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setMessage({ error: true, message: error.message });
        return;
      }

      setMessage({
        error: false,
        message: "Password updated successfully. Redirecting to login...",
      });
      setTimeout(() => router.replace("/auth"), 1200);
    } catch {
      setMessage({ error: true, message: "Unable to update password." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-4 p-4 bg-primary">
      <div className="p-8 max-w-md w-full bg-white dark:bg-gray-800 rounded shadow space-y-4">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-lg font-semibold">Reset your password</h1>
          <span className="text-gray-500">
            Enter a new password for your account.
          </span>
        </div>
        <Form
          onSubmit={handleResetPassword}
          className="mt-4 flex flex-col gap-4"
        >
          {message && (
            <p className={message.error ? "text-warning" : "text-success"}>
              {message.message}
            </p>
          )}

          <Input
            radius="sm"
            isRequired
            color="primary"
            endContent={
              <LockIcon className="text-2xl text-default-600 dark:text-default-300 pointer-events-none shrink-0" />
            }
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            label="New Password"
            labelPlacement="outside"
            placeholder="Enter your new password"
            type="password"
            variant="bordered"
          />

          <Input
            radius="sm"
            isRequired
            color="primary"
            endContent={
              <LockIcon className="text-2xl text-default-600 dark:text-default-300 pointer-events-none shrink-0" />
            }
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            label="Confirm Password"
            labelPlacement="outside"
            placeholder="Confirm your new password"
            type="password"
            variant="bordered"
          />

          <Button
            type="submit"
            color="primary"
            radius="sm"
            fullWidth
            isLoading={isLoading}
          >
            Update Password
          </Button>
        </Form>
      </div>
    </div>
  );
}
