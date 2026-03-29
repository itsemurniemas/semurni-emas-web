"use client";

import { useState, useMemo } from "react";
import SegmentedPicker from "@/components/ui/SegmentedPicker";
import { formatRupiah } from "@repo/core/extension/number";
import Image from "next/image";
import { usePriceListViewModel } from "@/components/content/usePriceListViewModel";

const PriceListSection = () => {
  const { state } = usePriceListViewModel();
  const [category, setCategory] = useState<
    "goldBar" | "goldJewelry" | "others"
  >("goldBar");

  const activeItems = useMemo(() => {
    if (state.type !== "success") return [];

    switch (category) {
      case "goldBar":
        return state.data.goldBarPriceList;
      case "goldJewelry":
        return state.data.goldJewelryPriceList;
      case "others":
        return state.data.othersPriceList;
      default:
        return [];
    }
  }, [state, category]);

  const renderTableContent = () => {
    switch (state.type) {
      case "initiate":
      case "loading":
        return Array.from({ length: 5 }).map((_, idx) => (
          <tr key={idx} className="border-b border-border/40 animate-pulse">
            <td className="py-4 px-6">
              <div className="flex items-center gap-4">
                <div className="h-4 bg-muted rounded w-36"></div>
              </div>
            </td>
            {category === "others" ? (
              <>
                <td className="py-4 px-6">
                  <div className="h-4 bg-muted rounded w-20 mx-auto"></div>
                </td>
                <td className="py-4 px-6">
                  <div className="h-4 bg-muted rounded w-20 mx-auto"></div>
                </td>
              </>
            ) : (
              <td className="py-4 px-6">
                <div className="h-4 bg-muted rounded w-24 mx-auto"></div>
              </td>
            )}
            <td className="py-4 px-6">
              <div className="h-4 bg-muted rounded w-24 ml-auto"></div>
            </td>
          </tr>
        ));

      case "error":
        return (
          <tr>
            <td
              colSpan={category === "others" ? 4 : 3}
              className="py-8 text-center text-destructive"
            >
              Gagal memuat daftar harga
            </td>
          </tr>
        );

      case "success":
        if (activeItems.length === 0) {
          return (
            <tr>
              <td
                colSpan={category === "others" ? 4 : 3}
                className="py-8 text-center text-muted-foreground"
              >
                Tidak ada data tersedia untuk kategori ini.
              </td>
            </tr>
          );
        }

        return activeItems.map((item) => {
          const priceData = item.buyPrice;

          return (
            <tr
              key={item.id}
              className="border-b border-border/40 hover:bg-muted/10 transition-colors last:border-0"
            >
              <td className="py-4 px-6">
                <div className="flex items-center gap-4">
                  {item.image && (
                    <div className="relative w-8 h-8 rounded overflow-hidden bg-muted">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <span className="text-sm font-light text-foreground">
                    {item.name}
                  </span>
                </div>
              </td>

              {category === "others" ? (
                <>
                  <td className="py-4 px-6 text-center text-sm font-light text-foreground">
                    {priceData.lowQualityPrice
                      ? formatRupiah(priceData.lowQualityPrice)
                      : "-"}
                  </td>
                  <td className="py-4 px-6 text-center text-sm font-light text-foreground">
                    {priceData.highQualityPrice
                      ? formatRupiah(priceData.highQualityPrice)
                      : "-"}
                  </td>
                </>
              ) : (
                <td className="py-4 px-6 text-center text-sm font-light text-foreground">
                  {priceData.price ? formatRupiah(priceData.price) : "-"}
                </td>
              )}

              <td className="py-4 px-6 text-right text-sm font-light text-muted-foreground">
                {item.lastUpdated}
              </td>
            </tr>
          );
        });

      default:
        return null;
    }
  };

  return (
    <section className="py-24 bg-muted/5">
      <div className="section-container">
        <div className="mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-light text-foreground mb-4">
              Daftar Harga Terkini
            </h2>
            <p className="text-muted-foreground font-light text-lg">
              Informasi harga emas dan logam mulia yang diperbarui setiap waktu
            </p>
          </div>
        </div>

        {/* Controllers */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <span className="text-sm font-light text-foreground min-w-[120px]">
              Kategori:
            </span>
            <SegmentedPicker
              options={[
                { label: "Emas Batangan", value: "goldBar" },
                { label: "Perhiasan Emas", value: "goldJewelry" },
                { label: "Logam Lainnya", value: "others" },
              ]}
              value={category}
              onChange={(val) =>
                setCategory(val as "goldBar" | "goldJewelry" | "others")
              }
              width="fit"
            />
          </div>
        </div>

        {/* Price Table */}
        <div className="overflow-x-auto border border-border/40 rounded-lg bg-card shadow-sm">
          <table className="w-auto md:w-full border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-muted/20">
                <th className="text-left py-4 px-6 text-sm font-light text-foreground">
                  Produk
                </th>
                {category === "others" ? (
                  <>
                    <th className="text-center py-4 px-6 text-sm font-light text-foreground">
                      Low Quality
                    </th>
                    <th className="text-center py-4 px-6 text-sm font-light text-foreground">
                      High Quality
                    </th>
                  </>
                ) : (
                  <th className="text-center py-4 px-6 text-sm font-light text-foreground">
                    Harga
                  </th>
                )}
                <th className="text-right py-4 px-6 text-sm font-light text-foreground">
                  Terakhir Diperbarui
                </th>
              </tr>
            </thead>
            <tbody>{renderTableContent()}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PriceListSection;
