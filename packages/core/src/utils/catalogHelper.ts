import { CatalogModel } from "../entities";

/**
 * Calculate the total price of a catalog item based on its weight and product prices
 * Formula: (netWeightGram * sellPrice + tarraPrice) * (1 + percentage / 100)
 *
 * For GOLD_JEWELRY: uses goldJewelryItem.sellPricePerGram
 * For GOLD_BAR: uses goldBarItem.sellPricePerGram
 * For NON_GOLD: always uses highQualitySellPricePerGram (ignores quality field)
 *
 * @param catalog - The catalog object containing product and pricing information
 * @param taraPrice - Optional additional price/markup to add (default: 0)
 * @returns The calculated total price with percentage applied
 */
export const calculateCatalogPrice = (catalog: CatalogModel): number => {
  let sellPricePerGram = 0;

  if (catalog.product.goldJewelryItem) {
    sellPricePerGram = catalog.product.goldJewelryItem.sellPricePerGram || 0;
  } else if (catalog.product.goldBarItem) {
    sellPricePerGram = catalog.product.goldBarItem.sellPricePerGram || 0;
  } else if (catalog.product.nonGoldItem) {
    // For NON_GOLD items, get the quality from catalog
    const quality = (catalog as any).quality;
    sellPricePerGram =
      catalog.product.nonGoldItem.highQualitySellPricePerGram || 0;

    // if (quality === "HIGH_QUALITY") {
    //   sellPricePerGram =
    //     catalog.product.nonGoldItem.highQualitySellPricePerGram || 0;
    // } else if (quality === "LOW_QUALITY") {
    //   sellPricePerGram =
    //     catalog.product.nonGoldItem.lowQualitySellPricePerGram || 0;
    // } else {
    //   // Default to HIGH_QUALITY if quality not specified
    //   sellPricePerGram =
    //     catalog.product.nonGoldItem.highQualitySellPricePerGram || 0;
    // }
  }

  const basePrice =
    catalog.netWeightGram * sellPricePerGram + catalog.taraPrice || 0;
  const percentage = catalog.percentage || 1;
  return basePrice * percentage;
};

/**
 * Format price as IDR currency string
 *
 * @param price - The price amount to format
 * @returns Formatted currency string (e.g., "Rp 1.000.000")
 */
export const formatPriceIDR = (price: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

/**
 * List of approved purposes with their display labels
 */
export const APPROVED_PURPOSES = [
  { value: "SELLING", label: "Penjualan" },
  { value: "PROCESS", label: "Proses" },
  { value: "SHOT", label: "Tembakan" },
  { value: "STOCK", label: "Stok" },
];

/**
 * Get the display label for an approved purpose value
 *
 * @param purpose - The approved purpose enum value
 * @returns The display label (e.g., "SELLING" → "Penjualan")
 */
export const getApprovedPurposeLabel = (purpose: string | null): string => {
  const found = APPROVED_PURPOSES.find((p) => p.value === purpose);
  return found ? found.label : "-";
};

/**
 * Product type options - used for filtering
 * Valid values: GOLD_JEWELRY, GOLD_BAR, NON_GOLD
 */
export const PRODUCT_TYPES = [
  { value: "GOLD_JEWELRY", label: "Perhiasan Emas" },
  { value: "GOLD_BAR", label: "Emas Batangan" },
  { value: "NON_GOLD", label: "Logam Lainnya" },
];

/**
 * Product category options - used for filtering
 * Valid values: RING, NECKLACE, BRACELET, EARRING, PENDANT, GOLD_BAR, OTHER
 */
export const PRODUCT_CATEGORIES = [
  { value: "RING", label: "Cincin" },
  { value: "NECKLACE", label: "Kalung" },
  { value: "BRACELET", label: "Gelang" },
  { value: "EARRINGS", label: "Anting" },
  { value: "GOLD_BAR", label: "Emas Batangan" },
  { value: "OTHER", label: "Lainnya" },
];

/**
 * Display categories - used in UI for product type grouping
 * (different from PRODUCT_CATEGORIES which are specific item categories)
 */
export const DISPLAY_CATEGORIES = [
  { value: "jewelry", label: "Perhiasan Emas" },
  { value: "bar", label: "Emas Batangan" },
  { value: "metal", label: "Logam Lainnya" },
];

/**
 * Get the display label for a product type value
 *
 * @param type - The product type enum value
 * @returns The display label (e.g., "GOLD_JEWELRY" → "Perhiasan Emas")
 */
export const getProductTypeLabel = (type: string): string => {
  const found = PRODUCT_TYPES.find((t) => t.value === type);
  return found ? found.label : type;
};

/**
 * Get the display label for a product category value
 *
 * @param category - The product category enum value
 * @returns The display label (e.g., "RING" → "Cincin")
 */
export const getProductCategoryLabel = (category: string): string => {
  const found = PRODUCT_CATEGORIES.find((c) => c.value === category);
  return found ? found.label : category;
};
