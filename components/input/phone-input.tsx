"use client";

import React from "react";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import { parsePhoneNumberFromString, AsYouType } from "libphonenumber-js";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export const COUNTRY_CODES = [
  { label: "Philippines (+63)", value: "PH", dialCode: "+63" },
  { label: "United States (+1)", value: "US", dialCode: "+1" },
  { label: "United Kingdom (+44)", value: "GB", dialCode: "+44" },
  { label: "Japan (+81)", value: "JP", dialCode: "+81" },
  { label: "Canada (+1)", value: "CA", dialCode: "+1" },
  { label: "Australia (+61)", value: "AU", dialCode: "+61" },
  { label: "Germany (+49)", value: "DE", dialCode: "+49" },
  { label: "France (+33)", value: "FR", dialCode: "+33" },
  { label: "Singapore (+65)", value: "SG", dialCode: "+65" },
  { label: "India (+91)", value: "IN", dialCode: "+91" },
  { label: "China (+86)", value: "CN", dialCode: "+86" },
  { label: "South Korea (+82)", value: "KR", dialCode: "+82" },
  { label: "Thailand (+66)", value: "TH", dialCode: "+66" },
  { label: "Vietnam (+84)", value: "VN", dialCode: "+84" },
  { label: "Malaysia (+60)", value: "MY", dialCode: "+60" },
  { label: "Indonesia (+62)", value: "ID", dialCode: "+62" },
  { label: "Saudi Arabia (+966)", value: "SA", dialCode: "+966" },
  { label: "United Arab Emirates (+971)", value: "AE", dialCode: "+971" },
  { label: "Mexico (+52)", value: "MX", dialCode: "+52" },
  { label: "Brazil (+55)", value: "BR", dialCode: "+55" },
  { label: "Russia (+7)", value: "RU", dialCode: "+7" },
];

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  label = "Phone Number",
  placeholder = "",
}) => {
  const [country, setCountry] = React.useState<string>("PH");
  const [number, setNumber] = React.useState<string>(value || "");
  const [dialCode, setDialCode] = React.useState<string>("+63");
  const [error, setError] = React.useState<string>("");

  const validateNumber = (raw: string) => {
    const fullNumber = new AsYouType(country as any).input(raw);

    const phoneNumber = parsePhoneNumberFromString(fullNumber, country as any);

    if (!phoneNumber || !phoneNumber.isValid()) {
      setError("Invalid phone number for selected country");
      return false;
    }

    setError("");
    return true;
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s|-/g, "");
    setNumber(raw);

    const valid = validateNumber(raw);

    if (valid) {
      // normalize to E.164 for DB
      const phoneNumber = parsePhoneNumberFromString(raw, country as any);
      onChange(phoneNumber!.format("E.164"));
    }
  };

  const handleCountryChange = (payload: string) => {
    const selectedCountry = COUNTRY_CODES.find(
      (country) => country.value === payload,
    );
    if (!selectedCountry) return;
    setCountry(selectedCountry?.value);
    setDialCode(selectedCountry?.dialCode);
    validateNumber(number);
  };

  return (
    <div>
      <label className="text-sm font-medium ">{label}</label>
      <div className="flex items-start w-full">
        <Select
          variant="bordered"
          value={country}
          isInvalid={!!error}
          onChange={(e) => handleCountryChange(e.target.value)}
          defaultSelectedKeys={["PH"]}
          radius="none"
          isRequired
        >
          {COUNTRY_CODES.map((country) => (
            <SelectItem key={country.value} textValue={country.dialCode}>
              {country.dialCode}
            </SelectItem>
          ))}
        </Select>
        <Input
          variant="bordered"
          fullWidth
          value={number}
          name="contact_number"
          onChange={handleNumberChange}
          isInvalid={!!error}
          errorMessage={error}
          isRequired
          placeholder={placeholder}
          labelPlacement="outside"
          radius="none"
        />
      </div>
    </div>
  );
};

export default PhoneInput;
