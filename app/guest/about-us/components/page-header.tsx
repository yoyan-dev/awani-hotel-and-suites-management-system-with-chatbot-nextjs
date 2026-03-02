interface Props {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: Props) {
  return (
    <header className="mb-10 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a7647]">
        About
      </p>
      <h1 className="mt-3 font-serif text-3xl text-[#211f1b] sm:text-4xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mx-auto mt-3 max-w-2xl text-sm text-[#665c4f] sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
