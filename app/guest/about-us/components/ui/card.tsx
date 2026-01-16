interface Props {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function Card({ title, description, icon }: Props) {
  return (
    <div className="bg-white border border-gray-200 p-4 rounded-md shadow-sm h-full flex flex-col gap-3">
      {icon && <div className="mb-2">{icon}</div>}
      <h3 className="text-primary font-semibold text-lg">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
