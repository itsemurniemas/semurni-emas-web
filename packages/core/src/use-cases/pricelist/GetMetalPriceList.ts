import { ApiUseCase } from "../../base/ApiUseCase";
import {
  MetalPriceListModel,
  MetalPriceItem,
} from "../../entities/pricelist/MetalPriceListModel";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

interface ApiPrice {
  price: number | null;
  lowQualityPrice: number | null;
  highQualityPrice: number | null;
}

interface GoldJewelryItem {
  id: string;
  productType: "GOLD_JEWELRY";
  name: string;
  goldJewelryItem: {
    buyPricePerGram: number;
    sellPricePerGram: number;
  };
  createdAt: string;
}

interface GoldBarItem {
  id: string;
  productType: "GOLD_BAR";
  name: string;
  goldBarItem: {
    buyPricePerGram: number;
    sellPricePerGram: number;
  };
  createdAt: string;
}

interface NonGoldItem {
  id: string;
  productType: "NON_GOLD";
  name: string;
  nonGoldItem: {
    lowQualityBuyPricePerGram: number | null;
    lowQualitySellPricePerGram: number | null;
    highQualityBuyPricePerGram: number | null;
    highQualitySellPricePerGram: number | null;
  };
  createdAt: string;
}

interface PriceListApiResponse {
  code: number;
  message: string;
  data: {
    GOLD_JEWELRY: GoldJewelryItem[];
    GOLD_BAR: GoldBarItem[];
    NON_GOLD: NonGoldItem[];
  };
}

export class GetMetalPriceList extends ApiUseCase<void, MetalPriceListModel> {
  async execute(): Promise<MetalPriceListModel> {
    const response = await this.request<PriceListApiResponse>(
      `/products`,
      HttpMethod.GET,
    );
    return this.mapApiResponseToModel(response);
  }

  async executeMock(): Promise<MetalPriceListModel> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = this.generateMockData();
        resolve(mockData);
      }, 1500);
    });
  }

  private mapApiResponseToModel(
    apiResponse: PriceListApiResponse,
  ): MetalPriceListModel {
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    const createPrice = (
      price: number | null = null,
      low: number | null = null,
      high: number | null = null,
    ): ApiPrice => ({
      price,
      lowQualityPrice: low,
      highQualityPrice: high,
    });

    // Map GOLD_JEWELRY items
    const goldJewelryPriceList: MetalPriceItem[] =
      apiResponse.data.GOLD_JEWELRY.map((item) => ({
        id: item.id,
        name: item.name,
        category: "GOLD_JEWELRY",
        buyPrice: createPrice(item.goldJewelryItem.buyPricePerGram),
        sellPrice: createPrice(item.goldJewelryItem.sellPricePerGram),
        image: null,
        lastUpdated: formatDate(item.createdAt),
      }));

    // Map GOLD_BAR items
    const goldBarPriceList: MetalPriceItem[] = apiResponse.data.GOLD_BAR.map(
      (item) => ({
        id: item.id,
        name: item.name,
        category: "GOLD_BAR",
        buyPrice: createPrice(item.goldBarItem.buyPricePerGram),
        sellPrice: createPrice(item.goldBarItem.sellPricePerGram),
        image: null,
        lastUpdated: formatDate(item.createdAt),
      }),
    );

    // Map NON_GOLD items
    const othersPriceList: MetalPriceItem[] = apiResponse.data.NON_GOLD.map(
      (item) => ({
        id: item.id,
        name: item.name,
        category: "NON_GOLD",
        buyPrice: createPrice(
          null,
          item.nonGoldItem.lowQualityBuyPricePerGram,
          item.nonGoldItem.highQualityBuyPricePerGram,
        ),
        sellPrice: createPrice(
          null,
          item.nonGoldItem.lowQualitySellPricePerGram,
          item.nonGoldItem.highQualitySellPricePerGram,
        ),
        image: null,
        lastUpdated: formatDate(item.createdAt),
      }),
    );

    return {
      goldBarPriceList,
      goldJewelryPriceList,
      othersPriceList,
    };
  }

  private generateMockData(): MetalPriceListModel {
    const createPrice = (
      p: number | null = null,
      low: number | null = null,
      high: number | null = null,
    ) => ({
      price: p,
      lowQualityPrice: low,
      highQualityPrice: high,
    });

    const generateId = () => Math.random().toString(36).substring(2, 15);

    return {
      goldBarPriceList: [
        {
          id: generateId(),
          name: "LM CERTI (2024 - 2025)",
          category: "GOLD_BAR",
          buyPrice: createPrice(2389753),
          sellPrice: createPrice(2463663),
          image: null,
          lastUpdated: "06 Jan 2026",
        },
        {
          id: generateId(),
          name: "LM CERTI (2023)",
          category: "GOLD_BAR",
          buyPrice: createPrice(2319913),
          sellPrice: createPrice(2391663),
          image: null,
          lastUpdated: "06 Jan 2026",
        },
        {
          id: generateId(),
          name: "LM CERTI (2021-2022)",
          category: "GOLD_BAR",
          buyPrice: createPrice(2308273),
          sellPrice: createPrice(2379663),
          image: null,
          lastUpdated: "06 Jan 2026",
        },
        {
          id: generateId(),
          name: "LM CERTI (2018-2020)",
          category: "GOLD_BAR",
          buyPrice: createPrice(2300512),
          sellPrice: createPrice(2371662),
          image: null,
          lastUpdated: "06 Jan 2026",
        },
        {
          id: generateId(),
          name: "LM RETRO K24 - 99,9%",
          category: "GOLD_BAR",
          buyPrice: createPrice(2298573),
          sellPrice: createPrice(2369663),
          image: null,
          lastUpdated: "06 Jan 2026",
        },
        {
          id: generateId(),
          name: "UBS K24 - 99,9%",
          category: "GOLD_BAR",
          buyPrice: createPrice(2297603),
          sellPrice: createPrice(2368663),
          image: null,
          lastUpdated: "06 Jan 2026",
        },
        {
          id: generateId(),
          name: "GOLDBAR K24 - 99,9%",
          category: "GOLD_BAR",
          buyPrice: createPrice(2297602),
          sellPrice: createPrice(2368662),
          image: null,
          lastUpdated: "06 Jan 2026",
        },
        {
          id: generateId(),
          name: "GOLDBAR K24 - 99%",
          category: "GOLD_BAR",
          buyPrice: createPrice(2287902),
          sellPrice: createPrice(2358662),
          image: null,
          lastUpdated: "06 Jan 2026",
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
          lastUpdated: "06 Jan 2026",
        },
        {
          id: generateId(),
          name: "K24 99%",
          category: "GOLD_JEWELRY",
          buyPrice: createPrice(2163530),
          sellPrice: createPrice(2351663),
          image: null,
          lastUpdated: "06 Jan 2026",
        },
        {
          id: generateId(),
          name: "K23",
          category: "GOLD_JEWELRY",
          buyPrice: createPrice(1791019),
          sellPrice: createPrice(1946760),
          image: null,
          lastUpdated: "06 Jan 2026",
        },
        {
          id: generateId(),
          name: "K22",
          category: "GOLD_JEWELRY",
          buyPrice: createPrice(1712498),
          sellPrice: createPrice(1861411),
          image: null,
          lastUpdated: "06 Jan 2026",
        },
        {
          id: generateId(),
          name: "K21",
          category: "GOLD_JEWELRY",
          buyPrice: createPrice(1635847),
          sellPrice: createPrice(1778095),
          image: null,
          lastUpdated: "06 Jan 2026",
        },
        {
          id: generateId(),
          name: "K20",
          category: "GOLD_JEWELRY",
          buyPrice: createPrice(1557326),
          sellPrice: createPrice(1692746),
          image: null,
          lastUpdated: "06 Jan 2026",
        },
        {
          id: generateId(),
          name: "K18",
          category: "GOLD_JEWELRY",
          buyPrice: createPrice(1402154),
          sellPrice: createPrice(1524081),
          image: null,
          lastUpdated: "06 Jan 2026",
        },
        {
          id: generateId(),
          name: "K14",
          category: "GOLD_JEWELRY",
          buyPrice: createPrice(1089941),
          sellPrice: createPrice(1184719),
          image: null,
          lastUpdated: "06 Jan 2026",
        },
        {
          id: generateId(),
          name: "K10",
          category: "GOLD_JEWELRY",
          buyPrice: createPrice(777728),
          sellPrice: createPrice(845357),
          image: null,
          lastUpdated: "06 Jan 2026",
        },
        {
          id: generateId(),
          name: "K5",
          category: "GOLD_JEWELRY",
          buyPrice: createPrice(388864),
          sellPrice: createPrice(422679),
          image: null,
          lastUpdated: "06 Jan 2026",
        },
      ],
      othersPriceList: [
        {
          id: generateId(),
          name: "Silver Ingot",
          category: "NON_GOLD",
          buyPrice: createPrice(null, 25000, 28500),
          sellPrice: createPrice(null, 30000, 33309),
          image: null,
          lastUpdated: "06 Jan 2026",
        },
        {
          id: generateId(),
          name: "Silver",
          category: "NON_GOLD",
          buyPrice: createPrice(null, 18000, 22077),
          sellPrice: createPrice(null, 22000, 27886),
          image: null,
          lastUpdated: "06 Jan 2026",
        },
        {
          id: generateId(),
          name: "Platinum",
          category: "NON_GOLD",
          buyPrice: createPrice(null, 780000, 842165),
          sellPrice: createPrice(null, 950000, 1033566),
          image: null,
          lastUpdated: "06 Jan 2026",
        },
        {
          id: generateId(),
          name: "Palladium",
          category: "NON_GOLD",
          buyPrice: createPrice(null, null, 638004),
          sellPrice: createPrice(null, 750000, 829405),
          image: null,
          lastUpdated: "06 Jan 2026",
        },
        {
          id: generateId(),
          name: "Rhodium",
          category: "NON_GOLD",
          buyPrice: createPrice(null, 2400000, 2615814),
          sellPrice: createPrice(null, 2500000, 2807215),
          image: null,
          lastUpdated: "06 Jan 2026",
        },
        {
          id: generateId(),
          name: "Iridium",
          category: "NON_GOLD",
          buyPrice: createPrice(null, 1500000, 1722609),
          sellPrice: createPrice(null, 1700000, 1914011),
          image: null,
          lastUpdated: "06 Jan 2026",
        },
        {
          id: generateId(),
          name: "Tantalum",
          category: "NON_GOLD",
          buyPrice: createPrice(null, 1200000, 1440000),
          sellPrice: createPrice(null, 1400000, 1600000),
          image: null,
          lastUpdated: "06 Jan 2026",
        },
      ],
    };
  }
}
