"use client";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Plus, Search, X } from "lucide-react";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import CustomerCreateDrawer from "@/components/transaction/CustomerCreateDrawer";
import {
  CustomerModel,
  DataViewState,
  getCustomerDisplayName,
  CreateCustomer,
  type CreateCustomerRequest,
} from "@repo/core";
import { useAuth } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";
import type { NewCustomer } from "../types";

interface CustomerSelectionStepProps {
  selected: CustomerModel | null;
  customerState: DataViewState<CustomerModel[]>;
  onSelect: (customer: CustomerModel | null) => void;
  onSearchChange: (query: string) => void;
  onCreateNew?: () => void;
}

const CustomerSelectionStep: React.FC<CustomerSelectionStepProps> = ({
  selected,
  customerState,
  onSelect,
  onSearchChange,
  onCreateNew,
}) => {
  const { user } = useAuth();
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [customerOptions, setCustomerOptions] = useState<CustomerModel[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (customerState.type === "success" && customerState.data) {
      // Filter out empty customer records (no name)
      const validCustomers = customerState.data.filter(
        (customer) => customer.name && customer.name.trim(),
      );
      setCustomerOptions(validCustomers);
    }
  }, [customerState]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showDropdown]);

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
    onSearchChange(value);
    setShowDropdown(true);
  };

  const handleSelectCustomer = (customer: CustomerModel) => {
    onSelect(customer);
    setSearchInput(getCustomerDisplayName(customer));
    setShowDropdown(false);
  };

  const handleCreateCustomer = async (newCustomer: NewCustomer) => {
    if (!newCustomer.name.trim()) {
      toast.error("Nama pelanggan harus diisi");
      return;
    }

    if (!user) {
      toast.error("User tidak ditemukan");
      return;
    }

    setIsCreatingCustomer(true);
    try {
      const request: CreateCustomerRequest = {
        name: newCustomer.name,
        telp: newCustomer.telp || "",
        idCardNumber: newCustomer.idCardNumber || "",
        birthDate: newCustomer.birthDate || 0,
        city: newCustomer.city || "",
        province: newCustomer.province || "",
        subdistrict: newCustomer.subdistrict || "",
        ward: newCustomer.ward || "",
        postalCode: newCustomer.postalCode || "",
        fullAddress: newCustomer.fullAddress || "",
        shortAddress: newCustomer.shortAddress || "",
        isMember: newCustomer.isMember || false,
        ...(newCustomer.instagram && { instagram: newCustomer.instagram }),
        ...(newCustomer.tiktok && { tiktok: newCustomer.tiktok }),
        ...(newCustomer.email && { email: newCustomer.email }),
        ...(newCustomer.image && { image: newCustomer.image }),
      };

      const useCase = new CreateCustomer(
        getApiConfigForRole(user.role || null),
      );
      const createdCustomer = await useCase.execute(request);

      // Select the newly created customer (which has an id)
      onSelect(createdCustomer);
      setSearchInput(createdCustomer.name);
      setIsCreateDrawerOpen(false);
      toast.success("Pelanggan baru berhasil dibuat");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal membuat pelanggan";
      toast.error(errorMessage);
      console.error("Error creating customer:", error);
    } finally {
      setIsCreatingCustomer(false);
    }
  };

  const handleClearSelection = () => {
    onSelect(null);
    setSearchInput("");
    setShowDropdown(false);
  };

  // Filter customers based on search input
  const filteredCustomers = customerOptions.filter((customer) =>
    customer.name.toLowerCase().includes(searchInput.toLowerCase()),
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Pilih Pelanggan
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Pilih pelanggan yang ada atau buat pelanggan baru
          </p>
        </div>

        {/* Customer Search Input */}
        <div>
          <Label htmlFor="customer-search">Pelanggan</Label>
          <div className="flex gap-2">
            <div className="flex-1 relative" ref={searchContainerRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                <input
                  id="customer-search"
                  type="text"
                  placeholder="Cari pelanggan..."
                  value={searchInput}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-primary-500 dark:focus:border-primary-600"
                />
              </div>

              {/* Dropdown Results */}
              {showDropdown && filteredCustomers.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  {filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      type="button"
                      onClick={() => handleSelectCustomer(customer)}
                      className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {getCustomerDisplayName(customer)}
                        </p>
                        {customer.telp && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {customer.telp}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {showDropdown &&
                filteredCustomers.length === 0 &&
                searchInput &&
                customerState.type !== "loading" && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Tidak ada pelanggan yang cocok
                  </div>
                )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateDrawerOpen(true)}
              disabled={isCreatingCustomer}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              {isCreatingCustomer ? "Membuat..." : "Buat Baru"}
            </Button>
            {selected && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearSelection}
              >
                <X size={16} />
              </Button>
            )}
          </div>
        </div>

        {/* Selected Customer Info */}
        {selected && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
              <span className="font-semibold">Pelanggan Terpilih:</span>{" "}
              {selected.name}
            </p>
            {selected.telp && (
              <p className="text-xs text-blue-700 dark:text-blue-400">
                Telepon: {selected.telp}
              </p>
            )}
            {selected.city && (
              <p className="text-xs text-blue-700 dark:text-blue-400">
                Kota: {selected.city}
              </p>
            )}
          </div>
        )}

        {/* Empty State */}
        {customerState.type === "success" &&
          customerState.data &&
          customerState.data.length === 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                Belum ada pelanggan di sistem. Silakan buat pelanggan baru
                terlebih dahulu.
              </p>
            </div>
          )}

        {/* Error State */}
        {customerState.type === "error" && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-700 dark:text-red-400">
              Error: {customerState.message}
            </p>
          </div>
        )}
      </div>

      {/* Customer Create Drawer */}
      <CustomerCreateDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onCreateCustomer={handleCreateCustomer}
        isLoading={isCreatingCustomer}
      />
    </div>
  );
};

export default CustomerSelectionStep;
