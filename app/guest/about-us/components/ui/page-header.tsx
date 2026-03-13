interface Props {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: Props) {
  return (
    <header className="mb-8 text-center">
      <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-200">
        {title}
      </h1>
      {subtitle && (
        <p className="text-gray-500 mt-2 text-sm dark:text-gray-300">
          {subtitle}
        </p>
      )}
    </header>
  );
}
