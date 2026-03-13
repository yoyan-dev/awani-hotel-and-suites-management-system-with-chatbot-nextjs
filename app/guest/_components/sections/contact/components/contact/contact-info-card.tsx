import { MapPin, Phone, Mail } from "lucide-react";

interface Props {
  title: string;
  details: string;
  icon: React.ReactNode;
}

export default function ContactInfoCard({ title, details, icon }: Props) {
  return (
    <div className="flex items-start gap-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-900 p-4 rounded-md shadow-sm">
      <div className="text-primary-600">{icon}</div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </span>
        <span className="text-gray-600 dark:text-gray-400 text-sm">
          {details}
        </span>
      </div>
    </div>
  );
}
