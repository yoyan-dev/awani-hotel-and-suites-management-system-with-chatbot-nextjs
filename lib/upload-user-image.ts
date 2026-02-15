"use server";
import { createClient } from "./supabase/server";

function randomString(length = 12) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function uploadUserImage(file: File) {
  const supabase = await createClient();
  if (!file) return "";
  const ext = file.name.split(".").pop();
  const newName = `${Date.now()}-${randomString()}.${ext}`;
  const filePath = newName;

  const { error } = await supabase.storage
    .from("user-images")
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage.from("user-images").getPublicUrl(filePath);

  return data.publicUrl;
}
