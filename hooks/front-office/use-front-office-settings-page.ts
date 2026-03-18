"use client";

import React from "react";
import { addToast } from "@heroui/react";
import { signOut, useSession } from "next-auth/react";
import { User, UserFormData } from "@/types/users";
import { useUsers } from "@/hooks/use-users";
import { uploadUserImage } from "@/lib/upload-user-image";

export function useFrontOfficeSettingsPage() {
  const { isLoading: updateUserLoading, updateUserProfile } = useUsers();
  const { data: session, status, update } = useSession();

  const [user, setUser] = React.useState<User>();
  const [formData, setFormData] = React.useState<UserFormData>(
    {} as UserFormData,
  );

  React.useEffect(() => {
    if (status !== "authenticated" || !session?.user) {
      return;
    }

    const sessionUser = session.user as User;
    setUser(sessionUser);
    setFormData({
      email: sessionUser.email || "",
      full_name: sessionUser.user_metadata?.full_name || "",
      current_password: "",
      new_password: "",
      confirm_password: "",
      user_metadata: sessionUser.user_metadata || {},
      image: sessionUser.user_metadata?.image || "",
      user: sessionUser,
    });
  }, [session, status]);

  async function onSubmit(
    e: React.FormEvent<HTMLFormElement>,
    payload: UserFormData,
  ) {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const imageFile = data.get("image") as File;
    const imageUrl = imageFile?.size
      ? await uploadUserImage(imageFile)
      : user?.user_metadata?.image;

    const nextUserMetadata = {
      ...payload.user_metadata,
      full_name: payload.full_name,
      image: imageUrl,
    };

    await updateUserProfile({
      ...payload,
      user_metadata: nextUserMetadata,
      user: user as User,
    });

    await update({
      user: {
        ...session?.user,
        email: payload.email,
        name: payload.full_name,
        image: imageUrl || null,
        user_metadata: {
          ...(session?.user.user_metadata || {}),
          ...nextUserMetadata,
        },
      },
    });

    if (payload.new_password) {
      addToast({
        title: "Password updated successfully",
        description: "Please login with your new password",
        color: "success",
      });

      await signOut({ callbackUrl: "/auth" });
    }
  }

  return {
    status,
    user,
    formData,
    setFormData,
    onSubmit,
    updateUserLoading,
  };
}
