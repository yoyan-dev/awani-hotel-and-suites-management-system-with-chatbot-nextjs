interface Props {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: Props) {
  return (
    <header className="mb-6">
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </header>
  );
}
