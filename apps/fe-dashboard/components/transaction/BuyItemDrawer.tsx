import React, { useState, useMemo } from "react";
import { toast } from "react-toastify";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import PriceInput from "@/components/form/input/PriceInput";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { X, ChevronDown } from "lucide-react";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import MultiDropzone from "@/components/form/form-elements/MultiDropzone";
import { PRODUCT_CATEGORIES } from "@repo/core/index";
import type { TransactionItem } from "@/app/(admin)/(others-pages)/transaction/add/buy/useAddBuyTransactionViewModel";

interface Material {
  id: string;
  materialName: string;
  materialId: string;
  quality: "LOW_QUALITY" | "HIGH_QUALITY" | undefined;
  weight: string;
  pricePerGram: number;
}

export interface BuyItemFormData {
  displayName: string;
  category: string;
  totalWeight: string;
  finalPrice: number;
  material: Material;
  image?: File;
  hasStatementLetter?: boolean;
  statementLetterImage?: string[];
}

interface BuyItemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: BuyItemFormData) => void;
  onSaveEdit?: (updates: Partial<TransactionItem>) => void;
  editItem?: TransactionItem | null;
  isEditMode?: boolean;
  getMaterialOptions?: () => Array<{
    value: string;
    label: string;
    id: string;
    category: string;
  }>;
  getMaterialPrice?: (materialId: string) => number;
  getMaterialCategory?: (materialId: string) => string;
}

const BuyItemDrawer: React.FC<BuyItemDrawerProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onSaveEdit,
  editItem,
  isEditMode = false,
  getMaterialOptions = () => [],
  getMaterialPrice = () => 0,
  getMaterialCategory = () => "",
}) => {
  const [formData, setFormData] = useState({
    displayName: "",
    category: "",
    totalWeight: "",
    finalPrice: 0,
  });
  const [material, setMaterial] = useState<Material>({
    id: Math.random().toString(36).substring(7),
    materialName: "",
    materialId: "",
    quality: undefined,
    weight: "",
    pricePerGram: 0,
  });
  const [image, setImage] = useState<File | null>(null);
  const [imageName, setImageName] = useState("");
  const [existingImages, setExistingImages] = useState<
    Array<{ image: string; position: number }>
  >([]);
  const [hasStatementLetter, setHasStatementLetter] = useState<boolean>(false);
  const [statementLetterImages, setStatementLetterImages] = useState<File[]>(
    [],
  );

  // Helper function to convert base64 string to File
  const base64ToFile = (base64String: string, filename: string): File => {
    const arr = base64String.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // Initialize form with edit item data
  React.useEffect(() => {
    if (isEditMode && editItem) {
      const materialId = editItem.productId || "";
      const price = materialId ? getMaterialPrice(materialId) : 0;
      setFormData({
        displayName: editItem.displayName || "",
        category: editItem.category || "",
        totalWeight: editItem.totalWeightGram?.toString() || "",
        finalPrice: editItem.finalSubtotal || 0,
      });
      setMaterial({
        id: materialId,
        materialName: materialId,
        materialId: materialId,
        quality: editItem.quality,
        weight: editItem.netWeightGram?.toString() || "",
        pricePerGram:
          price ||
          (editItem.subtotal && editItem.netWeightGram
            ? editItem.subtotal / editItem.netWeightGram
            : 0),
      });
      // Prefill existing images
      if (editItem.images && editItem.images.length > 0) {
        setExistingImages(editItem.images);
        setImageName("Image exists - choose file to replace");
        setImage(null);
      }
      // Prefill statement letter images
      if (
        editItem.statementLetterImage &&
        editItem.statementLetterImage.length > 0
      ) {
        const existingFiles = editItem.statementLetterImage.map((base64, idx) =>
          base64ToFile(base64, `statement-letter-${idx}.jpg`),
        );
        setHasStatementLetter(true);
        setStatementLetterImages(existingFiles);
      } else {
        setHasStatementLetter(false);
        setStatementLetterImages([]);
      }
    } else if (!isOpen) {
      // Reset form when drawer closes
      setFormData({
        displayName: "",
        category: "",
        totalWeight: "",
        finalPrice: 0,
      });
      setMaterial({
        id: Math.random().toString(36).substring(7),
        materialName: "",
        materialId: "",
        quality: undefined,
        weight: "",
        pricePerGram: 0,
      });
      setImage(null);
      setImageName("");
      setExistingImages([]);
      setHasStatementLetter(false);
      setStatementLetterImages([]);
    }
  }, [isOpen, isEditMode, editItem]);

  const expectedPrice = useMemo(() => {
    const weightNum = parseFloat(material.weight) || 0;
    return weightNum * material.pricePerGram;
  }, [material]);

  // Auto-update finalPrice when weight or material changes
  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      finalPrice: expectedPrice,
    }));
  }, [expectedPrice]);

  const isFormValid = useMemo(() => {
    const hasDisplayName = formData.displayName.trim().length > 0;
    const hasCategory = formData.category.length > 0;
    const hasTotalWeight =
      formData.totalWeight && parseFloat(formData.totalWeight) > 0;
    const hasMaterial =
      material.materialId && material.weight.trim().length > 0;
    const hasValidPrice = formData.finalPrice > 0;
    const materialCategory = getMaterialCategory(material.materialId);
    const hasQuality =
      materialCategory !== "NON_GOLD" || material.quality !== undefined;

    return (
      hasDisplayName &&
      hasCategory &&
      hasTotalWeight &&
      hasMaterial &&
      hasValidPrice &&
      hasQuality
    );
  }, [formData, material, getMaterialCategory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateMaterial = (field: keyof Material, value: string) => {
    if (field === "materialName") {
      const price = getMaterialPrice(value);
      setMaterial({
        ...material,
        materialName: value,
        materialId: value,
        pricePerGram: price,
        quality: undefined,
      });
    } else if (field === "quality") {
      const quality = (value === "" ? undefined : value) as
        | "LOW_QUALITY"
        | "HIGH_QUALITY"
        | undefined;
      setMaterial({ ...material, quality });
    } else if (field === "weight") {
      const totalWeightNum = parseFloat(formData.totalWeight) || 0;
      const weightNum = parseFloat(value) || 0;
      // Only update if weight doesn't exceed total weight
      if (weightNum <= totalWeightNum) {
        setMaterial({ ...material, [field]: value });
      }
    } else {
      setMaterial({ ...material, [field]: value });
    }
  };

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setImage(files[0]);
      setImageName(files[0].name);
      setExistingImages([]);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageName("");
    setExistingImages([]);
  };

  const handleStatementLetterFilesSelected = (files: File[]) => {
    setStatementLetterImages(files);
  };

  const handleRemoveStatementLetterImages = () => {
    setStatementLetterImages([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.displayName.trim()) {
      toast.error("Masukkan nama tampilan produk");
      return;
    }

    if (!formData.category) {
      toast.error("Pilih kategori produk");
      return;
    }

    if (!formData.totalWeight || parseFloat(formData.totalWeight) <= 0) {
      toast.error("Masukkan berat total yang valid");
      return;
    }

    // Validate material
    if (!material.materialId || !material.weight.trim()) {
      toast.error("Pilih material dan masukkan berat");
      return;
    }

    const materialCategory = getMaterialCategory(material.materialId);
    if (materialCategory === "NON_GOLD" && !material.quality) {
      toast.error("Pilih kualitas untuk material NON_GOLD");
      return;
    }

    if (formData.finalPrice <= 0) {
      toast.error("Masukkan harga final yang valid");
      return;
    }

    // Validate statement letter if user selected "has"
    if (hasStatementLetter && statementLetterImages.length === 0) {
      toast.error("Unggah minimal satu gambar Surat Pernyataan Kepemilikan");
      return;
    }

    if (isEditMode && onSaveEdit) {
      // Handle edit mode
      const weight = parseFloat(material.weight) || 0;
      const taraPrice =
        formData.finalPrice - Math.ceil(material.pricePerGram * weight);

      const updates: Partial<TransactionItem> = {
        displayName: formData.displayName,
        totalWeightGram: parseFloat(formData.totalWeight) || 0,
        netWeightGram: weight,
        taraPrice: taraPrice < 0 ? 0 : taraPrice,
        quality: material.quality,
        category: formData.category,
        subtotal: Math.ceil(material.pricePerGram * weight),
        finalSubtotal: formData.finalPrice,
      };

      // Handle image updates
      if (image) {
        // New image selected - convert to data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageDataUrl = e.target?.result as string;
          updates.images = [{ image: imageDataUrl, position: 0 }];

          // Handle statement letter images
          if (hasStatementLetter && statementLetterImages.length > 0) {
            // Convert files to data URLs
            let filesProcessed = 0;
            const processedImages: string[] = [];

            statementLetterImages.forEach((file) => {
              const fileReader = new FileReader();
              fileReader.onload = (fileEvent) => {
                processedImages.push(fileEvent.target?.result as string);
                filesProcessed++;
                if (filesProcessed === statementLetterImages.length) {
                  updates.statementLetterImage = processedImages;
                  onSaveEdit(updates);
                  onClose();
                }
              };
              fileReader.readAsDataURL(file);
            });
          } else {
            updates.statementLetterImage = null;
            onSaveEdit(updates);
            onClose();
          }
        };
        reader.readAsDataURL(image);
        return; // Return early, onClose will be called in reader.onload
      } else if (existingImages.length > 0) {
        // Keep existing images
        updates.images = existingImages;

        // Handle statement letter images
        if (hasStatementLetter && statementLetterImages.length > 0) {
          // Convert files to data URLs
          let filesProcessed = 0;
          const processedImages: string[] = [];

          statementLetterImages.forEach((file) => {
            const fileReader = new FileReader();
            fileReader.onload = (fileEvent) => {
              processedImages.push(fileEvent.target?.result as string);
              filesProcessed++;
              if (filesProcessed === statementLetterImages.length) {
                updates.statementLetterImage = processedImages;
                onSaveEdit(updates);
                onClose();
              }
            };
            fileReader.readAsDataURL(file);
          });
          return;
        } else {
          updates.statementLetterImage = null;
        }
      } else {
        // No images
        if (hasStatementLetter && statementLetterImages.length > 0) {
          // Convert files to data URLs
          let filesProcessed = 0;
          const processedImages: string[] = [];

          statementLetterImages.forEach((file) => {
            const fileReader = new FileReader();
            fileReader.onload = (fileEvent) => {
              processedImages.push(fileEvent.target?.result as string);
              filesProcessed++;
              if (filesProcessed === statementLetterImages.length) {
                updates.statementLetterImage = processedImages;
                onSaveEdit(updates);
                onClose();
              }
            };
            fileReader.readAsDataURL(file);
          });
          return;
        } else {
          updates.statementLetterImage = null;
        }
      }

      onSaveEdit(updates);
      onClose();
    } else {
      // Handle add mode
      if (hasStatementLetter && statementLetterImages.length > 0) {
        // Convert files to data URLs before submitting
        let filesProcessed = 0;
        const processedImages: string[] = [];

        statementLetterImages.forEach((file) => {
          const fileReader = new FileReader();
          fileReader.onload = (fileEvent) => {
            processedImages.push(fileEvent.target?.result as string);
            filesProcessed++;
            if (filesProcessed === statementLetterImages.length) {
              onSubmit({
                displayName: formData.displayName,
                category: formData.category,
                totalWeight: formData.totalWeight,
                finalPrice: formData.finalPrice,
                material: material,
                image: image || undefined,
                hasStatementLetter: true,
                statementLetterImage: processedImages,
              });
              onClose();
            }
          };
          fileReader.readAsDataURL(file);
        });
      } else {
        onSubmit({
          displayName: formData.displayName,
          category: formData.category,
          totalWeight: formData.totalWeight,
          finalPrice: formData.finalPrice,
          material: material,
          image: image || undefined,
          hasStatementLetter: false,
          statementLetterImage: undefined,
        });
        onClose();
      }
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="flex flex-col h-[90vh] max-h-[90vh]">
        {/* Header */}
        <DrawerHeader className="border-b border-gray-200 dark:border-gray-700 flex items-center justify-between p-4">
          <DrawerTitle className="text-xl font-semibold">
            {isEditMode ? "Edit Item Pembelian" : "Tambah Item Pembelian"}
          </DrawerTitle>
          <DrawerClose asChild>
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <X size={24} className="text-gray-600 dark:text-gray-400" />
            </button>
          </DrawerClose>
        </DrawerHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Display Name */}
            <div>
              <Label htmlFor="displayName">Nama Tampilan Katalog</Label>
              <Input
                id="displayName"
                name="displayName"
                placeholder="Masukkan nama tampilan katalog"
                value={formData.displayName}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Kategori</Label>
              <Select
                options={PRODUCT_CATEGORIES}
                value={formData.category}
                onChange={(value) => handleSelectChange("category", value)}
                placeholder="Pilih kategori"
              />
            </div>

            {/* Total Weight */}
            <div>
              <Label htmlFor="totalWeight">Berat Total (gram)</Label>
              <Input
                id="totalWeight"
                name="totalWeight"
                type="number"
                placeholder="Masukkan berat total"
                step={0.01}
                value={formData.totalWeight}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>

            {/* Material & Kandungan */}
            <div>
              <Label className="mb-2 block">Material & Kandungan</Label>

              <div className="space-y-3 bg-gray-50/50 dark:bg-gray-800/20 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
                {/* Material Select */}
                <div>
                  <Label className="text-[10px] uppercase text-gray-500 mb-2 block">
                    Material
                  </Label>
                  <Select
                    options={getMaterialOptions()}
                    value={material.materialId}
                    placeholder="Pilih Material"
                    onChange={(value) => updateMaterial("materialName", value)}
                  />
                </div>

                {/* Quality Select (Only for NON_GOLD) */}
                {getMaterialCategory(material.materialId) === "NON_GOLD" && (
                  <div>
                    <Label className="text-[10px] uppercase text-gray-500 mb-2 block">
                      Kualitas
                    </Label>
                    <Select
                      options={[
                        {
                          value: "LOW_QUALITY",
                          label: "Low Quality",
                        },
                        {
                          value: "HIGH_QUALITY",
                          label: "High Quality",
                        },
                      ]}
                      value={material.quality || ""}
                      placeholder="Pilih Kualitas"
                      onChange={(value) => updateMaterial("quality", value)}
                    />
                  </div>
                )}

                {/* Weight Input */}
                <div>
                  <Label className="text-[10px] uppercase text-gray-500 mb-2 block">
                    Berat Bersih (g)
                  </Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={material.weight}
                    onChange={(e) => updateMaterial("weight", e.target.value)}
                    step={0.01}
                  />
                  {parseFloat(material.weight) >
                    parseFloat(formData.totalWeight) && (
                    <p className="text-xs text-red-500 mt-1">
                      Berat bersih tidak boleh melebihi berat total
                    </p>
                  )}
                </div>

                {/* Berat Mata Display */}
                <div>
                  <Label className="text-[10px] uppercase text-gray-500 mb-2 block">
                    Berat Mata (g)
                  </Label>
                  <div className="h-10 flex items-center justify-end px-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-900 dark:text-white">
                    {(
                      parseFloat(formData.totalWeight) -
                        parseFloat(material.weight) || 0
                    ).toFixed(2)}
                  </div>
                </div>

                {/* Estimate */}
                <div>
                  <Label className="text-[10px] uppercase text-gray-500 mb-2 block">
                    Estimasi
                  </Label>
                  <div className="h-10 flex items-center justify-end px-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-900 dark:text-white">
                    Rp {Math.round(expectedPrice).toLocaleString("id-ID")}
                  </div>
                </div>
              </div>
            </div>

            {/* Price Per Unit */}
            <div>
              <PriceInput
                label="Harga Final"
                value={formData.finalPrice.toString()}
                onChange={(rawValue) =>
                  setFormData((prev) => ({
                    ...prev,
                    finalPrice: parseFloat(rawValue) || 0,
                  }))
                }
                placeholder="0,00"
              />
            </div>

            {/* Image Upload */}
            <DropzoneComponent
              key={isEditMode ? `edit-${editItem?.displayName}` : "add"}
              title="Gambar Produk"
              description="PNG, JPG atau SVG"
              accept={{ "image/*": [] }}
              maxFiles={1}
              onFilesSelected={handleFilesSelected}
              currentImage={
                existingImages.length > 0 ? existingImages[0].image : undefined
              }
              onClearCurrentImage={handleRemoveImage}
            />

            {/* Statement Letter Section */}
            <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/30">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-900 dark:text-white">
                  Apakah item memiliki Surat Pernyataan Kepemilikan?
                </Label>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hasStatementLetter"
                      value="no"
                      checked={!hasStatementLetter}
                      onChange={() => {
                        setHasStatementLetter(false);
                        handleRemoveStatementLetterImages();
                      }}
                      className="w-4 h-4 accent-primary-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Tidak Ada
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hasStatementLetter"
                      value="yes"
                      checked={hasStatementLetter}
                      onChange={() => setHasStatementLetter(true)}
                      className="w-4 h-4 accent-primary-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Ada
                    </span>
                  </label>
                </div>
              </div>

              {/* Statement Letter Image Upload - Only show if user has it */}
              {hasStatementLetter && (
                <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800/30 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Unggah hingga 5 file ({statementLetterImages.length}
                      /5)
                    </p>
                  </div>

                  {/* Show dropzone only if below 5 files */}
                  {statementLetterImages.length < 5 && (
                    <MultiDropzone
                      key={
                        isEditMode
                          ? `edit-stmt-${editItem?.displayName}`
                          : "add-stmt"
                      }
                      files={statementLetterImages}
                      onFilesChange={handleStatementLetterFilesSelected}
                      maxFiles={5}
                      accept={{
                        "image/png": [".png"],
                        "image/jpeg": [".jpg", ".jpeg"],
                      }}
                    />
                  )}

                  {/* Show message when max files reached */}
                  {statementLetterImages.length === 5 && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded text-xs text-amber-700 dark:text-amber-300">
                      Jumlah file mencapai batas maksimal (5 file)
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={!isFormValid}
              >
                {isEditMode ? "Simpan Perubahan" : "Tambah Item"}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default BuyItemDrawer;
