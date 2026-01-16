import Card from "../ui/card";

interface Props {
  items: { title: string; description: string; icon?: React.ReactNode }[];
}

export default function AboutSection({ items }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, idx) => (
        <Card
          key={idx}
          title={item.title}
          description={item.description}
          icon={item.icon}
        />
      ))}
    </div>
  );
}
