import { Quote } from "lucide-react";

interface Props {
  name: string;
  role?: string;
  comment: string;
}

export default function TestimonialCard({ name, role, comment }: Props) {
  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-4 rounded-md shadow-sm flex flex-col gap-3 h-full mr-4">
      <Quote size={20} className="text-yellow-400" />
      <p className="text-gray-700 text-sm flex-1">"{comment}"</p>
      <div>
        <span className="text-primary font-semibold">{name}</span>
        {role && <span className="text-gray-500 text-xs ml-2">— {role}</span>}
      </div>
    </div>
  );
}
