interface Props {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function Card({ title, description, icon }: Props) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-3xl border border-[#e4d8c8] bg-[#fffdf8] p-6 shadow-[0_18px_40px_-34px_rgba(32,27,20,0.45)]">
      {icon ? <div className="mb-2">{icon}</div> : null}
      <h3 className="font-serif text-2xl text-[#241f1a]">{title}</h3>
      <p className="text-sm leading-relaxed text-[#655b4d]">{description}</p>
    </div>
  );
}
