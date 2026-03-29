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

const EditGoldPriceListForm: React.FC<EditPriceListFormProps> = ({
  open,
  setOpen,
  selectedItem,
  onSave,
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [name, setName] = React.useState<string>("");
  const [buyPrice, setBuyPrice] = React.useState<string>("");
  const [sellPrice, setSellPrice] = React.useState<string>("");

  React.useEffect(() => {
    if (open && selectedItem) {
      setName(selectedItem?.name || "");
      setBuyPrice(selectedItem?.buyPrice?.price?.toString() || "");
      setSellPrice(selectedItem?.sellPrice?.price?.toString() || "");
    }
  }, [open, selectedItem]);

  const isInvalid =
    (buyPrice.trim() !== "" && isNaN(Number(buyPrice))) ||
    (sellPrice.trim() !== "" && isNaN(Number(sellPrice)));

  const handleSave = () => {
    if (isInvalid) return;

    onSave?.({
      ...selectedItem,
      name: name,
      buyPrice: {
        ...selectedItem?.buyPrice,
        price: buyPrice.trim() !== "" ? Number(buyPrice) : null,
      },
      sellPrice: {
        ...selectedItem?.sellPrice,
        price: sellPrice.trim() !== "" ? Number(sellPrice) : null,
      },
    });
    setOpen(false);
  };

  const formProps = {
    name,
    setName,
    buyPrice,
    setBuyPrice,
    sellPrice,
    setSellPrice,
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
  buyPrice: string;
  setBuyPrice: (val: string) => void;
  sellPrice: string;
  setSellPrice: (val: string) => void;
  className?: string;
}

function PriceForm({
  name,
  setName,
  buyPrice,
  setBuyPrice,
  sellPrice,
  setSellPrice,
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
        label="Harga Beli"
        value={buyPrice}
        onChange={setBuyPrice}
      />

      <PriceInputField
        label="Harga Jual"
        value={sellPrice}
        onChange={setSellPrice}
      />
    </div>
  );
}

export default EditGoldPriceListForm;
