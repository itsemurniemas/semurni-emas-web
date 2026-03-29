"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import CatalogImageGallery from "@/components/catalog/CatalogImageGallery";
import CatalogInfo from "@/components/catalog/CatalogInfo";
import CatalogDescription from "@/components/catalog/CatalogDescription";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useCatalogDetailViewModel } from "./useCatalogDetailViewModel";
import ProductCarousel from "@/components/content/ProductCarousel";

const CatalogDetailPage = () => {
  const params = useParams();
  const catalogId = params.catalogId as string;
  const { state, catalog, categoryLabel } =
    useCatalogDetailViewModel(catalogId);

  if (state.type === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-foreground font-light">Loading catalog...</p>
        </div>
      </div>
    );
  }

  if (state.type === "error") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive font-light mb-4">
            Failed to load catalog
          </p>
          <p className="text-muted-foreground text-sm">{state.message}</p>
          <Link
            href="/"
            className="inline-block mt-6 px-6 py-2 bg-foreground text-background font-light rounded"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (state.type !== "success" || !catalog) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16 pb-24 section-container">
        <section className="w-full">
          {/* Breadcrumb - Show above image on smaller screens */}
          <div className="lg:hidden mb-6">
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
                    <Link href={`/category/${catalog.category}`}>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <CatalogImageGallery catalog={catalog} />

            <div className="lg:pl-12 mt-8 lg:mt-0 lg:sticky lg:top-24 lg:h-fit">
              <CatalogInfo catalog={catalog} categoryLabel={categoryLabel} />
            </div>
          </div>
        </section>

        {/* Catalog Description Section */}
        <section className="w-full mt-8 lg:mt-16">
          <CatalogDescription catalog={catalog} />
        </section>

        {/* Related Products Section */}
        <section className="w-full mt-12 lg:mt-24">
          <ProductCarousel
            category={catalog.category}
            title="Produk Sejenis Lainnya"
            description={`Temukan lebih banyak ${categoryLabel} yang kami tawarkan dengan koleksi lengkap kami.`}
            paddingVertical="py-0"
            paddingHorizontal="px-0"
            headingGap="mb-6"
            useContainer={false}
          />
        </section>
      </main>
    </div>
  );
};

export default CatalogDetailPage;
