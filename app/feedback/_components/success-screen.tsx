import { Button, Link } from "@heroui/react";
import { CircleCheckBig } from "lucide-react";

export default function SuccessScreen() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4eee3] px-4 dark:bg-[#0f0c08]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(176,138,83,0.2),transparent_40%),radial-gradient(circle_at_85%_80%,rgba(120,94,60,0.14),transparent_38%)] dark:bg-[radial-gradient(circle_at_20%_25%,rgba(176,138,83,0.14),transparent_40%),radial-gradient(circle_at_85%_80%,rgba(120,94,60,0.08),transparent_38%)]" />
      <div className="relative w-full max-w-xl rounded-[2rem] border border-[#deceba] bg-[#fffdf8] p-8 text-center shadow-[0_24px_56px_-38px_rgba(30,22,14,0.5)] sm:p-10 dark:border-[#2a2118] dark:bg-[#15110c]">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#ebddc8] text-[#7e5a2f] dark:bg-[#2a2118] dark:text-[#e2c7a0]">
          <CircleCheckBig size={34} />
        </div>
        <h2 className="mt-5 font-serif text-3xl text-[#231d16] dark:text-[#efe4d3]">
          Thank You
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#6f624f] sm:text-base dark:text-[#b9a48a]">
          We appreciate your feedback and look forward to welcoming you again
          at Awani Hotel.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            as={Link}
            href="/guest"
            radius="full"
            className="bg-[#b08a53] px-6 font-semibold text-white hover:bg-[#9d7948] dark:bg-[#c29a60] dark:hover:bg-[#b48953]"
          >
            Back to Guest Home
          </Button>
          <Button
            as={Link}
            href="/feedback"
            variant="bordered"
            radius="full"
            className="border-[#cfb48f] px-6 text-[#4f4436] dark:border-[#6a5438] dark:text-[#e0c8a5]"
          >
            Submit Another
          </Button>
        </div>
      </div>
    </div>
  );
}
