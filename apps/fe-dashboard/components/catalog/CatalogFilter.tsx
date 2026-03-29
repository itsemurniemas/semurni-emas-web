"use client";
import React from "react";
import Checkbox from "@/components/form/input/Checkbox";
import Radio from "@/components/form/input/Radio";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { X, Filter } from "lucide-react";
import {
  APPROVED_PURPOSES,
  PRODUCT_TYPES,
  PRODUCT_CATEGORIES,
} from "@repo/core";

interface CatalogFilterProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedCategories: string[];
  toggleCategory: (value: string) => void;
  selectedTypes: string[];
  toggleType: (value: string) => void;
  selectedApprovedPurpose: string | null;
  setSelectedApprovedPurpose: (value: string | null) => void;
  selectedBranch: string | null;
  setSelectedBranch: (value: string | null) => void;
  branches: Array<{ id: string; name: string }>;
  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  isSuperAdmin: boolean;
  showPurposeFilter?: boolean;
}

const CatalogFilter: React.FC<CatalogFilterProps> = ({
  showFilters,
  setShowFilters,
  selectedCategories,
  toggleCategory,
  selectedTypes,
  toggleType,
  selectedApprovedPurpose,
  setSelectedApprovedPurpose,
  selectedBranch,
  setSelectedBranch,
  branches,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  clearFilters,
  hasActiveFilters,
  isSuperAdmin,
  showPurposeFilter = true,
}) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out xl:translate-x-0 xl:static xl:shadow-none xl:w-64 shrink-0 flex flex-col ${
        showFilters ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-5 flex justify-between items-center xl:hidden border-b border-gray-200 dark:border-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-white">Filter</h3>
        <button
          onClick={() => setShowFilters(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-5 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600 transition-colors mb-4"
          >
            <X size={14} />
            <span>Hapus semua filter</span>
          </button>
        )}

        {/* Branch Filter */}
        {isSuperAdmin && branches.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Cabang
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Radio
                  id="branch-all"
                  name="branch"
                  value=""
                  label="Semua Cabang"
                  checked={selectedBranch === null}
                  onChange={() => setSelectedBranch(null)}
                />
              </div>
              {branches.map((branch) => (
                <div key={branch.id} className="flex items-center gap-3">
                  <Radio
                    id={`branch-${branch.id}`}
                    name="branch"
                    value={branch.id}
                    label={branch.name}
                    checked={selectedBranch === branch.id}
                    onChange={() => setSelectedBranch(branch.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Kategori
          </h3>
          <div className="space-y-3">
            {PRODUCT_CATEGORIES.map((category) => (
              <div key={category.value} className="flex items-center gap-3">
                <Checkbox
                  checked={selectedCategories.includes(category.value)}
                  onChange={() => toggleCategory(category.value)}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {category.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Type Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Tipe Produk
          </h3>
          <div className="space-y-3">
            {PRODUCT_TYPES.map((type) => (
              <div key={type.value} className="flex items-center gap-3">
                <Checkbox
                  checked={selectedTypes.includes(type.value)}
                  onChange={() => toggleType(type.value)}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {type.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Approved Purpose Filter */}
        {showPurposeFilter && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Tujuan
            </h3>
            <div className="space-y-3">
              {APPROVED_PURPOSES.map((purpose) => (
                <div key={purpose.value} className="flex items-center gap-3">
                  <Radio
                    id={`purpose-${purpose.value}`}
                    name="approvedPurpose"
                    value={purpose.value}
                    label={purpose.label}
                    checked={selectedApprovedPurpose === purpose.value}
                    onChange={() => setSelectedApprovedPurpose(purpose.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price Range Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Rentang Harga
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                Harga Minimum (Rp)
              </label>
              <Input
                type="text"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                Harga Maksimum (Rp)
              </label>
              <Input
                type="text"
                placeholder="Tidak terbatas"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogFilter;
