"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { useProductCarouselViewModel } from "@/components/content/useProductCarouselViewModel";
import {
  calculateCatalogPrice,
  getProductCategoryLabel,
  CatalogModel,
} from "@repo/core";
import { formatRupiah } from "@repo/core/extension/number";

interface ProductCarouselProps {
  category?: string;
  title?: string;
  description?: string;
  paddingVertical?: string;
  paddingHorizontal?: string;
  headingGap?: string;
  useContainer?: boolean;
}

const ProductCarousel = ({
  category,
  title = "Terbaru dari Kami",
  description = "Temukan keindahan terbaru dalam koleksi perhiasan kami yang memukau.",
  paddingVertical = "py-16",
  paddingHorizontal = "px-0",
  headingGap = "mb-12",
  useContainer = true,
}: ProductCarouselProps = {}) => {
  const { state } = useProductCarouselViewModel(category);

  const renderCarouselContent = () => {
    switch (state.type) {
      case "initiate":
      case "loading":
        return Array.from({ length: 4 }).map((_, idx) => (
          <CarouselItem
            key={idx}
            className="basis-1/2 md:basis-1/3 lg:basis-1/4 pr-2 md:pr-4"
          >
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0">
                <div className="aspect-square mb-3 overflow-hidden bg-muted/10 rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ));

      case "error":
        return (
          <div className="py-8 text-center text-destructive">
            Gagal memuat produk terbaru
          </div>
        );

      case "success":
        return state.data.data.map((product: CatalogModel) => {
          const displayPrice = calculateCatalogPrice(product);
          const categoryLabel = getProductCategoryLabel(product.category);

          return (
            <CarouselItem
              key={product.id}
              className="basis-1/2 md:basis-1/3 lg:basis-1/4 pr-2 md:pr-4"
            >
              <Link href={`/catalog/${product.id}`}>
                <Card className="border-none shadow-none bg-transparent group">
                  <CardContent className="p-0">
                    <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative rounded">
                      {product.images ? (
                        <Image
                          src={product.images[0]?.image || ""}
                          alt={product.displayName}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted/20" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-light text-foreground">
                        {categoryLabel}
                      </p>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-foreground truncate">
                          {product.displayName}
                        </h3>
                        <p className="text-sm font-light text-foreground">
                          {displayPrice ? formatRupiah(displayPrice) : "-"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          );
        });

      default:
        return null;
    }
  };

  return (
    <section
      className={`${paddingVertical} ${paddingHorizontal} bg-background`}
    >
      <div className={useContainer ? "section-container" : ""}>
        <div
          className={`flex flex-col md:flex-row justify-between items-end ${headingGap} gap-6`}
        >
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-light text-foreground mb-4">
              {title}
            </h2>
            <p className="text-muted-foreground font-light text-lg">
              {description}
            </p>
          </div>
          <Link
            href="/catalog"
            className="text-foreground border-b border-foreground pb-1 text-sm tracking-widest uppercase hover:text-muted-foreground hover:border-muted-foreground transition-all"
          >
            Lihat Semua
          </Link>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {renderCarouselContent()}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default ProductCarousel;
