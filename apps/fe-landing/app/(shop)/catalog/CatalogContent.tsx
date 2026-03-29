"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/ui/PageHeader";
import { useCatalogViewModel } from "./useCatalogViewModel";
import Pagination from "@/components/Pagination";
import {
  CatalogModel,
  calculateCatalogPrice,
  PRODUCT_TYPES,
  PRODUCT_CATEGORIES,
} from "@repo/core";
import { useDeviceAwareSearch } from "@/hooks/useDeviceAwareSearch";
import { ShimmerOverlay } from "@/components/ShimmerOverlay";

interface Product {
  id: number;
  catalogId: string;
  name: string;
  category: "jewelry" | "bar" | "metal";
  metalType: string;
  carat?: string;
  price: number;
  priceDisplay: string;
  image: string | null;
  productType: string;
  stock: number;
}

const CatalogContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    state,
    refetchCatalogs,
    branchListState,
    isSearching: isApiFetching,
    currentPage,
    setCurrentPage,
  } = useCatalogViewModel();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [hasInitializedFilters, setHasInitializedFilters] = useState(false);

  // Track previous filter values to detect actual changes
  const prevFiltersRef = useRef<string | null>(null);

  // Initialize filters from query parameters
  useEffect(() => {
    if (hasInitializedFilters) return;

    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
      setHasInitializedFilters(true);
    } else {
      setHasInitializedFilters(true);
    }
  }, [searchParams, hasInitializedFilters]);

  // Memoize the search callback to prevent infinite re-renders
  // Search is independent of branch/type/category filters
  const handleSearch = useCallback(
    (query: string) => {
      setCurrentPage(1);
      // Send search query to API
      refetchCatalogs({
        search: query || undefined,
        page: 1,
      });
    },
    [refetchCatalogs, setCurrentPage],
  );

  // Refetch catalogs when filters change (type, category, price, branch)
  useEffect(() => {
    // Create a stringified key of current filters
    const filterKey = JSON.stringify({
      types: selectedTypes,
      categories: selectedCategories,
      minPrice,
      maxPrice,
      branch: selectedBranch,
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

    // Update filter key
    prevFiltersRef.current = filterKey;

    // Now fetch with the new filters
    setCurrentPage(1);
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
      type: typeParam,
      category: categoryParam,
      minPrice: minPriceNum,
      maxPrice: maxPriceNum,
      branchId: selectedBranch || undefined,
      page: 1,
    });
  }, [
    selectedTypes,
    selectedCategories,
    minPrice,
    maxPrice,
    selectedBranch,
    refetchCatalogs,
    setCurrentPage,
  ]);

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
    isApiFetching,
  });

  const convertCatalogsToProducts = (catalogs: CatalogModel[]): Product[] => {
    return catalogs.map((catalog, index) => {
      const metalType = getMaterialType(catalog.product.productType);
      const price = getProductPrice(catalog);

      return {
        id: index + 1,
        catalogId: catalog.id,
        name: catalog.displayName,
        category: getCategoryFromProductType(catalog.product.productType),
        metalType: metalType,
        carat: getCarat(catalog.product),
        price: price,
        priceDisplay: `Rp ${price.toLocaleString("id-ID")}`,
        image:
          catalog.images.length > 0 && catalog.images[0]?.image
            ? catalog.images[0].image
            : null,
        productType: catalog.product.productType,
        stock: catalog.quantity || 0,
      };
    });
  };

  const getMaterialType = (productType: string): string => {
    const mapping: Record<string, string> = {
      GOLD_JEWELRY: "gold",
      GOLD_BAR: "gold",
      NON_GOLD: "silver",
    };
    return mapping[productType] || "gold";
  };

  const getCategoryFromProductType = (
    productType: string,
  ): "jewelry" | "bar" | "metal" => {
    const mapping: Record<string, "jewelry" | "bar" | "metal"> = {
      GOLD_JEWELRY: "jewelry",
      GOLD_BAR: "bar",
      NON_GOLD: "metal",
    };
    return mapping[productType] || "metal";
  };

  const getCarat = (product: any): string | undefined => {
    if (product.goldJewelryItem) {
      const match = product.name.match(/K(\d+)/);
      return match ? `${match[1]}K` : "24K";
    }
    if (product.nonGoldItem) {
      return "999";
    }
    return undefined;
  };

  const getProductPrice = (catalog: CatalogModel): number => {
    return calculateCatalogPrice(catalog);
  };

  const catalogProducts =
    state.type === "success" && state.data ? state.data.data : [];
  const products = convertCatalogsToProducts(catalogProducts);

  const toggleCategory = (value: string) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const toggleType = (value: string) => {
    setSelectedTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const filteredProducts = products; // No client-side filtering needed, API handles it

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedTypes.length > 0 ||
    minPrice ||
    maxPrice ||
    selectedBranch !== null;

  const activeFilterCount =
    selectedCategories.length +
    selectedTypes.length +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (selectedBranch ? 1 : 0);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTypes([]);
    setMinPrice("");
    setMaxPrice("");
    setSelectedBranch(null); // Reset to "Semua Cabang"
  };

  const formatPriceInput = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";
    return new Intl.NumberFormat("id-ID").format(parseInt(numbers));
  };

  if (state.type === "loading" || state.type === "initiate") {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-16 pb-24 section-container">
          <PageHeader
            title="Katalog"
            description="Jelajahi koleksi emas dan logam mulia kami"
          />
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-muted rounded w-32"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-square bg-muted rounded-lg"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (state.type === "error") {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-16 pb-24 section-container">
          <PageHeader
            title="Katalog"
            description="Jelajahi koleksi emas dan logam mulia kami"
          />
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-red-700 mb-4">
              Error loading catalogs: {state.message}
            </p>
            <button
              onClick={() => refetchCatalogs()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16 pb-24 section-container">
        {/* Page Header */}
        <PageHeader
          title="Katalog"
          description="Jelajahi koleksi emas dan logam mulia kami"
        />

        {/* Filter Toggle (Mobile) */}
        <div className="mb-4 lg:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-light text-foreground border border-border rounded-lg px-4 py-2"
          >
            <Filter size={16} />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="bg-foreground text-background text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-64 shrink-0 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="sticky top-24 space-y-6">
              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={14} />
                  <span>Hapus semua filter</span>
                </button>
              )}

              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-normal text-foreground mb-3">
                  Kategori
                </h3>
                <div className="space-y-3">
                  {PRODUCT_CATEGORIES.map((category) => (
                    <div
                      key={category.value}
                      className="flex items-center space-x-3"
                    >
                      <Checkbox
                        id={`category-${category.value}`}
                        checked={selectedCategories.includes(category.value)}
                        onCheckedChange={() => toggleCategory(category.value)}
                      />
                      <label
                        htmlFor={`category-${category.value}`}
                        className="text-sm font-light text-foreground cursor-pointer"
                      >
                        {category.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Type Filter */}
              <div>
                <h3 className="text-sm font-normal text-foreground mb-3">
                  Tipe Produk
                </h3>
                <div className="space-y-3">
                  {PRODUCT_TYPES.map((type) => (
                    <div
                      key={type.value}
                      className="flex items-center space-x-3"
                    >
                      <Checkbox
                        id={`type-${type.value}`}
                        checked={selectedTypes.includes(type.value)}
                        onCheckedChange={() => toggleType(type.value)}
                      />
                      <label
                        htmlFor={`type-${type.value}`}
                        className="text-sm font-light text-foreground cursor-pointer"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Branch Filter */}
              {branchListState.type === "success" &&
                branchListState.data &&
                branchListState.data.length > 0 && (
                  <div>
                    <h3 className="text-sm font-normal text-foreground mb-3">
                      Cabang
                    </h3>
                    <RadioGroup
                      value={selectedBranch || "all"}
                      onValueChange={(value) =>
                        setSelectedBranch(value === "all" ? null : value)
                      }
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="all" id="branch-all" />
                        <label
                          htmlFor="branch-all"
                          className="text-sm font-light text-foreground cursor-pointer"
                        >
                          Semua Cabang
                        </label>
                      </div>
                      {branchListState.data.map((branch) => (
                        <div
                          key={branch.id}
                          className="flex items-center space-x-3"
                        >
                          <RadioGroupItem
                            value={branch.id}
                            id={`branch-${branch.id}`}
                          />
                          <label
                            htmlFor={`branch-${branch.id}`}
                            className="text-sm font-light text-foreground cursor-pointer"
                          >
                            {branch.name}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

              {/* Price Range Filter */}
              <div>
                <h3 className="text-sm font-normal text-foreground mb-3">
                  Rentang Harga
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-light text-muted-foreground mb-1 block">
                      Harga Minimum (Rp)
                    </label>
                    <Input
                      type="text"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) =>
                        setMinPrice(formatPriceInput(e.target.value))
                      }
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-light text-muted-foreground mb-1 block">
                      Harga Maksimum (Rp)
                    </label>
                    <Input
                      type="text"
                      placeholder="Tidak terbatas"
                      value={maxPrice}
                      onChange={(e) =>
                        setMaxPrice(formatPriceInput(e.target.value))
                      }
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-6">
              <label className="block text-sm font-normal text-foreground mb-2">
                Cari Produk
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative flex items-center">
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyboardEvent}
                    className="w-full h-10 px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />

                  {/* Search Clear Button - visible when has text */}
                  {searchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-2 h-10 px-2 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                      title="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Search Button - only visible on mobile/tablet */}
                {!isDesktop && (
                  <button
                    onClick={handleSearchSubmit}
                    disabled={isSearching}
                    className="h-10 px-4 flex items-center justify-center gap-2 bg-black hover:bg-black/80 disabled:bg-muted text-white rounded-lg transition-colors font-medium text-sm"
                    title="Search products"
                  >
                    {isSearching ? (
                      <span className="inline-block w-3 h-3 border-2 border-transparent border-t-white border-r-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Search size={16} />
                        <span>Cari</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <p className="text-sm font-light text-muted-foreground mb-6">
              Menampilkan {filteredProducts.length} produk
            </p>

            <div className="relative">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => router.push(`/catalog/${product.catalogId}`)}
                    className={`group cursor-pointer ${product.stock === 0 ? "opacity-50" : ""}`}
                  >
                    {/* Product Image - Thumbnail */}
                    <div className="aspect-square bg-muted mb-3 overflow-hidden rounded-lg relative flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center text-muted-foreground text-4xl">
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

                    {/* Product Info */}
                    <h3 className="text-sm font-normal text-foreground mb-1 group-hover:text-muted-foreground transition-colors">
                      {product.name}
                    </h3>
                    {product.productType === "NON_GOLD" ? (
                      <div className="text-xs font-light text-muted-foreground mb-1">
                        <span>Logam lainnya</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs font-light text-muted-foreground mb-1">
                        <span>
                          {product.productType === "GOLD_JEWELRY" ||
                          product.productType === "GOLD_BAR"
                            ? "Emas"
                            : "Logam"}
                        </span>
                        {product.carat && (
                          <>
                            <span>•</span>
                            <span>{product.carat}</span>
                          </>
                        )}
                      </div>
                    )}
                    <p className="text-sm font-light text-foreground">
                      {product.priceDisplay}
                    </p>
                  </div>
                ))}
                <ShimmerOverlay isVisible={isApiFetching} />
              </div>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground font-light">
                  Tidak ada produk yang sesuai dengan filter Anda.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm font-light text-foreground underline hover:no-underline"
                >
                  Hapus semua filter
                </button>
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && state.type === "success" && (
              <div className="flex justify-center mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={state.data.totalPages || 1}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CatalogContent;
