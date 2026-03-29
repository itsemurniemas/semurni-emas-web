"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import MultiDropzone from "@/components/form/form-elements/MultiDropzone";
import { toast } from "react-toastify";
import {
  Plus,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import { useEditCatalogViewModel } from "./useEditCatalogViewModel";
import { useAuth, isSuperAdminRole } from "@/context/AuthContext";
import {
  calculateCatalogPrice,
  diffchecker,
  APPROVED_PURPOSES,
  PRODUCT_CATEGORIES,
} from "@repo/core";
import { AlertDialogDrawer } from "@/components/dialogDrawer";

interface Material {
  id: string;
  materialName: string;
  materialId: string;
  quality: "LOW_QUALITY" | "HIGH_QUALITY" | undefined;
  weight: string;
  pricePerGram: number;
}

interface CatalogImage {
  id?: string; // Present if from backend, absent if newly uploaded
  image?: string; // Base64 string if newly uploaded
  position: number;
  file?: File; // File object for newly uploaded images
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const EditCatalogPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const params = useParams();
  const catalogId = params?.id as string;

  const {
    state,
    updateCatalog,
    catalogState,
    getMaterialPrice,
    getMaterialCategory,
    deleteState,
    deleteCatalog,
  } = useEditCatalogViewModel(catalogId);

  const [formData, setFormData] = useState({
    displayName: "",
    totalWeight: "",
    price: "",
    stock: "",
    percentage: "",
    isVisible: true,
    branchId: "",
    productId: "",
    category: "",
    purpose: "",
    quality: "",
  });

  const [materials, setMaterials] = useState<Material[]>([
    {
      id: Math.random().toString(36).substring(7),
      materialName: "",
      materialId: "",
      quality: undefined,
      weight: "",
      pricePerGram: 0,
    },
  ]);

  const [catalogImages, setCatalogImages] = useState<CatalogImage[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [draggedImage, setDraggedImage] = useState<CatalogImage | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [originalFormData, setOriginalFormData] = useState(formData);

  // Prefill form when catalog is loaded
  useEffect(() => {
    if (catalogState.type === "success" && catalogState.data) {
      const catalog = catalogState.data;

      // Get the sell price per gram based on product type and quality
      let sellPricePerGram = 0;
      let qualityValue = "";

      if (catalog.product.goldJewelryItem) {
        sellPricePerGram =
          catalog.product.goldJewelryItem.sellPricePerGram || 0;
      } else if (catalog.product.goldBarItem) {
        sellPricePerGram = catalog.product.goldBarItem.sellPricePerGram || 0;
      } else if (catalog.product.nonGoldItem) {
        const quality = catalog.quality;
        if (quality === "HIGH_QUALITY") {
          sellPricePerGram =
            catalog.product.nonGoldItem.highQualitySellPricePerGram || 0;
          qualityValue = "HIGH_QUALITY";
        } else if (quality === "LOW_QUALITY") {
          sellPricePerGram =
            catalog.product.nonGoldItem.lowQualitySellPricePerGram || 0;
          qualityValue = "LOW_QUALITY";
        } else {
          // Default to HIGH_QUALITY if not specified
          sellPricePerGram =
            catalog.product.nonGoldItem.highQualitySellPricePerGram || 0;
          qualityValue = "HIGH_QUALITY";
        }
      }

      const totalPrice = catalog.netWeightGram * sellPricePerGram;

      const initialFormData = {
        displayName: catalog.displayName,
        totalWeight: catalog.totalWeightGram.toString(),
        price: totalPrice.toString(),
        stock: catalog.quantity.toString(),
        percentage: ((catalog.percentage || 0) * 100).toString(),
        isVisible: catalog.isDisplayed,
        branchId: catalog.branchId || "",
        productId: catalog.productId,
        category: catalog.category || "",
        purpose: catalog.approvedPurpose || "SELLING",
        quality: qualityValue,
      };

      setFormData(initialFormData);
      setOriginalFormData(initialFormData);

      // Initialize materials with the product from catalog
      const materialPrice =
        catalog.product.goldJewelryItem?.sellPricePerGram ||
        catalog.product.goldBarItem?.sellPricePerGram ||
        catalog.product.nonGoldItem?.highQualitySellPricePerGram ||
        0;

      setMaterials([
        {
          id: catalog.productId,
          materialName: catalog.product.name,
          materialId: catalog.productId,
          quality:
            (qualityValue as "LOW_QUALITY" | "HIGH_QUALITY" | undefined) ||
            undefined,
          weight: catalog.netWeightGram.toString(),
          pricePerGram: materialPrice,
        },
      ]);

      // Initialize catalog images from backend (with IDs)
      const backendImages: CatalogImage[] = (catalog.images || []).map(
        (img: any, index: number) => ({
          id: img.id,
          image: img.imageUrl || img.image, // Show base64 or URL
          position: index + 1,
        }),
      );
      setCatalogImages(backendImages);

      setIsEditMode(true);
      setIsLoadingCatalog(false);
    } else if (catalogState.type === "error") {
      setIsLoadingCatalog(false);
      toast.error("Failed to load catalog");
      router.push("/catalog");
    } else if (catalogState.type === "loading") {
      setIsLoadingCatalog(true);
    }
  }, [catalogState, router]);

  const basePrice = useMemo(() => {
    return materials.reduce((sum, m) => {
      const weightNum = parseFloat(m.weight) || 0;
      return sum + weightNum * m.pricePerGram;
    }, 0);
  }, [materials]);

  const finalSellPrice = useMemo(() => {
    const percentage = parseFloat(formData.percentage) || 0;
    return (
      (basePrice + (catalogState.data?.taraPrice || 0)) * (percentage / 100)
    );
  }, [basePrice, formData.percentage]);

  // Calculate estimasi modal using buy prices from catalog data
  const buyExpectedPrice = useMemo(() => {
    if (catalogState.type !== "success" || !catalogState.data) {
      return finalSellPrice;
    }

    const catalog = catalogState.data;
    let buyPricePerGram = 0;

    // Get buy price per gram based on product type and quality
    if (catalog.product.goldJewelryItem) {
      buyPricePerGram = catalog.product.goldJewelryItem.buyPricePerGram || 0;
    } else if (catalog.product.goldBarItem) {
      buyPricePerGram = catalog.product.goldBarItem.buyPricePerGram || 0;
    } else if (catalog.product.nonGoldItem) {
      const quality = catalog.quality;
      if (quality === "HIGH_QUALITY") {
        buyPricePerGram =
          catalog.product.nonGoldItem.highQualityBuyPricePerGram || 0;
      } else if (quality === "LOW_QUALITY") {
        buyPricePerGram =
          catalog.product.nonGoldItem.lowQualityBuyPricePerGram || 0;
      } else {
        // Default to HIGH_QUALITY if not specified
        buyPricePerGram =
          catalog.product.nonGoldItem.highQualityBuyPricePerGram || 0;
      }
    }

    const basePrice = catalog.netWeightGram * buyPricePerGram;
    return basePrice;
  }, [catalogState]);

  // const finalPriceNum = parseFloat(formData.price) || 0;
  const priceDifference = finalSellPrice - buyExpectedPrice;

  const netWeightGram = materials.reduce((sum, m) => {
    return sum + (parseFloat(m.weight) || 0);
  }, 0);

  // Check if form data has changed
  const hasDiff = useMemo(() => {
    const currentData = {
      displayName: formData.displayName,
      totalWeightGram: parseFloat(formData.totalWeight),
      quality: formData.quality || null,
      category: formData.category,
      approvedPurpose: formData.purpose,
      isDisplayed: formData.isVisible,
      quantity: parseInt(formData.stock),
      percentage: (parseFloat(formData.percentage) || 0) * 0.01,
    };

    const originalData = {
      displayName: originalFormData.displayName,
      totalWeightGram: parseFloat(originalFormData.totalWeight),
      quality: originalFormData.quality || null,
      category: originalFormData.category,
      approvedPurpose: originalFormData.purpose,
      isDisplayed: originalFormData.isVisible,
      quantity: parseInt(originalFormData.stock),
      percentage: (parseFloat(originalFormData.percentage) || 0) * 0.01,
    };

    const changedFields = diffchecker(originalData, currentData);
    return Object.keys(changedFields).length > 0;
  }, [formData, originalFormData]);

  // Check if there are any new images or deleted images
  const hasImageChanges = useMemo(() => {
    const hasNewImages = catalogImages.some((img) =>
      img.id?.startsWith("new-"),
    );
    const hasDeletedImages = deletedImageIds.length > 0;
    return hasNewImages || hasDeletedImages;
  }, [catalogImages, deletedImageIds]);

  useEffect(() => {
    const {
      displayName,
      price,
      stock,
      totalWeight,
      branchId,
      category,
      purpose,
    } = formData;
    const isSuperAdmin = user?.role?.name === "SUPER_ADMIN";

    const hasValidMaterial = materials.some(
      (m) => m.materialId !== "" && m.weight.trim() !== "",
    );
    const allMaterialsValid = materials.every(
      (m) =>
        (m.materialId === "" && m.weight.trim() === "") ||
        (m.materialId !== "" &&
          m.weight.trim() !== "" &&
          (getMaterialCategory(m.materialId) !== "NON_GOLD" ||
            m.quality !== undefined)),
    );

    const isBranchValid = isSuperAdmin ? branchId.trim() !== "" : true;

    const isValid =
      displayName.trim() !== "" &&
      price.trim() !== "" &&
      stock.trim() !== "" &&
      totalWeight.trim() !== "" &&
      category.trim() !== "" &&
      purpose.trim() !== "" &&
      hasValidMaterial &&
      allMaterialsValid &&
      isBranchValid;

    setIsFormValid(isValid);
  }, [formData, materials, getMaterialCategory, user?.role?.name]);

  // Auto-hide product from landing if purpose is not SELLING
  useEffect(() => {
    if (formData.purpose !== "SELLING" && formData.isVisible) {
      setFormData((prev) => ({
        ...prev,
        isVisible: false,
      }));
    }
  }, [formData.purpose]);

  // Auto-fill price with expectedPrice when materials or percentage changes
  useEffect(() => {
    if (finalSellPrice > 0) {
      setFormData((prev) => ({
        ...prev,
        price: finalSellPrice.toString(),
      }));
    }
  }, [finalSellPrice]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilesSelected = (selectedFiles: File[]) => {
    // Add new files to catalogImages
    const newImages: CatalogImage[] = selectedFiles.map((file, index) => {
      return {
        // Generate a temporary ID for new images
        id: `new-${Date.now()}-${index}`,
        file: file,
        position: catalogImages.length + index + 1,
      };
    });
    setCatalogImages([...catalogImages, ...newImages]);
  };

  const deleteImage = (imageId: string) => {
    setCatalogImages(catalogImages.filter((img) => img.id !== imageId));
    // Track deletion only if it's from backend (has original id)
    if (imageId && !imageId.startsWith("new-")) {
      if (!deletedImageIds.includes(imageId)) {
        setDeletedImageIds([...deletedImageIds, imageId]);
      }
    }
  };

  const handleDragStart = (image: CatalogImage) => {
    setDraggedImage(image);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetImage: CatalogImage) => {
    if (!draggedImage || draggedImage.id === targetImage.id) return;

    const draggedIndex = catalogImages.findIndex(
      (img) => img.id === draggedImage.id,
    );
    const targetIndex = catalogImages.findIndex(
      (img) => img.id === targetImage.id,
    );

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Swap positions
    const newImages = [...catalogImages];
    [newImages[draggedIndex], newImages[targetIndex]] = [
      newImages[targetIndex],
      newImages[draggedIndex],
    ];

    // Update position numbers
    newImages.forEach((img, idx) => {
      img.position = idx + 1;
    });

    setCatalogImages(newImages);
    setDraggedImage(null);
  };

  const updateMaterial = (id: string, field: keyof Material, value: string) => {
    setMaterials(
      materials.map((m) => {
        if (m.id === id) {
          if (field === "materialName") {
            const price = getMaterialPrice(value);
            return {
              ...m,
              materialName: value,
              materialId: value,
              pricePerGram: price,
              quality: undefined,
            };
          } else if (field === "quality") {
            const quality = (value === "" ? undefined : value) as
              | "LOW_QUALITY"
              | "HIGH_QUALITY"
              | undefined;
            const price = getMaterialPrice(m.materialId, quality);
            setFormData((prev) => ({ ...prev, quality: quality || "" }));
            return { ...m, quality, pricePerGram: price };
          } else if (field === "weight") {
            const totalWeightNum = parseFloat(formData.totalWeight) || 0;
            const weightNum = parseFloat(value) || 0;
            // Only update if weight doesn't exceed total weight
            if (weightNum <= totalWeightNum) {
              return { ...m, [field]: value };
            }
            return m;
          }
          return { ...m, [field]: value };
        }
        return m;
      }),
    );
  };

  const handleSubmit = async () => {
    if (isFormValid && state.type !== "loading") {
      try {
        setIsSubmitting(true);

        // Process unified image list to separate backend and new images
        const imagesToUpdate: Array<{ id: string; position: number }> = [];
        const imagesToAdd: Array<{ image: string; position: number }> = [];

        // Process all images in order
        for (const img of catalogImages) {
          if (img.id && !img.id.startsWith("new-")) {
            // Backend image - add to imagesToUpdate
            imagesToUpdate.push({
              id: img.id,
              position: img.position,
            });
          } else if (img.file) {
            // New uploaded file - convert to base64 and add to imagesToAdd
            const base64 = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve(reader.result as string);
              };
              reader.readAsDataURL(img.file!);
            });

            imagesToAdd.push({
              image: base64,
              position: img.position,
            });
          }
        }

        // Format data for comparison
        const currentData = {
          displayName: formData.displayName,
          totalWeightGram: parseFloat(formData.totalWeight),
          netWeightGram: netWeightGram,
          quality: formData.quality || null,
          category: formData.category,
          approvedPurpose: formData.purpose,
          isDisplayed: formData.isVisible,
          quantity: parseInt(formData.stock),
          percentage: (parseFloat(formData.percentage) || 0) * 0.01,
        };

        const originalData = {
          displayName: originalFormData.displayName,
          totalWeightGram: parseFloat(originalFormData.totalWeight),
          netWeightGram: parseFloat(originalFormData.totalWeight), // Same as original totalWeight since it wasn't changed in UI
          quality: originalFormData.quality || null,
          category: originalFormData.category,
          approvedPurpose: originalFormData.purpose,
          isDisplayed: originalFormData.isVisible,
          quantity: parseInt(originalFormData.stock),
          percentage: (parseFloat(originalFormData.percentage) || 0) * 0.01,
        };

        // Get only changed fields
        const changedFields = diffchecker(originalData, currentData);
        const updateRequest: any = changedFields;

        // Add image operations only if they exist
        if (imagesToUpdate.length > 0) {
          updateRequest.imagesToUpdate = imagesToUpdate;
        }
        if (imagesToAdd.length > 0) {
          updateRequest.imagesToAdd = imagesToAdd;
        }
        if (deletedImageIds.length > 0) {
          updateRequest.imagesToDelete = deletedImageIds;
        }

        await updateCatalog(updateRequest);
        toast.success("Katalog berhasil diperbarui!");
        router.push("/catalog");
      } catch (error: any) {
        toast.error(error?.message || "Gagal memperbarui katalog");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCatalog({ id: catalogId });
      toast.success("Katalog berhasil dihapus!");
      setTimeout(() => {
        router.push("/catalog");
      }, 1000);
    } catch (error: any) {
      toast.error(error?.message || "Gagal menghapus katalog");
      setOpenDeleteAlert(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoadingCatalog) {
    return (
      <div className="pb-28 md:pb-20 flex items-center justify-center min-h-screen">
        <ClipLoader color="#E4AF37" size={50} />
      </div>
    );
  }

  if (catalogState.type === "error") {
    return (
      <div className="pb-28 md:pb-20">
        <PageBreadcrumb pageTitle="Edit Katalog" />
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400">
            Error loading catalog: {catalogState.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-28 md:pb-20">
      <PageBreadcrumb pageTitle="Edit Katalog" />

      {/* Action Buttons */}
      <div className="mb-6 flex gap-3">
        <Button variant="outline" onClick={() => router.push("/catalog")}>
          Kembali ke Katalog
        </Button>
        <Button
          variant="error-outline"
          onClick={() => setOpenDeleteAlert(true)}
          disabled={deleteState.type === "loading"}
        >
          Hapus Katalog
        </Button>
      </div>

      <div className="space-y-6">
        <ComponentCard title="Informasi Produk">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="displayName">Nama Tampilan Katalog</Label>
                  <Input
                    type="text"
                    id="displayName"
                    name="displayName"
                    placeholder="Masukkan nama tampilan katalog"
                    value={formData.displayName}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label>Kategori</Label>
                  <Select
                    options={PRODUCT_CATEGORIES}
                    value={formData.category}
                    onChange={(value) => handleSelectChange("category", value)}
                    placeholder="Pilih kategori"
                  />
                </div>

                <div>
                  <Label>Tujuan</Label>
                  <Select
                    options={APPROVED_PURPOSES}
                    value={formData.purpose}
                    onChange={(value) => handleSelectChange("purpose", value)}
                    placeholder="Pilih purpose"
                  />
                </div>

                <div>
                  <Label htmlFor="stock">Stok</Label>
                  <Input
                    type="number"
                    id="stock"
                    name="stock"
                    placeholder="Masukkan jumlah stok"
                    value={formData.stock}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label>Harga Akhir Jual (Rp)</Label>
                  <div className="h-10 py-2 flex items-center text-sm font-medium text-gray-900 dark:text-white">
                    {finalSellPrice > 0 ? formatCurrency(finalSellPrice) : "—"}
                  </div>
                </div>

                {/* Visibility Toggle */}
                <div
                  className={`p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-700/50 flex items-center justify-between transition-all duration-300 ${formData.purpose !== "SELLING" ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        formData.isVisible
                          ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {formData.isVisible ? (
                        <Eye size={20} />
                      ) : (
                        <EyeOff size={20} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        Tampilkan di Landing Web
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formData.purpose !== "SELLING"
                          ? "Hanya produk dengan purpose Penjualan yang dapat ditampilkan"
                          : formData.isVisible
                            ? "Produk akan terlihat oleh pelanggan"
                            : "Produk akan disembunyikan sementara"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        isVisible: !prev.isVisible,
                      }))
                    }
                    disabled={formData.purpose !== "SELLING"}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      formData.isVisible
                        ? "bg-brand-600"
                        : "bg-gray-200 dark:bg-gray-700"
                    } ${formData.purpose !== "SELLING" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isVisible ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Dynamic Materials Section */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="totalWeight">Berat Total (gram)</Label>
                  <Input
                    type="number"
                    id="totalWeight"
                    name="totalWeight"
                    placeholder="Masukkan berat total"
                    step={0.01}
                    value={formData.totalWeight}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <Label className="mb-0!">Material & Kandungan</Label>
                </div>

                <div className="space-y-3 bg-gray-50/50 dark:bg-gray-800/20 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
                  {materials.map((material, index) => {
                    const rowTotal =
                      (parseFloat(material.weight) || 0) *
                      material.pricePerGram;
                    const materialCategory = getMaterialCategory(
                      material.materialId,
                    );
                    const isNonGold = materialCategory === "NON_GOLD";

                    return (
                      <div key={material.id} className="space-y-2">
                        {/* Main Material Row */}
                        <div className="flex gap-2 items-end group animate-in slide-in-from-left-2 duration-300 flex-wrap">
                          {/* Material Display (Read-only in edit mode) */}
                          <div className="flex-1 min-w-40">
                            {index === 0 && (
                              <Label className="text-[10px] uppercase text-gray-500">
                                Material
                              </Label>
                            )}
                            <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                              {material.materialName}
                            </div>
                          </div>

                          {/* Quality Select (Only for NON_GOLD) */}
                          {isNonGold && (
                            <div className="flex-1 min-w-24">
                              {index === 0 && (
                                <Label className="text-[10px] uppercase text-gray-500">
                                  Kualitas
                                </Label>
                              )}
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
                                onChange={(value) =>
                                  updateMaterial(material.id, "quality", value)
                                }
                              />
                            </div>
                          )}

                          {/* Weight Input */}
                          <div className="w-24">
                            {index === 0 && (
                              <Label className="text-[10px] uppercase text-gray-500">
                                Berat (g)
                              </Label>
                            )}
                            <Input
                              type="number"
                              placeholder="0"
                              step={0.01}
                              value={material.weight}
                              onChange={(e) =>
                                updateMaterial(
                                  material.id,
                                  "weight",
                                  e.target.value,
                                )
                              }
                            />
                            {parseFloat(material.weight) >
                              parseFloat(formData.totalWeight) && (
                              <p className="text-xs text-red-500 mt-1">
                                Tidak boleh &gt; berat total
                              </p>
                            )}
                          </div>

                          {/* Berat Mata Display */}
                          <div className="w-24">
                            {index === 0 && (
                              <Label className="text-[10px] uppercase text-gray-500">
                                Berat Mata (g)
                              </Label>
                            )}
                            <div className="h-10 flex items-center justify-center px-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-gray-900 dark:text-white">
                              {(
                                parseFloat(formData.totalWeight) -
                                  parseFloat(material.weight) || 0
                              ).toFixed(2)}
                            </div>
                          </div>

                          {/* Delete Button */}
                          {materials.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setMaterials(
                                  materials.filter((m) => m.id !== material.id),
                                )
                              }
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>

                        {/* Price Per Gram Display - Full Width */}
                        <div className="w-full bg-gray-100 dark:bg-gray-700/50 rounded-lg px-3 py-2 flex items-center justify-between border border-gray-200 dark:border-gray-600">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                            Harga/g
                          </span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatCurrency(material.pricePerGram)}
                          </span>
                        </div>

                        {/* Row Total Display - Full Width */}
                        <div className="w-full bg-gray-100 dark:bg-gray-700/50 rounded-lg px-3 py-2 flex items-center justify-between border border-gray-200 dark:border-gray-600">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                            Subtotal
                          </span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatCurrency(rowTotal)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div>
                  <Label htmlFor="percentage">Persentase</Label>
                  <Input
                    type="number"
                    id="percentage"
                    name="percentage"
                    placeholder="Masukkan persentase"
                    step={0.01}
                    value={formData.percentage}
                    onChange={handleInputChange}
                    disabled={!isSuperAdminRole(user?.role)}
                  />
                </div>

                {/* Add Material Button (only in add mode) */}
                {!isEditMode && (
                  <button
                    type="button"
                    onClick={() => {
                      const newMaterial: Material = {
                        id: Math.random().toString(36).substring(7),
                        materialName: "",
                        materialId: "",
                        quality: undefined,
                        weight: "",
                        pricePerGram: 0,
                      };
                      setMaterials([...materials, newMaterial]);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Plus size={16} />
                    Tambah Material
                  </button>
                )}
              </div>
            </div>

            {/* Price Summary Card */}
            <div className="mt-8 p-4 bg-linear-to-br from-brand-50 to-brand-50/50 dark:from-brand-500/5 dark:to-brand-500/10 rounded-xl border border-brand-200 dark:border-brand-500/20">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Ringkasan Harga
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Estimasi Modal
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(buyExpectedPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Harga Jual Final
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(finalSellPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Profit / Rugi
                  </p>
                  <p
                    className={`text-lg font-bold flex items-center gap-2 ${
                      priceDifference >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {priceDifference >= 0 ? (
                      <ArrowUpRight size={16} />
                    ) : (
                      <ArrowDownRight size={16} />
                    )}
                    {formatCurrency(Math.abs(priceDifference))}
                  </p>
                </div>
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="mb-6">
                <Label className="text-base font-semibold">Foto Produk</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Seret dan lepas untuk mengubah urutan foto
                </p>
              </div>

              {/* Unified Images Gallery with DND */}
              <div className="space-y-4">
                {catalogImages.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Foto ({catalogImages.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {catalogImages.map((img) => (
                        <div
                          key={img.id}
                          draggable
                          onDragStart={() => handleDragStart(img)}
                          onDragOver={handleDragOver}
                          onDrop={() => handleDrop(img)}
                          className={`relative group rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 cursor-move transition-all ${
                            draggedImage?.id === img.id
                              ? "border-brand-400 opacity-50"
                              : "border-gray-200 dark:border-gray-700 hover:border-brand-400"
                          }`}
                        >
                          <div className="aspect-square flex items-center justify-center">
                            {img.image ? (
                              <img
                                src={img.image}
                                alt={`Foto ${img.position}`}
                                className="w-full h-full object-cover"
                              />
                            ) : img.file ? (
                              <img
                                src={URL.createObjectURL(img.file)}
                                alt={`Foto ${img.position}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-gray-400 text-center">
                                <div className="text-xs">No image</div>
                              </div>
                            )}
                          </div>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => deleteImage(img.id!)}
                              className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 hover:bg-red-600 text-white rounded transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="absolute top-1 left-1 bg-gray-900/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                            <span>#{img.position}</span>
                            {img.id && img.id.startsWith("new-") && (
                              <span className="text-brand-300 text-xs">
                                NEW
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload New Images */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Tambah Foto Baru
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Upload hingga 5 foto tambahan untuk ditampilkan di katalog
                  </p>
                  <MultiDropzone
                    files={
                      catalogImages
                        .filter((img) => img.file)
                        .map((img) => img.file!) as File[]
                    }
                    onFilesChange={handleFilesSelected}
                    maxFiles={5}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => router.back()}
                disabled={state.type === "loading"}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                type="submit"
                onClick={handleSubmit}
                disabled={
                  !isFormValid ||
                  state.type === "loading" ||
                  isSubmitting ||
                  (!hasDiff && !hasImageChanges)
                }
              >
                {state.type === "loading" ? (
                  <>
                    <ClipLoader color="white" size={16} />
                    <span className="ml-2">Memperbarui...</span>
                  </>
                ) : (
                  "Perbarui Katalog"
                )}
              </Button>
            </div>
          </form>
        </ComponentCard>

        <AlertDialogDrawer
          open={openDeleteAlert}
          setOpen={setOpenDeleteAlert}
          type="warning"
          title="Hapus Katalog"
          description={`Apakah Anda yakin ingin menghapus katalog "${formData.displayName}"? Tindakan ini tidak dapat dibatalkan.`}
          buttonText="Hapus"
          onConfirm={handleDelete}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
};

export default EditCatalogPage;
