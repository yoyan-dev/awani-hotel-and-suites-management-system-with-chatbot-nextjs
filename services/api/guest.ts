import { ApiRouteError } from "@/lib/api/route-error";
import { supabase } from "@/lib/supabase/supabase-client";
import { uploadValidIDImage } from "@/lib/upload-valid-id";

export async function listGuests() {
  const { data, error } = await supabase.from("guest").select("*");

  if (error) {
    throw new ApiRouteError(error.message);
  }

  return data ?? [];
}

export async function createGuest(formData: FormData) {
  const {
    id,
    full_name,
    contact_number,
    address,
    nationality,
    gender,
    email,
    id_type,
  } = Object.fromEntries(formData.entries());

  const frontImageFile = (formData.get("front") as File) || null;
  const backImageFile = (formData.get("back") as File) || null;
  const validIdImage = await uploadValidIDImage(frontImageFile, backImageFile);

  const newData = {
    id: id ? String(id) : undefined,
    full_name: full_name ? String(full_name) : null,
    contact_number: contact_number ? String(contact_number) : null,
    address: address ? String(address) : null,
    nationality: nationality ? String(nationality) : null,
    gender: gender ? String(gender) : null,
    email: email ? String(email) : null,
    valid_id: {
      front: validIdImage.front,
      back: validIdImage.back,
      type: id_type ? String(id_type) : null,
    },
  };

  const { data, error } = await supabase.from("guest").insert(newData).select();

  if (error) {
    if (error.code === "23505") {
      throw new ApiRouteError("Guest already exists.", { status: 400 });
    }

    throw new ApiRouteError(error.message);
  }

  return data?.[0] ?? {};
}

export async function deleteGuests(selectedValues: number[] | "all") {
  let request = supabase.from("guest").delete();

  if (selectedValues === "all") {
  } else if (Array.isArray(selectedValues) && selectedValues.length > 0) {
    request = request.in("id", selectedValues.map(String));
  } else {
    throw new ApiRouteError(String(selectedValues), {
      status: 400,
      color: "warning",
    });
  }

  const { data, error } = await request;

  if (error) {
    throw new ApiRouteError("Failed to delete items.", {
      color: "error",
      extra: { error: error.message },
    });
  }

  return data;
}
