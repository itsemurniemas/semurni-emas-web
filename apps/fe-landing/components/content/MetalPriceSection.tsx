"use client";

import React, { useState } from "react";
import SegmentedPicker from "@/components/ui/SegmentedPicker";
import { formatRupiah, toPercentageSafe } from "@repo/core/extension/number";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const MetalPriceSection = () => {
  const [activeKarat, setActiveKarat] = useState("24");

  const karatOptions = [
    { label: "24 Karat", value: "24" },
    { label: "22 Karat", value: "22" },
    { label: "18 Karat", value: "18" },
  ];

  interface PriceItem {
    buy: number;
    buyChange: number;
    sell: number;
    sellChange: number;
  }

  const priceData: Record<string, PriceItem> = {
    "24": {
      buy: 1250000,
      buyChange: 0.045,
      sell: 1150000,
      sellChange: 0.021,
    },
    "22": {
      buy: 1100000,
      buyChange: -0.012,
      sell: 1020000,
      sellChange: 0.005,
    },
    "18": {
      buy: 950000,
      buyChange: 0.038,
      sell: 880000,
      sellChange: -0.014,
    },
  };

  const currentPrice = priceData[activeKarat];

  const TrendIndicator = ({ change }: { change: number }) => {
    if (change === 0) return null;
    const isUp = change > 0;
    const Icon = isUp ? TrendingUp : TrendingDown;
    const colorClass = isUp ? "text-lime-600" : "text-red-500";

    return (
      <div className={cn("flex items-center gap-1 mb-1", colorClass)}>
        <Icon size={18} />
        <span className="text-lg font-medium">{toPercentageSafe(change)}</span>
      </div>
    );
  };

  return (
    currentPrice && (
      <section className="py-16 bg-muted/30">
        <div className="section-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <h2 className="text-3xl font-light text-foreground">
              Harga Emas terkini
            </h2>

            {/* Karat Tabs */}
            <div className="w-fit">
              <SegmentedPicker
                options={karatOptions}
                value={activeKarat}
                onChange={setActiveKarat}
                width="fit"
              />
            </div>
          </div>

          {/* Prices Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-24 mb-12">
            {/* Harga Beli */}
            <div className="space-y-3">
              <p className="text-sm font-light text-muted-foreground">
                Harga Beli
              </p>
              <div className="flex items-baseline gap-4 flex-wrap">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-normal text-foreground whitespace-nowrap">
                  {formatRupiah(currentPrice.buy)}
                </span>
                <TrendIndicator change={currentPrice.buyChange} />
              </div>
            </div>

            {/* Harga Jual */}
            <div className="space-y-3">
              <p className="text-sm font-light text-muted-foreground">
                Harga Jual
              </p>
              <div className="flex items-baseline gap-4 flex-wrap">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-normal text-foreground whitespace-nowrap">
                  {formatRupiah(currentPrice.sell)}
                </span>
                <TrendIndicator change={currentPrice.sellChange} />
              </div>
            </div>
          </div>

          {/* CTA Link */}
          <Link
            href="/pricelist"
            className="inline-flex items-center text-sm font-light text-muted-foreground hover:text-foreground transition-colors group"
          >
            Lihat daftar harga selengkapnya
            <ArrowRight
              size={16}
              className="ml-2 transform transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>
    )
  );
};

export default MetalPriceSection;
