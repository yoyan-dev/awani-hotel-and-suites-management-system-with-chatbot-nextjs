import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function VerificationDonePage() {
  return (
    <main className="min-h-[70vh] py-12">
      <section className="mx-auto flex max-w-2xl flex-col items-center rounded-3xl border border-[#e3d8c8] bg-[#fffdf8] px-6 py-12 text-center shadow-[0_24px_55px_-42px_rgba(35,30,24,0.48)]">
        <div className="flex size-14 items-center justify-center rounded-full bg-[#e6f4ea] text-[#2f7b4f]">
          <ShieldCheck size={28} />
        </div>
        <h1 className="mt-5 font-serif text-3xl text-[#241f1a]">
          Verification submitted
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-[#665b4d]">
          You can return to your reservation tab and refresh the verification
          status. The final decision is confirmed through Didit's secure
          webhook.
        </p>
        <Link
          href="/guest/reservations/hotel-rooms"
          className="mt-6 rounded-full bg-[#b08a53] px-5 py-3 font-semibold text-white hover:bg-[#9d7948]"
        >
          Back to reservations
        </Link>
      </section>
    </main>
  );
}
