import { Quote, Star } from "lucide-react";

interface Props {
  name: string;
  role?: string;
  rating?: number;
  comment: string;
}

export default function TestimonialCard({
  name,
  role,
  rating,
  comment,
}: Props) {
  return (
    <article className="mr-4 flex h-full flex-col gap-4 rounded-3xl border border-[#e4d8c8] bg-[#fffdf8] p-6 shadow-[0_18px_40px_-34px_rgba(33,27,20,0.48)]">
      <div className="flex items-center justify-between">
        <Quote size={22} className="text-[#b08a53]" />
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={14}
              fill={index < Number(rating) ? "#c28d3a" : "transparent"}
              className={
                index < Number(rating) ? "text-[#c28d3a]" : "text-[#d6cab8]"
              }
            />
          ))}
        </div>
      </div>
      <p className="flex-1 text-sm leading-relaxed text-[#5e5449]">
        "{comment}"
      </p>
      <div>
        <p className="font-serif text-xl text-[#241f1a] capitalize">{name}</p>
        {role ? (
          <p className="text-xs uppercase tracking-[0.18em] text-[#8f7f6a]">
            {role}
          </p>
        ) : null}
      </div>
    </article>
  );
}
