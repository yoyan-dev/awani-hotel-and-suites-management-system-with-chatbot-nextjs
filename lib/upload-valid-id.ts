import { supabase } from "@/lib/supabase/supabase-client";

function randomString(length = 12) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function uploadValidIDImage(
  frontImageFile: File,
  backImageFile: File,
) {
  if (!frontImageFile || !backImageFile) return {};

  const frontExt = frontImageFile.name.split(".").pop();
  const backExt = backImageFile.name.split(".").pop();
  const frontNewName = `${Date.now()}-${randomString()}.${frontExt}`;
  const backNewName = `${Date.now()}-${randomString()}.${backExt}`;
  const frontPath = `user-id/${frontNewName}`;
  const backPath = `user-id/${backNewName}`;

  // upload front
  const { error: frontError } = await supabase.storage
    .from("user-images")
    .upload(frontPath, frontImageFile);

  if (frontError) throw frontError;

  // upload back
  const { error: backError } = await supabase.storage
    .from("user-images")
    .upload(backPath, backImageFile);

  if (backError) throw backError;

  // get public URLs
  const { data: frontData } = supabase.storage
    .from("user-images")
    .getPublicUrl(frontPath);

  const { data: backData } = supabase.storage
    .from("user-images")
    .getPublicUrl(backPath);

  return {
    front: frontData.publicUrl,
    back: backData.publicUrl,
  };
}
