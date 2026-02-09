import { parsePhoneNumberFromString } from "libphonenumber-js";

export const isValidPhoneNumber = (value: string): boolean => {
  try {
    const phoneNumber = parsePhoneNumberFromString(value);
    return phoneNumber?.isValid() ?? false;
  } catch {
    return false;
  }
};
