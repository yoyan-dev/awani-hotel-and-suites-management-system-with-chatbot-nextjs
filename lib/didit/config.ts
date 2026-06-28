export const DIDIT_WORKFLOW_ID = "630424f8-ba43-48cb-b318-8a9d8806a3cd";
export const DIDIT_API_BASE_URL = "https://verification.didit.me";

export const DIDIT_STATUSES = [
  "Not Started",
  "In Progress",
  "Awaiting User",
  "In Review",
  "Approved",
  "Declined",
  "Resubmitted",
  "Abandoned",
  "Expired",
  "Kyc Expired",
] as const;

export type DiditStatus = (typeof DIDIT_STATUSES)[number];

export function isDiditStatus(value: unknown): value is DiditStatus {
  return (
    typeof value === "string" &&
    DIDIT_STATUSES.includes(value as DiditStatus)
  );
}
