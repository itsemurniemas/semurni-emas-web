"use client";

import Link from "next/link";
import {
  CatalogModel,
  calculateCatalogPrice,
  formatPriceIDR,
} from "@repo/core";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ReviewProduct from "./ReviewProduct";

interface ProductInfoProps {
  catalog: CatalogModel;
  categoryLabel: string;
}

const ProductInfo = ({ catalog, categoryLabel }: ProductInfoProps) => {
  const price = calculateCatalogPrice(catalog);
  const priceIDR = formatPriceIDR(price);

  // Get material description based on product type
  const getMaterialDescription = () => {
    if (catalog.product.goldJewelryItem) {
      return "Emas Perhiasan Murni";
    } else if (catalog.product.goldBarItem) {
      return "Emas Batangan Murni";
    } else if (catalog.product.nonGoldItem) {
      return "Logam Lainnya";
    }
    return "-";
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb - Show only on desktop */}
      <div className="hidden lg:block">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Beranda</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/category/${catalog.category.toLowerCase()}`}>
                  {categoryLabel}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{catalog.displayName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Product title and price */}
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-light text-muted-foreground mb-1">
              {categoryLabel}
            </p>
            <h1 className="text-2xl md:text-3xl font-light text-foreground">
              {catalog.displayName}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-xl font-light text-foreground">{priceIDR}</p>
          </div>
        </div>
      </div>

      {/* Product details */}
      <div className="space-y-4 py-4 border-b border-border">
        <div className="space-y-2">
          <h3 className="text-sm font-light text-foreground">Material</h3>
          <p className="text-sm font-light text-muted-foreground">
            {getMaterialDescription()}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-light text-foreground">Dimensi</h3>
          <p className="text-sm font-light text-muted-foreground">
            {catalog.totalWeightGram.toFixed(2)}g (Total)
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-light text-foreground">Berat Bersih</h3>
          <p className="text-sm font-light text-muted-foreground">
            {catalog.netWeightGram.toFixed(2)}g
          </p>
        </div>

        {catalog.taraWeightGram && (
          <div className="space-y-2">
            <h3 className="text-sm font-light text-foreground">Berat Tara</h3>
            <p className="text-sm font-light text-muted-foreground">
              {catalog.taraWeightGram.toFixed(2)}g
            </p>
          </div>
        )}

        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-light text-foreground uppercase tracking-wider">
            Ketersediaan di Cabang
          </h3>
          <ul className="space-y-1">
            <li className="flex items-center gap-2 text-sm font-light text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              {catalog.branch.name} ({catalog.branch.area})
            </li>
            {catalog.quantity > 0 && (
              <li className="text-xs font-light text-muted-foreground mt-2">
                Stok tersedia: {catalog.quantity} unit
              </li>
            )}
          </ul>
          <Link
            href="/branches"
            className="inline-block text-xs font-light text-foreground underline underline-offset-4 mt-2 hover:text-muted-foreground transition-colors"
          >
            Lihat semua lokasi cabang
          </Link>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <button className="w-full h-12 bg-foreground text-background font-light rounded-none hover:bg-foreground/90 transition-colors">
          Hubungi Kami
        </button>
        <ReviewProduct />
      </div>
    </div>
  );
};

export default ProductInfo;
