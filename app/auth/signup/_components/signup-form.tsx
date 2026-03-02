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

interface SignupFormProps {
  email: string;
  password: string;
  showPassword: boolean;
  preview: string | null;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function ProfilePhotoUpload({
  preview,
  onImageChange,
}: {
  preview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
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
        onChange={onImageChange}
      />
    </div>
  );
}

function PersonalInformationSection() {
  return (
    <>
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
    </>
  );
}

function ValidIdUploadField({
  label,
  preview,
  onImageChange,
}: {
  label: string;
  preview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="w-full">
      <span>{label}</span>
      <label
        htmlFor="image-upload"
        className="p-2 w-full min-h-40 sm:h-32 rounded-md border-2 border-dashed border-gray-300 flex justify-center items-center bg-gray-50 cursor-pointer hover:border-primary transition"
      >
        {preview ? (
          <Image src={preview} radius="none" className="h-40 sm:h-32 object-cover" />
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
        onChange={onImageChange}
      />
    </div>
  );
}

function AccountInformationSection({
  email,
  password,
  showPassword,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
}: {
  email: string;
  password: string;
  showPassword: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
}) {
  return (
    <>
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
        onChange={(e) => onEmailChange(e.target.value)}
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
        onChange={(e) => onPasswordChange(e.target.value)}
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
            onClick={onTogglePassword}
            className="focus:outline-none"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      />
    </>
  );
}

export default function SignupForm({
  email,
  password,
  showPassword,
  preview,
  isLoading,
  onSubmit,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onImageChange,
}: SignupFormProps) {
  return (
    <Form onSubmit={onSubmit} className="flex flex-col gap-4">
      <ProfilePhotoUpload preview={preview} onImageChange={onImageChange} />

      <PersonalInformationSection />

      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
        Upload your valid ID
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        We respect your privacy. Your ID will be used only for identity
        verification, stored securely, and will not be shared without your
        consent.
      </p>

      <ValidIdUploadField
        label="Front"
        preview={preview}
        onImageChange={onImageChange}
      />
      <ValidIdUploadField
        label="Back"
        preview={preview}
        onImageChange={onImageChange}
      />

      <AccountInformationSection
        email={email}
        password={password}
        showPassword={showPassword}
        onEmailChange={onEmailChange}
        onPasswordChange={onPasswordChange}
        onTogglePassword={onTogglePassword}
      />

      <Button type="submit" color="primary" radius="sm" fullWidth isLoading={isLoading}>
        Sign up
      </Button>

      <div className="flex gap-1 text-sm justify-center">
        Already have an account?
        <Link color="primary" href="/auth" size="sm">
          Log in
        </Link>
      </div>
    </Form>
  );
}
