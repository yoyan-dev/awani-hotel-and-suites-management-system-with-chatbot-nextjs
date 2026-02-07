"use client";
import { Button } from "@heroui/button";
import { useState } from "react";

export default function CookieBanner() {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    localStorage.setItem("cookies-accepted", "true");
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-0 right-0 w-44 bg-white p-4 flex flex-col justify-between">
      <span>We use cookies to keep you logged in. 🍪</span>
      <Button onPress={handleAccept} color="default" size="sm">
        Accept
      </Button>
    </div>
  );
}
