"use client";
import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import CatalogFilter from "../../../../components/catalog/CatalogFilter";
import Pagination from "@/components/tables/Pagination";
import Select from "@/components/form/Select";
import { Filter, Plus, Search, X } from "lucide-react";
import { useCatalogViewModel } from "./useCatalogViewModel";
import { CatalogModel, calculateCatalogPrice } from "@repo/core";
import { useAuth, isSuperAdminRole } from "@/context/AuthContext";
import { useDeviceAwareSearch } from "@/hooks/useDeviceAwareSearch";
import { ShimmerOverlay } from "@/components/ShimmerOverlay";

interface DisplayProduct {
  id: string;
  name: string;
  type: string;
  category: "bar" | "jewelry" | "metal";
  metalType: string;
  carat?: string;
  price: number;
  weight: number;
  stock: number;
  quantity: number;
  displayName: string;
  productType: string;
  branch: string;
  image: string | null;
  thumbnail: string | null;
}

const CatalogPage: React.FC = () => {
  const router = useRouter();
  const {
    state,
    refetchCatalogs,
    branchListState,
    currentPage,
    setCurrentPage,
    apiCurrentPage,
    isSearching: isApiFetching,
  } = useCatalogViewModel();
  const { user } = useAuth();
  const [showFilters, setShowFilters] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedApprovedPurpose, setSelectedApprovedPurpose] = useState<
    string | null
  >(null);
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // Track previous filter values to detect actual changes
  const prevFiltersRef = useRef<string | null>(null);

  // Memoize the search callback to prevent infinite re-renders
  const handleSearch = useCallback(
    (query: string) => {
      setDebouncedSearch(query);
      setCurrentPage(1);
    },
    [setCurrentPage],
  );

  // Device-aware search with debounce for desktop, manual search for mobile/tablet
  const {
    searchQuery,
    setSearchQuery,
    handleSearchSubmit,
    handleKeyboardEvent,
    handleClearSearch,
    isDesktop,
    isSearching,
  } = useDeviceAwareSearch({
    debounceDelay: 500,
    onSearch: handleSearch,
  });

  // Consolidated filter and page effect - detects actual changes and fetches
  useEffect(() => {
    // Create a stringified key of current filters
    const filterKey = JSON.stringify({
      types: selectedTypes,
      categories: selectedCategories,
      minPrice,
      maxPrice,
      branch: selectedBranch,
      search: debouncedSearch,
      purpose: selectedApprovedPurpose,
    });

    // On first run, just store the filter key without fetching
    if (prevFiltersRef.current === null) {
      prevFiltersRef.current = filterKey;
      return;
    }

    // Skip if filters haven't changed
    if (prevFiltersRef.current === filterKey) {
      return;
    }

    // Update filter key and reset to page 1
    prevFiltersRef.current = filterKey;
    setCurrentPage(1);

    // Now fetch with the new filters (use page 1 since we just reset)
    const typeParam =
      selectedTypes.length > 0 ? selectedTypes.join(",") : undefined;
    const categoryParam =
      selectedCategories.length > 0 ? selectedCategories.join(",") : undefined;
    const minPriceNum = minPrice
      ? parseInt(minPrice.replace(/\D/g, ""))
      : undefined;
    const maxPriceNum = maxPrice
      ? parseInt(maxPrice.replace(/\D/g, ""))
      : undefined;

    refetchCatalogs({
      page: 1,
      type: typeParam,
      category: categoryParam,
      minPrice: minPriceNum,
      maxPrice: maxPriceNum,
      branchId: selectedBranch || undefined,
      search: debouncedSearch || undefined,
      approvedPurpose: selectedApprovedPurpose as
        | "SELLING"
        | "PROCESS"
        | "SHOT"
        | "STOCK"
        | undefined,
      limit: 10,
    });
  }, [
    selectedTypes,
    selectedCategories,
    minPrice,
    maxPrice,
    selectedBranch,
    debouncedSearch,
    selectedApprovedPurpose,
  ]);

  // Handle page change only (pagination)
  useEffect(() => {
    if (currentPage === 1) return; // Skip if resetting to page 1

    const typeParam =
      selectedTypes.length > 0 ? selectedTypes.join(",") : undefined;
    const categoryParam =
      selectedCategories.length > 0 ? selectedCategories.join(",") : undefined;
    const minPriceNum = minPrice
      ? parseInt(minPrice.replace(/\D/g, ""))
      : undefined;
    const maxPriceNum = maxPrice
      ? parseInt(maxPrice.replace(/\D/g, ""))
      : undefined;

    refetchCatalogs({
      page: currentPage,
      type: typeParam,
      category: categoryParam,
      minPrice: minPriceNum,
      maxPrice: maxPriceNum,
      branchId: selectedBranch || undefined,
      search: debouncedSearch || undefined,
      approvedPurpose: selectedApprovedPurpose as
        | "SELLING"
        | "PROCESS"
        | "SHOT"
        | "STOCK"
        | undefined,
      limit: 10,
    });
  }, [currentPage]);

  const itemsPerPage = 10;

  // Map category to display name
  const getCategoryDisplayName = (
    category: "bar" | "jewelry" | "metal",
  ): string => {
    const categoryMap: Record<"bar" | "jewelry" | "metal", string> = {
      bar: "Emas Batangan",
      jewelry: "Perhiasan Emas",
      metal: "Logam Lainnya",
    };
    return categoryMap[category] || category;
  };

  const convertCatalogsToDisplay = (
    catalogs: CatalogModel[],
  ): DisplayProduct[] => {
    return catalogs.map((catalog) => {
      const productType = catalog.product.productType;
      const category =
        productType === "GOLD_JEWELRY"
          ? "jewelry"
          : productType === "GOLD_BAR"
            ? "bar"
            : "metal";

      let metalType = "gold";
      if (productType === "NON_GOLD") {
        const productName = catalog.product.name.toLowerCase();
        if (productName.includes("silver")) metalType = "silver";
        else if (productName.includes("platinum")) metalType = "platinum";
        else if (productName.includes("palladium")) metalType = "palladium";
      }

      let price = 0;
      if (catalog.product.goldJewelryItem) {
        price =
          (catalog.product.goldJewelryItem.sellPricePerGram || 0) *
          catalog.netWeightGram;
      } else if (
        catalog.product.nonGoldItem &&
        catalog.product.nonGoldItem.highQualitySellPricePerGram
      ) {
        price =
          catalog.product.nonGoldItem.highQualitySellPricePerGram *
          catalog.netWeightGram;
      }

      // Use helper function for consistent price calculation
      price = calculateCatalogPrice(catalog);

      const firstImage =
        catalog.images.length > 0 ? catalog.images[0]?.image : null;

      return {
        id: catalog.id,
        name: catalog.product.name,
        type:
          productType === "GOLD_JEWELRY"
            ? "Perhiasan Emas"
            : productType === "GOLD_BAR"
              ? "Emas Batangan"
              : "Logam Lainnya",
        category: category,
        metalType: metalType,
        carat:
          productType === "GOLD_JEWELRY"
            ? catalog.product.name.match(/K(\d+)/)?.[1] + "K"
            : "999",
        price: price,
        weight: catalog.totalWeightGram,
        stock: catalog.quantity,
        quantity: catalog.quantity,
        displayName: catalog.displayName,
        productType: productType,
        branch: catalog.branch.name,
        image: firstImage,
        thumbnail: firstImage,
      };
    });
  };

  const catalogProducts =
    state.type === "success" && state.data ? state.data.data : [];
  const products = convertCatalogsToDisplay(catalogProducts);

  const toggleCategory = (value: string) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
    setCurrentPage(1);
  };

  const toggleType = (value: string) => {
    setSelectedTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTypes([]);
    setMinPrice("");
    setMaxPrice("");
    setSelectedApprovedPurpose(null);
    setSelectedBranch(null); // Reset to "Semua Cabang"
    setCurrentPage(1);
  };

  const totalPages = state.type === "success" ? state.data.totalPages : 0;
  const paginatedProducts = products;

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedTypes.length > 0 ||
    minPrice !== "" ||
    maxPrice !== "" ||
    selectedApprovedPurpose !== null ||
    selectedBranch !== null;

  return (
    <div>
      <PageBreadcrumb pageTitle="Katalog Produk" />

      {/* Loading State */}
      {(state.type === "loading" || state.type === "initiate") && (
        <div className="space-y-6 animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-80"
              ></div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {state.type === "error" && (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400 mb-4">
            Error loading catalogs: {state.message}
          </p>
          <button
            onClick={() => refetchCatalogs()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Success State */}
      {state.type === "success" && (
        <>
          <div className="flex flex-col xl:flex-row gap-6">
            {/* Filters Sidebar */}
            <CatalogFilter
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              selectedTypes={selectedTypes}
              toggleType={toggleType}
              selectedApprovedPurpose={selectedApprovedPurpose}
              setSelectedApprovedPurpose={setSelectedApprovedPurpose}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              branches={
                branchListState.type === "success" && branchListState.data
                  ? branchListState.data
                  : []
              }
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              clearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
              isSuperAdmin={isSuperAdminRole(user?.role)}
            />

            {showFilters && (
              <div
                className="fixed inset-0 bg-black/50 z-40 xl:hidden"
                onClick={() => setShowFilters(false)}
              />
            )}

            {/* Main Content */}
            <div className="flex-1">
              <div className="mb-6">
                {/* Label for search */}
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cari Produk
                </label>

                {/* Search + CTA Row */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Search Input Container */}
                  <div className="flex-1 relative flex gap-2">
                    <input
                      type="text"
                      placeholder="Cari berdasarkan nama produk..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyboardEvent}
                      className="w-full h-10 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />

                    {/* Search Clear Button - visible when has text */}
                    {searchQuery && (
                      <button
                        onClick={handleClearSearch}
                        className="h-10 px-3 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Clear search"
                      >
                        <X size={18} />
                      </button>
                    )}

                    {/* Search Button - only visible on mobile/tablet */}
                    {!isDesktop && (
                      <button
                        onClick={handleSearchSubmit}
                        disabled={isSearching}
                        className="h-10 px-4 flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium text-sm md:hidden"
                        title="Search catalogs"
                      >
                        {isSearching ? (
                          <span className="inline-flex items-center gap-1">
                            <span className="inline-block w-3 h-3 border-2 border-transparent border-t-white border-r-white rounded-full animate-spin"></span>
                          </span>
                        ) : (
                          <>
                            <Search size={16} />
                            <span>Cari</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* CTA on right of search (tablet/desktop) */}
                  <div className="hidden md:flex md:gap-3 md:items-center">
                    <Button
                      size="xs"
                      variant={hasActiveFilters ? "primary" : "outline"}
                      onClick={() => setShowFilters(true)}
                      className="h-10 flex items-center gap-2 xl:hidden"
                    >
                      <Filter size={16} />
                      <span>Filter</span>
                      {hasActiveFilters && (
                        <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-white/20">
                          {selectedCategories.length +
                            selectedTypes.length +
                            (minPrice ? 1 : 0) +
                            (maxPrice ? 1 : 0) +
                            (selectedApprovedPurpose ? 1 : 0) +
                            (selectedBranch ? 1 : 0)}
                        </span>
                      )}
                    </Button>
                    <Link href="/catalog/add">
                      <Button
                        size="xs"
                        className="h-10 flex items-center gap-2"
                      >
                        {/* Tablet label only */}
                        <span className="md:inline lg:hidden">
                          Tambah Katalog
                        </span>
                        {/* Desktop: plus icon + Tambah Katalog */}
                        <>
                          <Plus size={16} className="hidden lg:inline-block" />
                          <span className="hidden lg:inline">
                            Tambah Katalog
                          </span>
                        </>
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Mobile actions under search */}
                <div className="mt-4 md:mt-0 flex flex-col gap-3 md:hidden">
                  <Button
                    size="xs"
                    variant={hasActiveFilters ? "primary" : "outline"}
                    onClick={() => setShowFilters(true)}
                    className="h-10 flex items-center justify-center gap-2"
                  >
                    <Filter size={16} />
                    <span>Filter</span>
                    {hasActiveFilters && (
                      <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-white/20">
                        {selectedCategories.length +
                          selectedTypes.length +
                          (minPrice ? 1 : 0) +
                          (maxPrice ? 1 : 0) +
                          (selectedApprovedPurpose ? 1 : 0) +
                          (selectedBranch ? 1 : 0)}
                      </span>
                    )}
                  </Button>
                  <Link href="/catalog/add">
                    <Button
                      className="h-10 w-full flex items-center gap-2"
                      size="xs"
                    >
                      <Plus size={16} />
                      <span>Tambah Katalog</span>
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Menampilkan{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {state.type === "success" ? state.data.total : 0}
                  </span>{" "}
                  produk
                </p>
              </div>

              <div className="relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {paginatedProducts.map((product) => (
                    <Link
                      href={`/catalog/detail/${product.id}`}
                      key={product.id}
                      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-lg hover:border-brand-300 dark:hover:border-brand-600 transition-all duration-300 flex flex-col cursor-pointer ${product.stock === 0 ? "opacity-50" : ""}`}
                    >
                      {/* Product Image */}
                      <div className="relative h-24 sm:h-32 lg:h-40 w-full bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex items-center justify-center text-gray-400 text-4xl">
                            📷
                          </div>
                        )}
                        {product.stock === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-white font-bold text-center text-lg drop-shadow-lg">
                              Stok Habis
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-2 sm:p-3 lg:p-4 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xs sm:text-sm lg:text-sm xl:text-base font-semibold text-gray-900 dark:text-white mb-1">
                              {product.displayName}
                            </h3>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {getCategoryDisplayName(product.category)} •{" "}
                              {product.name}
                            </div>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 whitespace-nowrap">
                            {product.stock} Stok
                          </span>
                        </div>

                        <div className="mt-2 sm:mt-3 flex items-end justify-between">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                              Harga
                            </p>
                            <p className="text-xs sm:text-sm lg:text-sm xl:text-base font-bold text-gray-900 dark:text-white">
                              Rp {product.price.toLocaleString("id-ID")}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-right text-gray-500 dark:text-gray-400 mb-1">
                              Berat
                            </p>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-right">
                              {product.weight}g
                            </p>
                          </div>
                        </div>

                        <div
                          className="mt-auto pt-2 sm:pt-3 border-t border-gray-100 dark:border-gray-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              router.push(`/catalog/edit/${product.id}`);
                            }}
                            className="w-full py-1.5 px-3 border border-transparent rounded-lg shadow-sm text-xs sm:text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <ShimmerOverlay isVisible={isApiFetching} />
              </div>

              {products.length === 0 && (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">
                    Tidak ada produk yang ditemukan.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-2 text-brand-600 hover:text-brand-700 font-medium"
                  >
                    Hapus filter
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CatalogPage;
