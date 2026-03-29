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
import PriceInputField from "@/components/form/input/PriceInput";

interface EditPriceListFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedItem: MetalPriceItem;
  onSave?: (item: MetalPriceItem) => void;
}

const EditNonGoldPriceListForm: React.FC<EditPriceListFormProps> = ({
  open,
  setOpen,
  selectedItem,
  onSave,
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [name, setName] = React.useState<string>("");
  const [lowBuyPrice, setLowBuyPrice] = React.useState<string>("");
  const [lowSellPrice, setLowSellPrice] = React.useState<string>("");

  const [highBuyPrice, setHighBuyPrice] = React.useState<string>("");
  const [highSellPrice, setHighSellPrice] = React.useState<string>("");

  React.useEffect(() => {
    if (open && selectedItem) {
      setName(selectedItem?.name || "");
      setLowBuyPrice(selectedItem?.buyPrice?.lowQualityPrice?.toString() || "");
      setLowSellPrice(
        selectedItem?.sellPrice?.lowQualityPrice?.toString() || "",
      );

      setHighBuyPrice(
        selectedItem?.buyPrice?.highQualityPrice?.toString() || "",
      );
      setHighSellPrice(
        selectedItem?.sellPrice?.highQualityPrice?.toString() || "",
      );
    }
  }, [open, selectedItem]);

  const isInvalid =
    (lowBuyPrice.trim() !== "" && isNaN(Number(lowBuyPrice))) ||
    (lowSellPrice.trim() !== "" && isNaN(Number(lowSellPrice))) ||
    (highBuyPrice.trim() !== "" && isNaN(Number(highBuyPrice))) ||
    (highSellPrice.trim() !== "" && isNaN(Number(highSellPrice)));

  const handleSave = () => {
    if (isInvalid) return;

    onSave?.({
      ...selectedItem,
      name: name,
      buyPrice: {
        ...selectedItem?.buyPrice,
        lowQualityPrice: lowBuyPrice.trim() !== "" ? Number(lowBuyPrice) : null,
        highQualityPrice:
          highBuyPrice.trim() !== "" ? Number(highBuyPrice) : null,
      },
      sellPrice: {
        ...selectedItem?.sellPrice,
        lowQualityPrice:
          lowSellPrice.trim() !== "" ? Number(lowSellPrice) : null,
        highQualityPrice:
          highSellPrice.trim() !== "" ? Number(highSellPrice) : null,
      },
    });
    setOpen(false);
  };

  const formProps = {
    name,
    setName,
    lowBuyPrice,
    setLowBuyPrice,
    lowSellPrice,
    setLowSellPrice,
    highBuyPrice,
    setHighBuyPrice,
    highSellPrice,
    setHighSellPrice,
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Edit Harga</DialogTitle>
            <DialogDescription>
              Ubah harga untuk {selectedItem?.name}. Gunakan koma (,) untuk
              desimal.
            </DialogDescription>
          </DialogHeader>
          <PriceForm {...formProps} />
          <DialogFooter>
            <Button onClick={handleSave} disabled={isInvalid}>
              Simpan
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="text-left">
            <DrawerTitle>Edit Harga</DrawerTitle>
            <DrawerDescription>
              Ubah harga untuk {selectedItem?.name}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            <PriceForm {...formProps} />
          </div>
          <DrawerFooter className="pt-2">
            <Button onClick={handleSave} disabled={isInvalid}>
              Simpan
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Batal</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

interface PriceFormProps {
  name: string;
  setName: (val: string) => void;
  lowBuyPrice: string;
  setLowBuyPrice: (val: string) => void;
  lowSellPrice: string;
  setLowSellPrice: (val: string) => void;
  highBuyPrice: string;
  setHighBuyPrice: (val: string) => void;
  highSellPrice: string;
  setHighSellPrice: (val: string) => void;
  className?: string;
}

function PriceForm({
  name,
  setName,
  lowBuyPrice,
  setLowBuyPrice,
  lowSellPrice,
  setLowSellPrice,
  highBuyPrice,
  setHighBuyPrice,
  highSellPrice,
  setHighSellPrice,
  className,
}: PriceFormProps) {
  return (
    <div className={`grid items-start gap-4 ${className}`}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Nama Aset
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Masukkan nama aset"
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <PriceInputField
        label="Harga Beli (Low Quality)"
        value={lowBuyPrice}
        onChange={setLowBuyPrice}
      />

      <PriceInputField
        label="Harga Beli (High Quality)"
        value={highBuyPrice}
        onChange={setHighBuyPrice}
      />

      <PriceInputField
        label="Harga Jual (Low Quality)"
        value={lowSellPrice}
        onChange={setLowSellPrice}
      />

      <PriceInputField
        label="Harga Jual (High Quality)"
        value={highSellPrice}
        onChange={setHighSellPrice}
      />
    </div>
  );
}

export default EditNonGoldPriceListForm;
