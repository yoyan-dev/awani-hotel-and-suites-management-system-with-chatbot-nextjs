"use client";
import { BanquetMenu } from "@/types/banquet";
import MenuList from "./components/menu/menu-list";
import PageHeader from "./components/menu/ui/page-header";

const MENU: BanquetMenu[] = [
  {
    id: "1",
    name: "Grilled Chicken",
    description: "Juicy grilled chicken with herbs",
    price: 180,
    category: "Main Dish",
  },
  {
    id: "2",
    name: "Garlic Rice",
    price: 60,
    category: "Side",
  },
  {
    id: "3",
    name: "Iced Lemon Tea",
    price: 50,
    category: "Drinks",
  },
];

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className=" mx-auto px-4 py-6">
        <PageHeader
          title="Restaurant Menu"
          subtitle="Freshly prepared dishes"
        />

        <MenuList menus={MENU} />
      </div>
    </main>
  );
}
