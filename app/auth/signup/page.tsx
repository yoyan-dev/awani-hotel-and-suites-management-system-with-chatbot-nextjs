"use client";
import React from "react";
import {
  Input,
  Button,
  Link,
  Form,
  Image,
  Textarea,
  Select,
  SelectItem,
  addToast,
} from "@heroui/react";
import {
  MailIcon,
  LockIcon,
  Camera,
  User,
  Contact,
  Home,
  Flag,
  Transgender,
  Eye,
  EyeOff,
  CloudDownloadIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase-client";
import { handleFileChange } from "@/app/utils/image-file-handler";
import { uploadUserImage } from "@/lib/upload-user-image";
import { useRouter } from "next/navigation";
import { useGuests } from "@/hooks/use-guests";

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
      const image = formData.get("image");

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

        <Form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2">
            <label
              htmlFor="image-upload"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-dashed border-gray-300 flex justify-center items-center bg-gray-50 cursor-pointer hover:border-primary transition"
            >
              {preview ? (
                <Image
                  src={preview}
                  radius="full"
                  className="w-28 h-28 sm:w-32 sm:h-32 object-cover"
                />
              ) : (
                <Camera size={28} className="text-gray-400" />
              )}
            </label>
            <span className="text-xs text-gray-500">
              Click to upload profile picture
            </span>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              name="image"
              onChange={(e) => setPreview(handleFileChange(e))}
            />
          </div>

          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Personal Information
          </h3>
          <div className="flex flex-col gap-4 md:flex-row justify-between">
            <Input
              isRequired
              color="primary"
              startContent={
                <User className="text-default-600 dark:text-default-300 shrink-0" />
              }
              name="full_name"
              id="full_name"
              label="Full Name"
              labelPlacement="outside"
              placeholder="Enter your full name"
              variant="bordered"
              className="flex-1"
            />

            <Input
              isRequired
              color="primary"
              startContent={
                <Contact className="text-default-600 dark:text-default-300 shrink-0" />
              }
              name="contact_number"
              id="contact_number"
              label="Contact Number"
              labelPlacement="outside"
              placeholder="e.g. +63 912 345 6789"
              variant="bordered"
              className="flex-1"
            />
          </div>
          <Textarea
            isRequired
            color="primary"
            startContent={
              <Home className="text-default-600 dark:text-default-300 shrink-0" />
            }
            name="address"
            id="address"
            label="Home Address"
            labelPlacement="outside"
            placeholder="Enter your current home address"
            variant="bordered"
          />
          <div className="flex flex-col gap-4 md:flex-row justify-between w-full">
            <Input
              fullWidth
              isRequired
              color="primary"
              startContent={
                <Flag className="text-default-600 dark:text-default-300 shrink-0" />
              }
              name="nationality"
              id="nationality"
              label="Nationality"
              labelPlacement="outside"
              placeholder="e.g. Filipino"
              variant="bordered"
              className="flex-1"
            />

            <Select
              fullWidth
              name="gender"
              id="gender"
              color="primary"
              label="Gender"
              labelPlacement="outside"
              radius="sm"
              startContent={
                <Transgender className="text-default-600 dark:text-default-300 shrink-0" />
              }
              placeholder="Select gender"
              isRequired
              variant="bordered"
              className="flex-1"
            >
              <SelectItem key="male">Male</SelectItem>
              <SelectItem key="female">Female</SelectItem>
            </Select>
          </div>

          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Upload your valid ID
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            We respect your privacy. Your ID will be used only for identity
            verification, stored securely, and will not be shared without your
            consent.
          </p>

          {/*Front */}
          <div className="w-full">
            <span>Front</span>
            <label
              htmlFor="image-upload"
              className="p-2 w-full min-h-40 sm:h-32 rounded-md border-2 border-dashed border-gray-300 flex justify-center items-center bg-gray-50 cursor-pointer hover:border-primary transition"
            >
              {preview ? (
                <Image
                  src={preview}
                  radius="none"
                  className="h-40 sm:h-32 object-cover"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <CloudDownloadIcon size={28} className="text-gray-400" />
                  <span className="text-xs text-gray-500">
                    Click or drag to upload photo
                  </span>
                </div>
              )}
            </label>

            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              name="image"
              onChange={(e) => setPreview(handleFileChange(e))}
            />
          </div>

          {/*Back */}
          <div className="w-full">
            <span>Back</span>
            <label
              htmlFor="image-upload"
              className="p-2 w-full min-h-40 sm:h-32 rounded-md border-2 border-dashed border-gray-300 flex justify-center items-center bg-gray-50 cursor-pointer hover:border-primary transition"
            >
              {preview ? (
                <Image
                  src={preview}
                  radius="none"
                  className="h-40 sm:h-32 object-cover"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <CloudDownloadIcon size={28} className="text-gray-400" />
                  <span className="text-xs text-gray-500">
                    Click or drag to upload photo
                  </span>
                </div>
              )}
            </label>

            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              name="image"
              onChange={(e) => setPreview(handleFileChange(e))}
            />
          </div>

          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Account Information
          </h3>

          <Input
            isRequired
            color="primary"
            startContent={
              <MailIcon className="text-default-600 dark:text-default-300 shrink-0" />
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            id="email"
            autoComplete="email"
            label="Email"
            labelPlacement="outside"
            placeholder="Enter your email"
            variant="bordered"
          />

          <Input
            isRequired
            color="primary"
            startContent={
              <LockIcon className="text-default-600 dark:text-default-300 shrink-0" />
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            id="password"
            autoComplete="new-password"
            label="Password"
            labelPlacement="outside"
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            variant="bordered"
            endContent={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          <Button
            type="submit"
            color="primary"
            radius="sm"
            fullWidth
            isLoading={isLoading}
          >
            Sign up
          </Button>

          <div className="flex gap-1 text-sm justify-center">
            Already have an account?
            <Link color="primary" href="/auth" size="sm">
              Log in
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
