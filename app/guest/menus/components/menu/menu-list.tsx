import { BanquetMenu } from "@/types/banquet";
import MenuItemCard from "./menu-item-card";

interface Props {
  menus: BanquetMenu[];
}

export default function BanquetMenuList({ menus }: Props) {
  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-4
      "
    >
      {menus.map((menu) => (
        <MenuItemCard key={menu.id} menu={menu} />
      ))}
    </div>
  );
}
