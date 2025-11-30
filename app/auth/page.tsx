"use client";
import React from "react";
import { Input, Button, Checkbox, Link, Form, Image } from "@heroui/react";
import { MailIcon, LockIcon } from "lucide-react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function Auth() {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<{
    error: boolean;
    message: string;
  } | null>(null);

  const router = useRouter();
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage({ error: true, message: error.message });
        return;
      } else {
        setMessage({ error: false, message: "Logged in successfully!" });
        console.log(data);
      }

      const roles = data?.user?.app_metadata?.roles || [];
      if (roles.includes("admin")) router.push("/admin");
      else if (roles?.includes("front-office")) router?.push("/front-office");
      else if (roles?.includes("housekeeping")) router?.push("/housekeeping");
      else router.push("/guest");
      setIsLoading(false);
    } catch (e) {
      setMessage({ error: true, message: "Unknow Error!" });
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
        <Form onSubmit={handleLogin} className="mt-4 flex flex-col gap-4">
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
          <div className="flex">
            <Link color="primary" href="#" size="sm">
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            color="primary"
            radius="sm"
            fullWidth
            isLoading={isLoading}
          >
            Login
          </Button>
          <div className="flex gap-2">
            Don't have an account yet?
            <Link color="primary" href="/auth/signup" size="sm">
              Sign up
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
