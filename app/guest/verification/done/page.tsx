import { redirect } from "next/navigation";

type VerificationDonePageProps = {
  searchParams: Promise<{
    returnTo?: string;
  }>;
};

function getSafeReturnTo(value: string | undefined) {
  if (!value) return "/guest/reservations/hotel-rooms";

  try {
    const url = new URL(value, "https://local.invalid");
    const returnTo = `${url.pathname}${url.search}`;

    return returnTo.startsWith("/guest/reservations/")
      ? returnTo
      : "/guest/reservations/hotel-rooms";
  } catch {
    return "/guest/reservations/hotel-rooms";
  }
}

export default async function VerificationDonePage({
  searchParams,
}: VerificationDonePageProps) {
  const params = await searchParams;

  redirect(getSafeReturnTo(params.returnTo));
}
