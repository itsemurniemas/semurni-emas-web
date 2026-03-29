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
  lastUpdated: string;
}

export interface MetalPriceListModel {
  goldBarPriceList: MetalPriceItem[];
  goldJewelryPriceList: MetalPriceItem[];
  othersPriceList: MetalPriceItem[];
}
