import { BedDouble, Clock3, Sparkles, UtensilsCrossed } from "lucide-react";

export default function FeedbackHeader() {
  return (
    <aside className="rounded-[2rem] border border-[#deceba] bg-[#1e1711] p-6 text-[#efe4d3] shadow-[0_24px_56px_-34px_rgba(18,12,7,0.7)] sm:p-8 dark:border-[#2a2118] dark:bg-[#120e0a] dark:text-[#efe4d3]">
      <p className="inline-flex items-center gap-2 rounded-full border border-[#d9bf95]/40 bg-[#b08a53]/25 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#f6e4c8] dark:border-[#a8895f]/40 dark:bg-[#7a5b2e]/30">
        <Sparkles size={14} />
        Guest Feedback
      </p>

      <h1 className="mt-5 font-serif text-3xl leading-tight text-white sm:text-4xl">
        Tell us how your Awani stay felt.
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-[#ddceb8] sm:text-base dark:text-[#d7c7b1]">
        Your feedback helps us sharpen every detail, from room comfort to
        dining service. It only takes a minute.
      </p>

      <div className="mt-8 grid gap-3">
        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 dark:border-white/5 dark:bg-white/5">
          <BedDouble size={18} className="mt-0.5 text-[#e6c89a] dark:text-[#d6b27d]" />
          <div>
            <p className="text-sm font-semibold text-white">Stay quality</p>
            <p className="text-xs text-[#cfc0ab] dark:text-[#c5b39b]">
              Share what worked and what we can improve in your room
              experience.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 dark:border-white/5 dark:bg-white/5">
          <UtensilsCrossed size={18} className="mt-0.5 text-[#e6c89a] dark:text-[#d6b27d]" />
          <div>
            <p className="text-sm font-semibold text-white">Service touchpoints</p>
            <p className="text-xs text-[#cfc0ab] dark:text-[#c5b39b]">
              Let us know how our team, amenities, and dining met expectations.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 dark:border-white/5 dark:bg-white/5">
          <Clock3 size={18} className="mt-0.5 text-[#e6c89a] dark:text-[#d6b27d]" />
          <div>
            <p className="text-sm font-semibold text-white">Quick and simple</p>
            <p className="text-xs text-[#cfc0ab] dark:text-[#c5b39b]">
              The form is short and your response is submitted instantly.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
