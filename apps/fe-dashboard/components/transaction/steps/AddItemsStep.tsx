"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import StepperInput from "@/components/form/input/StepperInput";
import PriceInput from "@/components/form/input/PriceInput";
import CatalogSelectDrawer from "@/components/transaction/CatalogSelectDrawer";
import {
  CatalogModel,
  CatalogListResponse,
  DataViewState,
  formatPriceIDR,
} from "@repo/core";
import type { TransactionItem } from "../types";

interface AddItemsStepProps {
  items: TransactionItem[];
  catalogState: DataViewState<{ data: CatalogModel[] }>;
  onAddItem: (catalog: CatalogModel) => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, updates: Partial<TransactionItem>) => void;
  onCatalogSelect: (catalog: CatalogModel) => void;
  onSearchCatalog?: (
    query: string,
    page: number,
    callback: (response: CatalogListResponse) => void,
  ) => void;
}

const AddItemsStep: React.FC<AddItemsStepProps> = ({
  items,
  catalogState,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  onCatalogSelect,
  onSearchCatalog,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [catalogItems, setCatalogItems] = useState<CatalogModel[]>([]);

  const roundToInteger = (num: number) => Math.ceil(num);

  useEffect(() => {
    if (catalogState.type === "success" && catalogState.data?.data) {
      setCatalogItems(catalogState.data.data);
    }
  }, [catalogState]);

  const handleCatalogSelect = (catalog: CatalogModel) => {
    onCatalogSelect(catalog);
    setIsDrawerOpen(false);
  };

  const subtotal = roundToInteger(
    items.reduce((sum, item) => sum + item.finalPrice, 0),
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tambah Item
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Pilih produk yang ingin dijual dan tentukan kuantitas serta
            harganya.
          </p>
        </div>

        {/* Add Item Button */}
        <div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Tambah Item
          </Button>
        </div>

        {/* Items List */}
        {items.length > 0 ? (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-3 font-semibold text-gray-900 dark:text-white">
                      Produk
                    </th>
                    <th className="text-center py-2 px-3 font-semibold text-gray-900 dark:text-white">
                      Berat (g)
                    </th>
                    <th className="text-right py-2 px-3 font-semibold text-gray-900 dark:text-white">
                      Harga Satuan
                    </th>
                    <th className="text-center py-2 px-3 font-semibold text-gray-900 dark:text-white">
                      Qty
                    </th>
                    <th className="text-right py-2 px-3 font-semibold text-gray-900 dark:text-white">
                      Total
                    </th>
                    <th className="text-center py-2 px-3 font-semibold text-gray-900 dark:text-white">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => {
                    const catalog = catalogItems.find(
                      (c) => c.id === item.catalogId,
                    );
                    return (
                      <tr
                        key={index}
                        className="border-b border-gray-200 dark:border-gray-700"
                      >
                        <td className="py-3 px-3">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.catalogName ||
                              catalog?.product?.name ||
                              catalog?.displayName ||
                              "Produk"}
                          </p>
                        </td>
                        <td className="py-3 px-3 text-center text-gray-900 dark:text-white">
                          <p className="font-medium">
                            {item.weight ||
                              catalog?.totalWeightGram ||
                              catalog?.netWeightGram ||
                              "-"}{" "}
                            g
                          </p>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <p className="text-gray-900 dark:text-white text-sm">
                            {formatPriceIDR(roundToInteger(item.realPrice))}
                          </p>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex justify-center">
                            <StepperInput
                              value={item.quantity}
                              onChange={(qty) => {
                                const newFinalPrice = roundToInteger(
                                  qty * roundToInteger(item.realPrice),
                                );
                                onUpdateItem(index, {
                                  quantity: qty,
                                  finalPrice: newFinalPrice,
                                });
                              }}
                              min={1}
                              max={999}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-medium text-gray-900 dark:text-white">
                          <PriceInput
                            value={roundToInteger(item.finalPrice).toString()}
                            onChange={(totalPrice) => {
                              const total = parseFloat(
                                totalPrice.replace(/,/g, ""),
                              );
                              if (!isNaN(total) && total >= 0) {
                                onUpdateItem(index, {
                                  finalPrice: roundToInteger(total),
                                });
                              }
                            }}
                          />
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => onRemoveItem(index)}
                            className="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Subtotal */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900 dark:text-white">
                  Subtotal:
                </span>
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {formatPriceIDR(subtotal)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              Belum ada item. Silakan tambahkan item produk untuk melanjutkan.
            </p>
          </div>
        )}
      </div>

      {/* Catalog Select Drawer */}
      <CatalogSelectDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        catalogs={catalogItems}
        onSelectCatalog={handleCatalogSelect}
        onSearchCatalog={onSearchCatalog}
        isLoading={catalogState.type === "loading"}
      />
    </div>
  );
};

export default AddItemsStep;
