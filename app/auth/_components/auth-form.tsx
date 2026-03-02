"use client";

import React from "react";
import { Input, Button, Link, Form } from "@heroui/react";
import { MailIcon, LockIcon } from "lucide-react";

interface AuthMessage {
  error: boolean;
  message: string;
}

interface AuthFormProps {
  isForgotMode: boolean;
  isLoading: boolean;
  email: string;
  password: string;
  message: AuthMessage | null;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onToggleMode: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function AuthForm({
  isForgotMode,
  isLoading,
  email,
  password,
  message,
  onEmailChange,
  onPasswordChange,
  onToggleMode,
  onSubmit,
}: AuthFormProps) {
  return (
    <Form onSubmit={onSubmit} className="mt-4 flex flex-col gap-4">
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
        onChange={(e) => onEmailChange(e.target.value)}
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
          onChange={(e) => onPasswordChange(e.target.value)}
          label="Password"
          labelPlacement="outside"
          placeholder="Enter your password"
          type="password"
          variant="bordered"
        />
      )}

      <div className="flex justify-between">
        <Link color="primary" href="#" size="sm" onPress={onToggleMode}>
          {isForgotMode ? "Back to login" : "Forgot password?"}
        </Link>
      </div>

      <Button type="submit" color="primary" radius="sm" fullWidth isLoading={isLoading}>
        {isForgotMode ? "Send reset email" : "Login"}
      </Button>
    </Form>
  );
}
