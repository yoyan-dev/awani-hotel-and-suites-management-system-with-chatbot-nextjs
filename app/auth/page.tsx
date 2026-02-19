"use client";

import React from "react";
import { Input, Button, Link, Form, Image } from "@heroui/react";
import { MailIcon, LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";

import { useAuthGuard } from "@/lib/auth/use-auth-guard";
import { handleResetPassword } from "@/lib/auth/handle-reset-password";

export default function Auth() {
  const router = useRouter();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isForgotMode, setIsForgotMode] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<{
    error: boolean;
    message: string;
  } | null>(null);

  useAuthGuard();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setMessage({ error: true, message: result.error });
        return;
      }

      const session = await getSession();
      const roles = Array.isArray(session?.user?.roles)
        ? session.user.roles
        : [];

      if (roles.includes("admin")) router.push("/admin");
      else if (roles.includes("housekeeping")) router.push("/housekeeping");
      else router.push("/guest");

      setMessage({ error: false, message: "Logged in successfully!" });
    } catch {
      setMessage({ error: true, message: "Unknown Error!" });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const redirectTo = `${window.location.origin}/auth/reset-password`;
      const { error } = await handleResetPassword(email, redirectTo);

      if (error) {
        setMessage({ error: true, message: error });
        return;
      }

      setMessage({
        error: false,
        message: "Password reset email sent. Please check your inbox.",
      });
      setIsForgotMode(false);
    } catch {
      setMessage({ error: true, message: "Unable to send reset email." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-4 p-4 bg-primary">
      <div className="p-8 max-w-md w-full bg-white dark:bg-gray-800 rounded shadow space-y-4">
        <div className="flex flex-col items-center text-center">
          <Image src="/awani-logo.png" width={100} radius="full" />
          Welcome to Awani Hotel and Suite.
          <span className="text-gray-500"> Please login to continue.</span>
        </div>
        <Form
          onSubmit={isForgotMode ? handleForgotPassword : handleLogin}
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
              <MailIcon className="text-2xl text-default-600 dark:text-default-300 pointer-events-none shrink-0" />
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            labelPlacement="outside"
            placeholder="Enter your email"
            variant="bordered"
          />
          {!isForgotMode && (
            <Input
              radius="sm"
              isRequired
              color="primary"
              endContent={
                <LockIcon className="text-2xl text-default-600 dark:text-default-300 pointer-events-none shrink-0" />
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              labelPlacement="outside"
              placeholder="Enter your password"
              type="password"
              variant="bordered"
            />
          )}

          <div className="flex justify-between">
            {!isForgotMode ? (
              <Link
                color="primary"
                href="#"
                size="sm"
                onPress={() => {
                  setMessage(null);
                  setIsForgotMode(true);
                }}
              >
                Forgot password?
              </Link>
            ) : (
              <Link
                color="primary"
                href="#"
                size="sm"
                onPress={() => {
                  setMessage(null);
                  setIsForgotMode(false);
                }}
              >
                Back to login
              </Link>
            )}
          </div>

          <Button
            type="submit"
            color="primary"
            radius="sm"
            fullWidth
            isLoading={isLoading}
          >
            {isForgotMode ? "Send reset email" : "Login"}
          </Button>
        </Form>
      </div>
    </div>
  );
}
