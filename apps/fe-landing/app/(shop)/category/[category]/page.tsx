"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import CategoryHeader from "@/components/category/CategoryHeader";
import FilterSortBar from "@/components/category/FilterSortBar";
import CategoryProductGrid from "@/components/category/CategoryProductGrid";
import { useCategoryViewModel } from "./useCategoryViewModel";

const CategoryPage = () => {
  const params = useParams();
  const category = (params.category as string).toUpperCase();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    state,
    refetchCatalogs,
    branchListState,
    isSearching,
    categoryLabel,
  } = useCategoryViewModel(category);

  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1);
    const minPriceNum = minPrice
      ? parseInt(minPrice.replace(/\D/g, ""))
      : undefined;
    const maxPriceNum = maxPrice
      ? parseInt(maxPrice.replace(/\D/g, ""))
      : undefined;

    refetchCatalogs({
      minPrice: minPriceNum,
      maxPrice: maxPriceNum,
      branchId: selectedBranch || undefined,
      page: 1,
    });
    setFiltersOpen(false);
  };

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const minPriceNum = minPrice
      ? parseInt(minPrice.replace(/\D/g, ""))
      : undefined;
    const maxPriceNum = maxPrice
      ? parseInt(maxPrice.replace(/\D/g, ""))
      : undefined;

    refetchCatalogs({
      minPrice: minPriceNum,
      maxPrice: maxPriceNum,
      branchId: selectedBranch || undefined,
      page,
    });
  };

  const catalogCount =
    state.type === "success" && state.data ? state.data.total : 0;

  if (state.type === "error") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive font-light mb-4">
            Failed to load category
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

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16 section-container">
        <CategoryHeader category={categoryLabel || category} />

        <FilterSortBar
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
          itemCount={catalogCount}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          onApplyFilters={applyFilters}
          branches={
            branchListState.type === "success" ? branchListState.data : []
          }
          isLoading={state.type === "loading"}
        />

        <div className="pb-24">
          <CategoryProductGrid
            catalogs={
              state.type === "success" && state.data ? state.data.data : []
            }
            isLoading={state.type === "loading"}
            currentPage={currentPage}
            totalPages={
              state.type === "success" && state.data ? state.data.totalPages : 0
            }
            onPageChange={handlePageChange}
          />
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;
