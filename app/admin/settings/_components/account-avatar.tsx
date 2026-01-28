"use client";

import { Avatar } from "@heroui/react";

export default function AccountAvatar({
  image,
  name,
}: {
  image: string;
  name: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <Avatar src={image} name={name} size="lg" />
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-default-500">Account profile</p>
      </div>
    </div>
  );
}
