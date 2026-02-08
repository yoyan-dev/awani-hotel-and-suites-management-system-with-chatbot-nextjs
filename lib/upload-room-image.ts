"use client";
import { supabase } from "@/lib/supabase-client";

function randomString(length = 12) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function uploadRoomImage(file: File, roomNumber: string | number) {
  if (!file) return "";
  const ext = file.name.split(".").pop();
  const newName = `${Date.now()}-${randomString()}.${ext}`;

  const filePath = `room-${roomNumber}/${newName}`;
  const { error } = await supabase.storage
    .from("room-images")
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage.from("room-images").getPublicUrl(filePath);

  return data.publicUrl;
}
