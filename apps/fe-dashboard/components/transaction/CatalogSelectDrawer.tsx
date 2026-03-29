"use client";
import React, { useState, useEffect } from "react";
import {
  CatalogModel,
  CatalogListResponse,
  calculateCatalogPrice,
  formatPriceIDR,
} from "@repo/core";
import Input from "@/components/form/input/InputField";
import Pagination from "@/components/tables/Pagination";
import { Search, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";

interface CatalogSelectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  catalogs: CatalogModel[];
  onSelectCatalog: (catalog: CatalogModel) => void;
  onSearchCatalog?: (
    query: string,
    page: number,
    callback: (response: CatalogListResponse) => void,
  ) => void;
  isLoading?: boolean;
}

const CatalogSelectDrawer: React.FC<CatalogSelectDrawerProps> = ({
  isOpen,
  onClose,
  catalogs,
  onSelectCatalog,
  onSearchCatalog,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [apiResponse, setApiResponse] = useState<CatalogListResponse | null>(
    null,
  );

  // Fetch initial catalogs when drawer opens
  useEffect(() => {
    if (isOpen && !apiResponse && onSearchCatalog) {
      onSearchCatalog("", 1, (response: CatalogListResponse) => {
        setApiResponse(response);
      });
    }
  }, [isOpen]);

  // Display data from API response when searching, otherwise use initial catalogs
  const displayCatalogs = apiResponse?.data || catalogs;
  const totalPages = apiResponse?.totalPages || 1;
  const apiCurrentPage = apiResponse?.currentPage || 1;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);

    if (onSearchCatalog) {
      onSearchCatalog(value, 1, (response: CatalogListResponse) => {
        setApiResponse(response);
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    if (onSearchCatalog) {
      onSearchCatalog(searchQuery, page, (response: CatalogListResponse) => {
        setApiResponse(response);
      });
    }
  };

  const handleSelectCatalog = (catalog: CatalogModel) => {
    onSelectCatalog(catalog);
    setSearchQuery("");
    setCurrentPage(1);
    setApiResponse(null);
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="flex flex-col h-[90vh] max-h-[90vh]">
        {/* Header */}
        <DrawerHeader className="border-b border-gray-200 dark:border-gray-700 flex items-center justify-between p-4">
          <div className="flex-1">
            <DrawerTitle>Pilih Katalog</DrawerTitle>
          </div>
          <DrawerClose asChild>
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <X size={24} className="text-gray-600 dark:text-gray-400" />
            </button>
          </DrawerClose>
        </DrawerHeader>

        {/* Sticky Search Bar */}
        <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cari Katalog
            </label>
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                type="text"
                placeholder="Cari berdasarkan nama, cabang..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Menampilkan {displayCatalogs.length} katalog
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Catalog List */}
          {!isLoading && displayCatalogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayCatalogs.map((catalog) => {
                const price = calculateCatalogPrice(catalog);
                return (
                  <button
                    key={catalog.id}
                    onClick={() => handleSelectCatalog(catalog)}
                    className={`h-full text-left p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:shadow-md group flex flex-col ${catalog.quantity === 0 ? "opacity-50" : ""}`}
                  >
                    {/* Image Thumbnail */}
                    <div className="mb-3 w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden flex items-center justify-center relative">
                      {catalog.images && catalog.images.length > 0 ? (
                        <img
                          src={catalog.images[0].image || ""}
                          alt={catalog.displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 text-4xl">📷</div>
                      )}
                      {catalog.quantity === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-white font-bold text-center text-sm drop-shadow-lg">
                            Stok Habis
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 line-clamp-2">
                          {catalog.displayName}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                          {catalog.product?.name}
                        </p>
                      </div>
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 whitespace-nowrap shrink-0">
                        {catalog.quantity} Stok
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 text-xs mb-3 flex-1">
                      <span className="text-gray-500 dark:text-gray-400">
                        Cabang: {catalog.branch?.name}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        Berat: {catalog.netWeightGram}g
                      </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Harga/Unit
                      </p>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">
                        {formatPriceIDR(price)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : !isLoading && displayCatalogs.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? "Tidak ada katalog yang cocok dengan pencarian"
                  : "Belum ada katalog tersedia"}
              </p>
            </div>
          ) : null}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex justify-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <Pagination
                currentPage={apiCurrentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CatalogSelectDrawer;
