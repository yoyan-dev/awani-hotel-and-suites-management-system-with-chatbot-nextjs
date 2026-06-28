"use client";

import React from "react";
import NextLink from "next/link";
import { addToast, Button, Chip } from "@heroui/react";
import { ExternalLink, RefreshCw, ShieldCheck } from "lucide-react";
import { DiditSdk } from "@didit-protocol/sdk-web";
import { apiFetch } from "@/lib/api/client";

type DiditVerificationProps = {
  guestId: string;
  bookingType: string;
  onStatusChange: (isVerified: boolean) => void;
};

type DiditStatusResponse = {
  status: string;
  session_id: string | null;
  verified_at: string | null;
};

function readFormValue(form: HTMLFormElement | null, name: string) {
  if (!form) return "";
  const value = new FormData(form).get(name);
  return typeof value === "string" ? value.trim() : "";
}

function getStatusColor(status: string) {
  if (status === "Approved") return "success";
  if (status === "Declined" || status === "Expired") return "danger";
  if (status === "In Review" || status === "Resubmitted") return "warning";
  return "default";
}

export default function DiditVerification({
  guestId,
  bookingType,
  onStatusChange,
}: DiditVerificationProps) {
  const [status, setStatus] = React.useState("Not Started");
  const [isStarting, setIsStarting] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(false);
  const isApproved = status === "Approved";

  const checkStatus = React.useCallback(async () => {
    if (!guestId) return;
    setIsChecking(true);
    try {
      const res = await apiFetch(
        `/api/didit/status?vendorData=${encodeURIComponent(guestId)}`,
      );
      const data = (await res.json()) as DiditStatusResponse;
      if (!res.ok) throw new Error("Could not load verification status");
      setStatus(data.status);
      onStatusChange(data.status === "Approved");
    } catch (error: any) {
      addToast({
        title: "Verification Status Unavailable",
        description: error?.message ?? "Please try again.",
        color: "warning",
      });
    } finally {
      setIsChecking(false);
    }
  }, [guestId, onStatusChange]);

  React.useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  React.useEffect(() => {
    if (isApproved) return;

    const onFocus = () => {
      checkStatus();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [checkStatus, isApproved]);

  async function startVerification(form: HTMLFormElement | null) {
    setIsStarting(true);
    try {
      const res = await apiFetch("/api/didit/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorData: guestId,
          bookingType,
          fullName: readFormValue(form, "full_name"),
          email: readFormValue(form, "email"),
          phone: readFormValue(form, "contact_number"),
        }),
      });
      const session = await res.json();

      if (!res.ok || !session.url) {
        throw new Error(
          session?.message?.description ?? "Could not start verification.",
        );
      }

      setStatus("In Progress");
      onStatusChange(false);
      DiditSdk.shared.onComplete = () => {
        void checkStatus();
      };

      try {
        DiditSdk.shared.startVerification({ url: session.url });
      } catch {
        window.open(session.url, "_blank", "noopener,noreferrer");
      }
    } catch (error: any) {
      addToast({
        title: "Verification Failed to Start",
        description: error?.message ?? "Please try again.",
        color: "danger",
      });
    } finally {
      setIsStarting(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[#e8ddcc] bg-[#fcf7ef] p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-[#4f4538]">
              Valid ID Verification
            </h3>
            <Chip size="sm" color={getStatusColor(status) as any} variant="flat">
              {status}
            </Chip>
          </div>
          <p className="max-w-2xl text-xs leading-6 text-[#6a6052]">
            We use Didit to verify your identity before reservation submission.
            Your ID data is handled according to our{" "}
            <NextLink
              href="/guest/privacy-policy"
              className="font-semibold text-[#8a6331] underline underline-offset-2"
            >
              Privacy Policy
            </NextLink>
            . The webhook decision is the final verification source.
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            onPress={() => checkStatus()}
            isIconOnly
            isLoading={isChecking}
            variant="bordered"
            className="border-[#d8c8b1] text-[#5f5140]"
            aria-label="Refresh verification status"
          >
            <RefreshCw size={16} />
          </Button>
          <Button
            type="button"
            onClick={(event) => {
              const form = (event.currentTarget as HTMLElement).closest("form");
              void startVerification(form);
            }}
            isLoading={isStarting}
            startContent={isApproved ? <ShieldCheck size={16} /> : <ExternalLink size={16} />}
            className="bg-[#b08a53] font-semibold text-white hover:bg-[#9d7948]"
          >
            {isApproved ? "Verified" : "Start Verification"}
          </Button>
        </div>
      </div>
    </section>
  );
}
