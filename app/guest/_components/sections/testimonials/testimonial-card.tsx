import { Quote } from "lucide-react";

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
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-4 rounded-md shadow-sm flex flex-col gap-3 h-full mr-4">
      <Quote size={20} className="text-yellow-400" />
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={
              index < Number(rating)
                ? "text-yellow-500 text-base"
                : "text-gray-300 text-base"
            }
          >
            ★
          </span>
        ))}
      </div>
      <p className="text-gray-700 text-sm flex-1">"{comment}"</p>
      <div>
        <span className="text-primary font-semibold">{name}</span>
        {role && <span className="text-gray-500 text-xs ml-2">— {role}</span>}
      </div>
    </div>
  );
}
