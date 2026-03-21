const guestTextFields = [
  "full_name",
  "contact_number",
  "address",
  "nationality",
  "gender",
  "email",
  "id_type",
] as const;

export function buildGuestFormData(source: FormData) {
  const guestFormData = new FormData();
  const generatedGuestId = crypto.randomUUID();
  guestFormData.append("id", generatedGuestId);

  for (const field of guestTextFields) {
    const value = source.get(field);
    if (typeof value === "string" && value.trim()) {
      guestFormData.append(field, value);
    }
  }

  const front = source.get("front");
  if (front instanceof File && front.size > 0) {
    guestFormData.append("front", front);
  }

  const back = source.get("back");
  if (back instanceof File && back.size > 0) {
    guestFormData.append("back", back);
  }

  return { guestFormData, generatedGuestId };
}
