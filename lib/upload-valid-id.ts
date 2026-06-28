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

function getImageExtension(contentType: string | null, fallbackUrl?: string) {
  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("webp")) return "webp";
  if (contentType?.includes("heic")) return "heic";
  if (contentType?.includes("pdf")) return "pdf";

  const pathname = fallbackUrl ? new URL(fallbackUrl).pathname : "";
  const extension = pathname.split(".").pop()?.toLowerCase();

  return extension && extension.length <= 5 ? extension : "jpg";
}

async function uploadValidIDBlob(blob: Blob, extension: string) {
  const path = `user-id/${Date.now()}-${randomString()}.${extension}`;
  const { error } = await supabase.storage
    .from("user-images")
    .upload(path, blob, {
      contentType: blob.type || undefined,
    });

  if (error) throw error;

  const { data } = supabase.storage.from("user-images").getPublicUrl(path);
  return data.publicUrl;
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

export async function uploadValidIDImageFromUrls(
  frontImageUrl?: string | null,
  backImageUrl?: string | null,
) {
  const [frontResponse, backResponse] = await Promise.all([
    frontImageUrl ? fetch(frontImageUrl) : Promise.resolve(null),
    backImageUrl ? fetch(backImageUrl) : Promise.resolve(null),
  ]);

  if (frontResponse && !frontResponse.ok) {
    throw new Error("Could not download Didit front ID image.");
  }

  if (backResponse && !backResponse.ok) {
    throw new Error("Could not download Didit back ID image.");
  }

  const [frontBlob, backBlob] = await Promise.all([
    frontResponse ? frontResponse.blob() : Promise.resolve(null),
    backResponse ? backResponse.blob() : Promise.resolve(null),
  ]);

  const [front, back] = await Promise.all([
    frontBlob
      ? uploadValidIDBlob(
          frontBlob,
          getImageExtension(
            frontResponse?.headers.get("content-type") ?? null,
            frontImageUrl ?? undefined,
          ),
        )
      : Promise.resolve(null),
    backBlob
      ? uploadValidIDBlob(
          backBlob,
          getImageExtension(
            backResponse?.headers.get("content-type") ?? null,
            backImageUrl ?? undefined,
          ),
        )
      : Promise.resolve(null),
  ]);

  return {
    front,
    back,
  };
}
