import crypto from "crypto";

export interface MetalPrice {
  price: number | null;
  lowQualityPrice: number | null;
  highQualityPrice: number | null;
}

export interface MetalPriceItem {
  id: string;
  name: string;
  category: string;
  buyPrice: MetalPrice;
  sellPrice: MetalPrice;
  image: string | null;
}

export interface MetalPriceList {
  goldBarPriceList: MetalPriceItem[];
  goldJewelryPriceList: MetalPriceItem[];
  othersPriceList: MetalPriceItem[];
}

export interface DashboardMetalPriceListProps {
  title?: string;
  priceList: MetalPriceList;
  onTapEdit?: (item: MetalPriceItem) => void;
  onTapDelete?: (item: MetalPriceItem) => void;
  onTapPrice?: (item: MetalPriceItem, type: "buy" | "sell") => void;
  isSuperAdmin?: boolean;
}

const createPrice = (
  p: number | null = null,
  low: number | null = null,
  high: number | null = null,
): MetalPrice => ({
  price: p,
  lowQualityPrice: low,
  highQualityPrice: high,
});
const generateId = () => {
  try {
    return crypto.randomBytes(10).toString("hex");
  } catch (e) {
    return Math.random().toString(36).substring(2, 15);
  }
};

export const MOCK_METAL_PRICE_LIST: DashboardMetalPriceListProps = {
  title: "Daily Metal Prices",
  priceList: {
    goldBarPriceList: [
      {
        id: generateId(),
        name: "LM CERTI (2024 - 2025)",
        category: "GOLD_BAR",
        buyPrice: createPrice(2389753),
        sellPrice: createPrice(2463663),
        image: null,
      },
      {
        id: generateId(),
        name: "LM CERTI (2023)",
        category: "GOLD_BAR",
        buyPrice: createPrice(2319913),
        sellPrice: createPrice(2391663),
        image: null,
      },
      {
        id: generateId(),
        name: "LM CERTI (2021-2022)",
        category: "GOLD_BAR",
        buyPrice: createPrice(2308273),
        sellPrice: createPrice(2379663),
        image: null,
      },
      {
        id: generateId(),
        name: "LM CERTI (2018-2020)",
        category: "GOLD_BAR",
        buyPrice: createPrice(2300512),
        sellPrice: createPrice(2371662),
        image: null,
      },
      {
        id: generateId(),
        name: "LM RETRO K24 - 99,9%",
        category: "GOLD_BAR",
        buyPrice: createPrice(2298573),
        sellPrice: createPrice(2369663),
        image: null,
      },
      {
        id: generateId(),
        name: "UBS K24 - 99,9%",
        category: "GOLD_BAR",
        buyPrice: createPrice(2297603),
        sellPrice: createPrice(2368663),
        image: null,
      },
      {
        id: generateId(),
        name: "GOLDBAR K24 - 99,9%",
        category: "GOLD_BAR",
        buyPrice: createPrice(2297602),
        sellPrice: createPrice(2368662),
        image: null,
      },
      {
        id: generateId(),
        name: "GOLDBAR K24 - 99%",
        category: "GOLD_BAR",
        buyPrice: createPrice(2287902),
        sellPrice: createPrice(2358662),
        image: null,
      },
    ],
    goldJewelryPriceList: [
      {
        id: generateId(),
        name: "K24 99,9%",
        category: "GOLD_JEWELRY",
        buyPrice: createPrice(2172730),
        sellPrice: createPrice(2361663),
        image: null,
      },
      {
        id: generateId(),
        name: "K24 99%",
        category: "GOLD_JEWELRY",
        buyPrice: createPrice(2163530),
        sellPrice: createPrice(2351663),
        image: null,
      },
      {
        id: generateId(),
        name: "K23",
        category: "GOLD_JEWELRY",
        buyPrice: createPrice(1791019),
        sellPrice: createPrice(1946760),
        image: null,
      },
      {
        id: generateId(),
        name: "K22",
        category: "GOLD_JEWELRY",
        buyPrice: createPrice(1712498),
        sellPrice: createPrice(1861411),
        image: null,
      },
      {
        id: generateId(),
        name: "K21",
        category: "GOLD_JEWELRY",
        buyPrice: createPrice(1635847),
        sellPrice: createPrice(1778095),
        image: null,
      },
      {
        id: generateId(),
        name: "K20",
        category: "GOLD_JEWELRY",
        buyPrice: createPrice(1557326),
        sellPrice: createPrice(1692746),
        image: null,
      },
      {
        id: generateId(),
        name: "K18",
        category: "GOLD_JEWELRY",
        buyPrice: createPrice(1402154),
        sellPrice: createPrice(1524081),
        image: null,
      },
      {
        id: generateId(),
        name: "K14",
        category: "GOLD_JEWELRY",
        buyPrice: createPrice(1089941),
        sellPrice: createPrice(1184719),
        image: null,
      },
      {
        id: generateId(),
        name: "K10",
        category: "GOLD_JEWELRY",
        buyPrice: createPrice(777728),
        sellPrice: createPrice(845357),
        image: null,
      },
      {
        id: generateId(),
        name: "K5",
        category: "GOLD_JEWELRY",
        buyPrice: createPrice(388864),
        sellPrice: createPrice(422679),
        image: null,
      },
    ],
    othersPriceList: [
      {
        id: generateId(),
        name: "Silver Ingot",
        category: "OTHERS",
        buyPrice: createPrice(null, 25000, 28500),
        sellPrice: createPrice(null, 30000, 33309),
        image: null,
      },
      {
        id: generateId(),
        name: "Silver",
        category: "OTHERS",
        buyPrice: createPrice(null, 18000, 22077),
        sellPrice: createPrice(null, 22000, 27886),
        image: null,
      },
      {
        id: generateId(),
        name: "Platinum",
        category: "OTHERS",
        buyPrice: createPrice(null, 780000, 842165),
        sellPrice: createPrice(null, 950000, 1033566),
        image: null,
      },
      {
        id: generateId(),
        name: "Palladium",
        category: "OTHERS",
        buyPrice: createPrice(null, null, 638004),
        sellPrice: createPrice(null, 750000, 829405),
        image: null,
      },
      {
        id: generateId(),
        name: "Rhodium",
        category: "OTHERS",
        buyPrice: createPrice(null, 2400000, 2615814),
        sellPrice: createPrice(null, 2500000, 2807215),
        image: null,
      },
      {
        id: generateId(),
        name: "Iridium",
        category: "OTHERS",
        buyPrice: createPrice(null, 1500000, 1722609),
        sellPrice: createPrice(null, 1700000, 1914011),
        image: null,
      },
      {
        id: generateId(),
        name: "Tantalum",
        category: "OTHERS",
        buyPrice: createPrice(null, 1200000, 1440000),
        sellPrice: createPrice(null, 1400000, 1600000),
        image: null,
      },
    ],
  },
};
