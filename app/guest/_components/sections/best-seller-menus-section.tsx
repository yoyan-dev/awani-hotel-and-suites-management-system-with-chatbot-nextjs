"use client";

import { Carousel, CarouselItem } from "@/components/ui/carousel";
import { Card, Image } from "@heroui/react";

interface BestSellerItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  paragraphs: string[];
}

export default function BestSellerSection() {
  const bestSellerSections: BestSellerItem[] = [
    {
      id: "1",
      title: "Signature Grilled Chicken",
      subtitle: "Best Seller",
      image: "/best-seller/grilled-chicken.jpg",
      paragraphs: [
        "Our Signature Grilled Chicken is marinated in a blend of herbs and spices, grilled to perfection, and served with carefully selected sides that complement its rich and smoky flavor.",
        "This dish has become a favorite among guests seeking a hearty and satisfying meal during their stay at Awani Hotel and Suites.",
      ],
    },
    {
      id: "2",
      title: "Seafood Medley Platter",
      subtitle: "Guest Favorite",
      image: "/best-seller/seafood.jpg",
      paragraphs: [
        "The Seafood Medley Platter features a selection of the freshest catch, prepared to highlight the natural flavors of each ingredient.",
        "Ideal for sharing, this menu has earned its place as one of the most ordered dishes by families and groups staying with us.",
      ],
    },
    {
      id: "3",
      title: "Classic Pasta Carbonara",
      subtitle: "Chef’s Recommendation",
      image: "/best-seller/pasta.jpg",
      paragraphs: [
        "Our Classic Pasta Carbonara is made with a creamy sauce, crispy bacon, and perfectly cooked pasta, finished with parmesan cheese.",
        "Loved for its comforting taste and balanced flavors, this dish continues to delight both first-time and returning guests.",
      ],
    },
  ];

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <header className="mb-10 text-center">
        <h1 className="text-2xl font-semibold text-primary">
          Restaurant Best Sellers
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Our top-ordered dishes loved by our guests
        </p>
      </header>
      <Carousel
        autoScroll
        autoScrollInterval={2500}
        itemsPerView={1}
        hasButton={false}
        dotType="image"
        responsive={{ sm: 1, md: 1, lg: 1, xl: 1 }}
        className="max-w-7xl mx-auto"
      >
        {bestSellerSections.map((menu) => (
          <CarouselItem key={menu.id}>
            <Card className="grid gap-8 md:grid-cols-2 items-center p-6 md:p-10 rounded-md shadow-sm transition hover:shadow-md">
              <div className="w-full">
                <Image
                  src={menu.image}
                  alt={menu.title}
                  className="w-full h-[300px] md:h-[420px] object-cover rounded-md"
                />
              </div>

              <div className="flex flex-col gap-4">
                <span className="text-xs uppercase tracking-wide text-gray-500">
                  {menu.subtitle}
                </span>

                <h2 className="text-3xl font-semibold text-gray-800 leading-tight">
                  {menu.title}
                </h2>

                {menu.paragraphs.map((text, index) => (
                  <p
                    key={index}
                    className="text-sm text-gray-600 leading-relaxed"
                  >
                    {text}
                  </p>
                ))}
              </div>
            </Card>
          </CarouselItem>
        ))}
      </Carousel>
    </section>
  );
}
