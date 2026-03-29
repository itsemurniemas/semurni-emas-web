"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import Button from "@/components/ui/button/Button";
import { MetalPriceItem } from "@/components/dashboard/metalPrices/data";
import { formatRupiah } from "@repo/core/extension/number";
import PriceInputField from "@/components/form/input/PriceInput";

interface PriceDetailDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedItem: MetalPriceItem;
  priceType: "buy" | "sell";
}

const PriceDetailDialog: React.FC<PriceDetailDialogProps> = ({
  open,
  setOpen,
  selectedItem,
  priceType,
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [finalNegotiatedPrice, setFinalNegotiatedPrice] =
    React.useState<string>("");
  const [weight, setWeight] = React.useState<string>("");

  React.useEffect(() => {
    console.log("PriceDetailDialog rendered:", {
      open,
      selectedItem,
      priceType,
    });
    // Reset input when dialog opens
    if (open) {
      setFinalNegotiatedPrice("");
      setWeight("");
    }
  }, [open, selectedItem, priceType]);

  const buyPrice = selectedItem?.buyPrice?.price || 0;
  const sellPrice = selectedItem?.sellPrice?.price || 0;
  const standardPrice = priceType === "buy" ? buyPrice : sellPrice;
  const weightValue = weight ? Number(weight) : 0;
  const totalValue = finalNegotiatedPrice ? Number(finalNegotiatedPrice) : 0;
  const standardTotalValue = standardPrice * weightValue;

  // Calculate benefit from negotiation
  const negotiationBenefit =
    priceType === "buy"
      ? totalValue - standardTotalValue // How much more customer gets for selling
      : standardTotalValue - totalValue; // How much customer saves for buying

  const totalBenefit = negotiationBenefit;

  const negotiationBenefitPercentage =
    standardPrice > 0
      ? ((Math.abs(negotiationBenefit) / standardPrice) * 100).toFixed(2)
      : "0.00";

  const isPriceAvailable = priceType === "buy" ? buyPrice > 0 : sellPrice > 0;

  const renderPriceDetail = () => (
    <div className="space-y-6">
      {/* Today's Standard Price and Weight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Today's Standard Price */}
        <div className="rounded-lg bg-gray-50 dark:bg-white/5 p-4 space-y-3">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Harga Standar Hari Ini
          </h4>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">
              {priceType === "buy" ? "Harga Beli" : "Harga Jual"}
            </span>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {isPriceAvailable
                ? formatRupiah(priceType === "buy" ? buyPrice : sellPrice)
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Weight Input */}
        <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 space-y-3">
          <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Berat Produk
          </h4>
          <div className="space-y-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Berat (gram):
            </label>
            <input
              type="number"
              step="0.01"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-blue-200 dark:border-blue-800 rounded-md bg-white dark:bg-blue-900/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Final Agreed Price (Negotiation) */}
      <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 p-4 space-y-3">
        <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300">
          Harga Final Kesepakatan{" "}
          <span className="text-xs text-purple-600 dark:text-purple-400">
            (per gram)
          </span>
        </h4>
        <PriceInputField
          label="Masukkan harga kesepakatan akhir dengan pelanggan"
          value={finalNegotiatedPrice}
          onChange={setFinalNegotiatedPrice}
        />
      </div>

      {/* Negotiation Benefit Summary */}
      {finalNegotiatedPrice && (
        <div
          className={`rounded-lg ${
            negotiationBenefit > 0
              ? "bg-green-50 dark:bg-green-900/20"
              : negotiationBenefit < 0
                ? "bg-red-50 dark:bg-red-900/20"
                : "bg-gray-50 dark:bg-gray-800/20"
          } p-4 space-y-3`}
        >
          <h4
            className={`text-sm font-medium ${
              negotiationBenefit > 0
                ? "text-green-700 dark:text-green-300"
                : negotiationBenefit < 0
                  ? "text-red-700 dark:text-red-300"
                  : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {negotiationBenefit > 0 ? "✓ " : negotiationBenefit < 0 ? "✗ " : ""}
            Keuntungan Dari Negosiasi
          </h4>
          <div className="space-y-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {priceType === "buy"
                ? negotiationBenefit > 0
                  ? "Pelanggan mendapatkan lebih tinggi dari harga standar beli:"
                  : "Pelanggan mendapatkan lebih rendah dari harga standar beli:"
                : negotiationBenefit > 0
                  ? "Pelanggan berhemat dari harga standar jual:"
                  : "Pelanggan membayar lebih mahal dari harga standar jual:"}
            </p>
            <div className="flex items-end gap-3 mt-4">
              <div>
                <span
                  className={`text-4xl font-bold ${
                    negotiationBenefit > 0
                      ? "text-green-600 dark:text-green-400"
                      : negotiationBenefit < 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {formatRupiah(Math.abs(negotiationBenefit))}
                </span>
                <p
                  className={`text-xs mt-2 ${
                    negotiationBenefit > 0
                      ? "text-green-600 dark:text-green-400"
                      : negotiationBenefit < 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  ({negotiationBenefitPercentage}% dari harga standar)
                </p>
              </div>
            </div>

            {/* Total Value Section */}
            {weight && (
              <div className="border-t border-green-200 dark:border-green-800 pt-3 mt-3">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Untuk berat <span className="font-semibold">{weight}g</span>:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Total Nilai:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatRupiah(totalValue)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Total Keuntungan:
                    </span>
                    <span
                      className={`font-semibold ${
                        totalBenefit > 0
                          ? "text-green-600 dark:text-green-400"
                          : totalBenefit < 0
                            ? "text-red-600 dark:text-red-400"
                            : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {formatRupiah(Math.abs(totalBenefit))}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-600 dark:text-gray-400 mt-4 italic">
              * Keuntungan dihitung dari selisih antara harga standar hari ini
              dengan harga kesepakatan akhir
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Dialog open={open && isDesktop} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-125 flex flex-col max-h-[90vh]">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-xl">
              Detail Harga - {selectedItem?.name}
            </DialogTitle>
            <DialogDescription>
              Ringkasan harga dan keuntungan pelanggan untuk produk ini
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 pr-4">
            {renderPriceDetail()}
          </div>
          <DialogFooter className="shrink-0">
            <DialogClose asChild>
              <Button variant="outline">Tutup</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Drawer open={open && !isDesktop} onOpenChange={setOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="text-left">
              <DrawerTitle className="text-xl">
                Detail Harga - {selectedItem?.name}
              </DrawerTitle>
              <DrawerDescription>
                Ringkasan harga dan keuntungan pelanggan
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 overflow-y-auto max-h-[60vh]">
              {renderPriceDetail()}
            </div>
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Tutup</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PriceDetailDialog;
