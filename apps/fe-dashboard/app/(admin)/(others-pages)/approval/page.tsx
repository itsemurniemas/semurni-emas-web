"use client";
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import CatalogFilter from "../../../../components/catalog/CatalogFilter";
import Pagination from "@/components/tables/Pagination";
import Select from "@/components/form/Select";
import { Filter, Plus, CheckCircle2, ChevronDown } from "lucide-react";
import { useApprovalViewModel } from "./useApprovalViewModel";
import {
  CatalogModel,
  calculateCatalogPrice,
  ApproveCatalog,
  APPROVED_PURPOSES,
} from "@repo/core";
import { useAuth, isSuperAdminRole } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";
import { toast } from "react-toastify";
import { AlertDialogDrawer } from "@/components/dialogDrawer";

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

const ApprovalPage: React.FC = () => {
  const {
    state,
    refetchApprovals,
    branchListState,
    currentPage,
    setCurrentPage,
    apiCurrentPage,
  } = useApprovalViewModel();
  const { user } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [showApprovalConfirm, setShowApprovalConfirm] = useState(false);
  const [approvalInProgress, setApprovalInProgress] = useState<string | null>(
    null,
  );

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedApprovedPurpose, setSelectedApprovedPurpose] = useState<
    string | null
  >(null);
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [approvalSelections, setApprovalSelections] = useState<
    Record<string, string | null>
  >({});

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle filters and search change - reset to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedBranch,
    debouncedSearch,
    selectedTypes,
    selectedCategories,
    minPrice,
    maxPrice,
  ]);

  // Handle page change and refetch approvals
  useEffect(() => {
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

    refetchApprovals({
      page: currentPage,
      type: typeParam,
      category: categoryParam,
      minPrice: minPriceNum,
      maxPrice: maxPriceNum,
      branchId: selectedBranch || undefined,
      search: debouncedSearch || undefined,
      approvedPurpose: "null",
      limit: 10,
    });
  }, [
    currentPage,
    selectedTypes,
    selectedCategories,
    minPrice,
    maxPrice,
    selectedBranch,
    debouncedSearch,
  ]);

  const itemsPerPage = 10;

  const convertApprovalsToDisplay = (
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

  const approvalProducts =
    state.type === "success" && state.data ? state.data.data : [];
  const products = convertApprovalsToDisplay(approvalProducts);

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
    setSelectedBranch(null);
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
      <AlertDialogDrawer
        open={showApprovalConfirm}
        setOpen={setShowApprovalConfirm}
        type="warning"
        title="Konfirmasi Persetujuan Produk"
        description={
          approvalInProgress
            ? `Apakah Anda yakin ingin menyetujui produk ini dengan tujuan "${
                approvalSelections[approvalInProgress] === "SELLING"
                  ? "Penjualan"
                  : approvalSelections[approvalInProgress] === "PROCESS"
                    ? "Proses"
                    : approvalSelections[approvalInProgress] === "SHOT"
                      ? "Tembakan"
                      : "Stok"
              }"?`
            : ""
        }
        buttonText="Ya, Setujui"
        onConfirm={async () => {
          if (!approvalInProgress) return;
          try {
            const product = products.find((p) => p.id === approvalInProgress);
            const useCase = new ApproveCatalog(
              getApiConfigForRole(user?.role || null),
            );
            await useCase.execute({
              id: approvalInProgress,
              request: {
                approvedPurpose: approvalSelections[approvalInProgress] as
                  | "SELLING"
                  | "PROCESS"
                  | "SHOT"
                  | "STOCK",
              },
            });
            toast.success(`Produk ${product?.displayName} berhasil disetujui`);
            // Refresh the list
            refetchApprovals();
            // Reset selection
            setApprovalInProgress(null);
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "Gagal menyetujui produk",
            );
          }
        }}
      />

      <PageBreadcrumb pageTitle="Persetujuan Produk" />

      {/* Error State */}
      {state.type === "error" && (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400 mb-4">
            Error loading approvals: {state.message}
          </p>
          <button
            onClick={() => refetchApprovals()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Main Content - Visible in all states except error and initiate */}
      {state.type !== "error" && state.type !== "initiate" && (
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
              showPurposeFilter={false}
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

                {/* Search + CTA Row (tablet/desktop) */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:flex-1 h-10 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />

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
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Menampilkan{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {state.type === "success" ? state.data.total : 0}
                  </span>{" "}
                  produk
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {/* Product cards */}
                {paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col"
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
                    </div>

                    <div className="p-2 sm:p-3 lg:p-4 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xs sm:text-sm lg:text-sm xl:text-base font-semibold text-gray-900 dark:text-white mb-1">
                            {product.displayName}
                          </h3>
                          {product.productType === "NON_GOLD" ? (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              <span>{product.type}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <span>{product.type}</span>
                              <span>•</span>
                              <span>{product.carat}</span>
                            </div>
                          )}
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 whitespace-nowrap">
                          {product.stock} Barang
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

                      <div className="mt-auto pt-2 sm:pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex gap-2 items-center\">
                          <div className="flex-1 relative">
                            <Select
                              value={approvalSelections[product.id] ?? ""}
                              onChange={(value) =>
                                setApprovalSelections((prev) => ({
                                  ...prev,
                                  [product.id]: value || null,
                                }))
                              }
                              options={APPROVED_PURPOSES}
                              placeholder="Pilih Tujuan"
                              className="pr-8!"
                            />
                            <ChevronDown
                              size={18}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none"
                            />
                          </div>
                          <Button
                            size="sm"
                            variant="success"
                            disabled={!approvalSelections[product.id]}
                            onClick={() => {
                              setApprovalInProgress(product.id);
                              setShowApprovalConfirm(true);
                            }}
                            className="h-11 px-2 flex items-center justify-center"
                          >
                            <CheckCircle2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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

export default ApprovalPage;
