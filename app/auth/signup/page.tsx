"use client";
import React from "react";
import { addToast } from "@heroui/react";
import { supabase } from "@/lib/supabase/supabase-client";
import { handleFileChange } from "@/app/utils/image-file-handler";
import { useRouter } from "next/navigation";
import { useGuests } from "@/hooks/use-guests";
import SignupForm from "./_components/signup-form";

export default function Auth() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(null);

  const { error, addGuest } = useGuests();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);

      const fullName = formData.get("full_name");
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });

      if (signUpError) {
        addToast({
          title: "Error",
          description: signUpError.message,
          color: "danger",
        });
        return;
      }

      if (data.user) {
        formData.append("id", data.user.id);
        console.log(formData);
        await addGuest(formData);
        if (error) {
          console.log(error);
          return;
        }
        router.push("/auth");
      }
    } catch (err: any) {
      addToast({
        title: "Error",
        description: err.message || "Unknown Error. Please Try Again.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 bg-primary dark:bg-primary-700">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow p-6 sm:p-8 space-y-5">
        <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-100">
          Create your Account
        </h2>
        <SignupForm
          email={email}
          password={password}
          showPassword={showPassword}
          preview={preview}
          isLoading={isLoading}
          onSubmit={handleSignUp}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onTogglePassword={() => setShowPassword((prev) => !prev)}
          onImageChange={(e) => setPreview(handleFileChange(e))}
        />
      </div>
    </div>
  );
}
