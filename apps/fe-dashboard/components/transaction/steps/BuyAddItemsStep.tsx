"use client";
import React, { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import StepperInput from "@/components/form/input/StepperInput";
import PriceInput from "@/components/form/input/PriceInput";
import BuyItemDrawer, {
  BuyItemFormData,
} from "@/components/transaction/BuyItemDrawer";
import { formatPriceIDR } from "@repo/core";
import type { TransactionItem } from "@/app/(admin)/(others-pages)/transaction/add/buy/useAddBuyTransactionViewModel";

interface BuyAddItemsStepProps {
  items: TransactionItem[];
  onAddItem: (item: TransactionItem) => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, updates: Partial<TransactionItem>) => void;
  onStartEditingItem?: (index: number) => void;
  onStopEditingItem?: () => void;
  onSaveEditedItem?: (updates: Partial<TransactionItem>) => void;
  editingIndex?: number | null;
  getMaterialOptions: () => Array<{
    value: string;
    label: string;
    id: string;
    category: string;
  }>;
  getMaterialPrice: (materialId: string) => number;
  getMaterialCategory: (materialId: string) => string;
}

const BuyAddItemsStep: React.FC<BuyAddItemsStepProps> = ({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  onStartEditingItem,
  onStopEditingItem,
  onSaveEditedItem,
  editingIndex,
  getMaterialOptions,
  getMaterialPrice,
  getMaterialCategory,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleAddItem = (formData: BuyItemFormData) => {
    const weight = parseFloat(formData.material.weight) || 0;
    let taraPrice =
      formData.finalPrice - Math.ceil(formData.material.pricePerGram * weight);
    const newItem: TransactionItem = {
      displayName: formData.displayName,
      totalWeightGram: parseFloat(formData.totalWeight) || 0,
      netWeightGram: weight,
      taraPrice: taraPrice < 0 ? 0 : taraPrice,
      quality: formData.material.quality,
      category: formData.category,
      quantity: 1,
      productId: formData.material.materialId,
      subtotal: Math.ceil(formData.material.pricePerGram * weight),
      finalSubtotal: formData.finalPrice,
      images: formData.image
        ? [{ image: URL.createObjectURL(formData.image), position: 0 }]
        : [],
      statementLetterImage: formData.statementLetterImage || null,
    };

    console.log("Adding item:", newItem);

    onAddItem(newItem);
    setIsDrawerOpen(false);
  };

  const handleEditItem = (index: number) => {
    onStartEditingItem?.(index);
    setIsDrawerOpen(true);
  };

  const handleSaveEditedItem = (updates: Partial<TransactionItem>) => {
    onSaveEditedItem?.(updates);
    setIsDrawerOpen(false);
  };

  const handleVariablePriceChange = (index: number, finalSubtotal: number) => {
    if (finalSubtotal < 0) return;
    updateItem(index, {
      finalSubtotal,
    });
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    if (quantity <= 0) return;
    const item = items[index];
    updateItem(index, {
      quantity,
      finalSubtotal: Math.ceil(quantity * item.subtotal),
    });
  };

  const updateItem = (index: number, updates: Partial<TransactionItem>) => {
    onUpdateItem(index, updates);
  };

  const subtotal = Math.ceil(
    items.reduce((sum, item) => sum + item.finalSubtotal, 0),
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tambah Item Pembelian
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Pilih material yang dibeli dan tentukan jumlah serta harganya.
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
            {items.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.displayName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.totalWeightGram}g @{" "}
                      {formatPriceIDR(
                        Math.ceil(item.finalSubtotal / item.quantity),
                      )}
                      /g
                    </p>
                    {item.statementLetterImage &&
                      item.statementLetterImage.length > 0 && (
                        <div className="mt-2 inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded">
                          ✓ Memiliki Surat Pernyataan (
                          {item.statementLetterImage.length} file)
                        </div>
                      )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditItem(index)}
                      className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(index)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Quantity */}
                  <StepperInput
                    label="Kuantitas"
                    value={item.quantity}
                    onChange={(qty) => handleQuantityChange(index, qty)}
                    min={1}
                  />

                  {/* Harga Per Unit */}
                  <div>
                    <PriceInput
                      label="Harga Per Unit"
                      value={item.subtotal.toString()}
                      onChange={() => {}}
                      disabled
                      placeholder="0,00"
                    />
                  </div>

                  {/* Final Price */}
                  <div>
                    <PriceInput
                      label="Harga Final"
                      value={item.finalSubtotal.toString()}
                      onChange={(rawValue) =>
                        handleVariablePriceChange(
                          index,
                          parseFloat(rawValue) || 0,
                        )
                      }
                      placeholder="0,00"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Subtotal */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <p className="font-medium text-gray-900 dark:text-white">
                  Total:
                </p>
                <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                  {formatPriceIDR(subtotal)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Belum ada item yang ditambahkan. Klik tombol di atas untuk
              menambahkan item pertama.
            </p>
          </div>
        )}
      </div>

      {/* Buy Item Form Drawer */}
      <BuyItemDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          onStopEditingItem?.();
        }}
        onSubmit={handleAddItem}
        onSaveEdit={handleSaveEditedItem}
        editItem={
          editingIndex !== null && editingIndex !== undefined
            ? items[editingIndex]
            : null
        }
        isEditMode={editingIndex !== null && editingIndex !== undefined}
        getMaterialOptions={getMaterialOptions}
        getMaterialPrice={getMaterialPrice}
        getMaterialCategory={getMaterialCategory}
      />
    </div>
  );
};

export default BuyAddItemsStep;
