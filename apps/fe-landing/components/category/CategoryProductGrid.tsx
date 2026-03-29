"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import { CatalogModel, calculateCatalogPrice } from "@repo/core";
import { ShimmerOverlay } from "@/components/ShimmerOverlay";

interface CategoryProductGridProps {
  catalogs: CatalogModel[];
  isLoading?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const CategoryProductGrid = ({
  catalogs,
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: CategoryProductGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full px-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="relative h-64 bg-muted rounded-lg overflow-hidden"
          >
            <ShimmerOverlay isVisible={true} />
          </div>
        ))}
      </div>
    );
  }

  if (!catalogs || catalogs.length === 0) {
    return (
      <div className="w-full px-6 py-12 text-center">
        <p className="text-muted-foreground font-light">
          No products found in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full px-6 mb-12">
        {catalogs.map((catalog) => {
          const price = calculateCatalogPrice(catalog);
          const priceIDR = `Rp ${price.toLocaleString("id-ID")}`;
          const imageUrl =
            catalog.images && catalog.images.length > 0
              ? catalog.images[0]?.image || ""
              : null;

          return (
            <Link
              key={catalog.id}
              href={`/catalog/${catalog.id}`}
              className="group"
            >
              <Card className="border-0 shadow-sm bg-background hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="relative h-64 overflow-hidden bg-muted rounded-t-lg">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={catalog.displayName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-xs text-muted-foreground font-light">
                          No image
                        </span>
                      </div>
                    )}
                    {catalog.quantity > 0 && (
                      <div className="absolute top-3 right-3 bg-foreground text-background px-3 py-1 rounded text-xs font-light">
                        {catalog.quantity} in stock
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-light text-sm text-foreground mb-1 line-clamp-2">
                      {catalog.displayName}
                    </h3>
                    <p className="text-xs text-muted-foreground font-light mb-3">
                      {catalog.category}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="font-light text-foreground">{priceIDR}</p>
                      <p className="text-xs text-muted-foreground font-light">
                        {catalog.netWeightGram}g
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange || (() => {})}
          />
        </div>
      )}
    </div>
  );
};

export default CategoryProductGrid;
