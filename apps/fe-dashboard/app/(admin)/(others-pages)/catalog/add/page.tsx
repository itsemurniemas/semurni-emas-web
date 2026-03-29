"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import MultiDropzone from "@/components/form/form-elements/MultiDropzone";
import { toast } from "react-toastify";
import PriceInputField from "@/components/form/input/PriceInput";
import {
  Plus,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import { useCreateCatalogViewModel } from "./useCreateCatalogViewModel";
import { useAuth, isSuperAdminRole } from "@/context/AuthContext";
import { APPROVED_PURPOSES, PRODUCT_CATEGORIES } from "@repo/core/index";

interface Material {
  id: string;
  materialName: string;
  materialId: string;
  quality: "LOW_QUALITY" | "HIGH_QUALITY" | undefined;
  weight: string;
  pricePerGram: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const AddCatalogPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const {
    state,
    createCatalog,
    priceListState,
    getMaterialOptions,
    getMaterialPrice,
    getMaterialCategory,
    branchListState,
    getBranchOptions,
  } = useCreateCatalogViewModel();

  const [formData, setFormData] = useState({
    displayName: "",
    totalWeight: "",
    price: "", // Final Price
    stock: "",
    percentage: "100",
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

  const [files, setFiles] = useState<File[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const expectedPrice = useMemo(() => {
    const basePrice = materials.reduce((sum, m) => {
      const weightNum = parseFloat(m.weight) || 0;
      return sum + weightNum * m.pricePerGram;
    }, 0);
    const percentage = parseFloat(formData.percentage) || 0;
    return basePrice * (percentage / 100);
  }, [materials, formData.percentage]);

  const finalSellPrice = useMemo(() => {
    const percentage = parseFloat(formData.percentage) || 0;
    const finalPrice = parseFloat(formData.price) || 0;
    return finalPrice * (percentage / 100);
  }, [formData.price, formData.percentage]);

  // Calculate estimasi modal using buy prices
  const buyExpectedPrice = useMemo(() => {
    if (priceListState.type !== "success") return expectedPrice;

    const basePrice = materials.reduce((sum, m) => {
      if (!m.materialId) return sum;

      const allItems = [
        ...priceListState.data.goldJewelryPriceList,
        ...priceListState.data.goldBarPriceList,
        ...priceListState.data.othersPriceList,
      ];
      const item = allItems.find((i) => i.id === m.materialId);
      if (!item) return sum;

      let buyPrice = 0;
      if (item.category === "NON_GOLD") {
        if (m.quality === "LOW_QUALITY")
          buyPrice = item.buyPrice.lowQualityPrice || 0;
        else if (m.quality === "HIGH_QUALITY")
          buyPrice = item.buyPrice.highQualityPrice || 0;
      } else {
        buyPrice = item.buyPrice.price || 0;
      }

      const weightNum = parseFloat(m.weight) || 0;
      return sum + weightNum * buyPrice;
    }, 0);
    return basePrice;
  }, [materials, priceListState]);

  const priceDifference = finalSellPrice - buyExpectedPrice;

  const netWeightGram = materials.reduce((sum, m) => {
    return sum + (parseFloat(m.weight) || 0);
  }, 0);

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
    const isSuperAdmin = isSuperAdminRole(user?.role);

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
      isBranchValid &&
      files.length > 0;

    setIsFormValid(isValid);
  }, [formData, files, materials, getMaterialCategory, user?.role?.name]);

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
    if (expectedPrice > 0) {
      setFormData((prev) => ({
        ...prev,
        price: expectedPrice.toString(),
      }));
    }
  }, [expectedPrice]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  const updateMaterial = (id: string, field: keyof Material, value: string) => {
    setMaterials(
      materials.map((m) => {
        if (m.id === id) {
          if (field === "materialName") {
            const price = getMaterialPrice(value);
            setFormData((prev) => ({ ...prev, productId: value }));
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
        // Convert files to base64
        const imagePromises = files.map((file, index) => {
          return new Promise<{ image: string; position: number }>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve({
                image: reader.result as string,
                position: index + 1,
              });
            };
            reader.readAsDataURL(file);
          });
        });

        const images = await Promise.all(imagePromises);
        const isSuperAdmin = isSuperAdminRole(user?.role);

        const finalPriceNum = parseFloat(formData.price) || 0;
        const taraPrice = finalPriceNum - expectedPrice;

        const catalogRequest = {
          displayName: formData.displayName,
          totalWeightGram: parseFloat(formData.totalWeight),
          netWeightGram: netWeightGram,
          taraPrice: taraPrice,
          quality: formData.quality || null,
          category: formData.category,
          approvedPurpose: formData.purpose,
          isDisplayed: formData.isVisible,
          quantity: parseInt(formData.stock),
          percentage: (parseFloat(formData.percentage) || 0) * 0.01,
          productId: formData.productId || "",
          branchId: isSuperAdmin ? formData.branchId : "",
          images,
        };

        await createCatalog(catalogRequest);
        toast.success("Katalog berhasil ditambahkan!");
        router.push("/catalog");
      } catch (error: any) {
        toast.error(error?.message || "Gagal menambahkan katalog");
      }
    }
  };

  return (
    <div className="pb-28 md:pb-20">
      <PageBreadcrumb pageTitle="Tambah Katalog" />
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
                    placeholder="Pilih Tujuan"
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
                  <PriceInputField
                    label="Harga Akhir Jual (Rp)"
                    value={formData.price}
                    onChange={(rawValue) =>
                      setFormData((prev) => ({ ...prev, price: rawValue }))
                    }
                    placeholder="Masukkan harga jual final"
                  />
                </div>

                {/* Branch Selection - Only for Super Admin */}
                {isSuperAdminRole(user?.role) && (
                  <div>
                    <Label>Cabang</Label>
                    <Select
                      options={getBranchOptions()}
                      value={formData.branchId}
                      onChange={(value) =>
                        handleSelectChange("branchId", value)
                      }
                      placeholder="Pilih cabang"
                    />
                  </div>
                )}

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
                      <div
                        key={material.id}
                        className="flex gap-2 items-end group animate-in slide-in-from-left-2 duration-300 flex-wrap"
                      >
                        {/* Material Select */}
                        <div className="flex-1 min-w-40">
                          {index === 0 && (
                            <Label className="text-[10px] uppercase text-gray-500">
                              Material
                            </Label>
                          )}
                          <Select
                            options={getMaterialOptions()}
                            placeholder="Pilih Material"
                            onChange={(value) =>
                              updateMaterial(material.id, "materialName", value)
                            }
                          />
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
                                { value: "LOW_QUALITY", label: "Low Quality" },
                                {
                                  value: "HIGH_QUALITY",
                                  label: "High Quality",
                                },
                              ]}
                              placeholder="Pilih Kualitas"
                              onChange={(value) =>
                                updateMaterial(material.id, "quality", value)
                              }
                            />
                          </div>
                        )}

                        {/* Weight Input */}
                        <div className="w-22">
                          {index === 0 && (
                            <Label className="text-[10px] uppercase text-gray-500">
                              Berat Bersih (g)
                            </Label>
                          )}
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={material.weight}
                            onChange={(e) =>
                              updateMaterial(
                                material.id,
                                "weight",
                                e.target.value,
                              )
                            }
                            className="text-center"
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
                          <div className="h-11 flex items-center justify-center px-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-gray-900 dark:text-white">
                            {(
                              parseFloat(formData.totalWeight) -
                                parseFloat(material.weight) || 0
                            ).toFixed(2)}
                          </div>
                        </div>

                        {/* Estimate */}
                        <div className="flex-1 text-right min-w-28">
                          {index === 0 && (
                            <Label className="text-[10px] uppercase text-gray-500">
                              Estimasi
                            </Label>
                          )}
                          <div className="h-11 flex items-center justify-end px-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(rowTotal)}
                          </div>
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
                  />
                </div>

                <div className="p-4 bg-brand-50/50 dark:bg-brand-500/5 rounded-xl border border-brand-100 dark:border-brand-500/20 flex justify-between items-center transition-all duration-300">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Total Harga Estimasi:
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white underline decoration-brand-500/50 underline-offset-4 decoration-2">
                    {formatCurrency(expectedPrice)}
                  </span>
                </div>
              </div>
            </div>
          </form>
        </ComponentCard>

        {/* Bottom Section: Media + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <ComponentCard title="Foto Produk">
              <MultiDropzone
                files={files}
                onFilesChange={handleFilesSelected}
                maxFiles={5}
                accept={{
                  "image/png": [".png"],
                  "image/jpeg": [".jpeg", ".jpg"],
                }}
                onSuccess={(file) =>
                  toast.success(`File ${file.name} ditambahkan.`)
                }
                onError={(err) => toast.error(err)}
              />
            </ComponentCard>
          </div>

          <div className="space-y-6">
            <ComponentCard title="Ringkasan Harga">
              <div className="space-y-5">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">
                      Estimasi Modal
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(buyExpectedPrice)}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">
                      Harga Jual
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(finalSellPrice)}
                    </p>
                  </div>
                </div>

                {formData.price && expectedPrice > 0 && (
                  <div
                    className={`p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 animate-in zoom-in-95 duration-300 ${
                      priceDifference >= 0
                        ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-500/20"
                        : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-500/20"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-widest">
                      {priceDifference >= 0 ? (
                        <ArrowUpRight size={14} />
                      ) : (
                        <ArrowDownRight size={14} />
                      )}
                      {priceDifference >= 0
                        ? "Margin Keuntungan"
                        : "Potensi Kerugian"}
                    </div>
                    <p className="text-xl font-black tabular-nums">
                      {priceDifference >= 0 ? "+" : ""}
                      {formatCurrency(priceDifference)}
                    </p>
                    <p className="text-[10px] opacity-70 leading-tight max-w-45">
                      {priceDifference >= 0
                        ? "Harga jual sudah mengcover seluruh estimasi modal material."
                        : "Peringatan: Harga jual masih dibawah estimasi modal material!"}
                    </p>
                  </div>
                )}
              </div>
            </ComponentCard>

            <Button
              className="w-full h-14 text-lg font-bold shadow-xl shadow-brand-500/10 group overflow-hidden relative"
              disabled={!isFormValid || state.type === "loading"}
              type="submit"
              onClick={() => handleSubmit()}
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {state.type === "loading" ? (
                  <>
                    <ClipLoader size={20} color="currentColor" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Simpan Katalog</span>
                )}
              </div>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Floating Summary Indicator */}
      {expectedPrice > 0 && (
        <div className="fixed bottom-6 left-6 right-6 z-100 md:hidden">
          <div className="bg-gray-900 dark:bg-gray-800 text-white p-4 rounded-2xl flex items-center justify-between shadow-2xl border border-white/10 backdrop-blur-lg">
            <div className="space-y-0.5">
              <span className="text-[8px] uppercase font-bold text-gray-400 tracking-wider">
                Harga Jual Final
              </span>
              <p className="text-sm font-bold">
                {formatCurrency(expectedPrice)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-px h-8 bg-gray-700" />
              <div className="text-right space-y-0.5">
                <span className="text-[8px] uppercase font-bold text-gray-400 tracking-wider">
                  Profit/Rugi
                </span>
                <p
                  className={`text-sm font-bold ${
                    priceDifference >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {priceDifference >= 0 ? "+" : ""}
                  {formatCurrency(priceDifference)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCatalogPage;
