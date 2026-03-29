export interface CatalogImageModel {
  id: string;
  image: string;
  catalogId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ProductPriceModel {
  lowQualityBuyPricePerGram?: number | null;
  lowQualitySellPricePerGram?: number | null;
  highQualityBuyPricePerGram?: number | null;
  highQualitySellPricePerGram?: number | null;
}

export interface GoldJewelryItemModel extends ProductPriceModel {
  id: string;
  buyPricePerGram: number;
  sellPricePerGram: number;
  productId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface GoldBarItemModel extends ProductPriceModel {
  id: string;
  buyPricePerGram: number;
  sellPricePerGram: number;
  productId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface NonGoldItemModel extends ProductPriceModel {
  id: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ProductModel {
  id: string;
  productType: "GOLD_JEWELRY" | "GOLD_BAR" | "NON_GOLD";
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  goldJewelryItem: GoldJewelryItemModel | null;
  goldBarItem: GoldBarItemModel | null;
  nonGoldItem: NonGoldItemModel | null;
}

export interface BranchModel {
  id: string;
  name: string;
  telp: string;
  city: string;
  province: string;
  subdistrict: string;
  ward: string;
  postalCode: string;
  fullAddress: string;
  shortAddress: string;
  area: string;
  latitude: string;
  longitude: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UserModel {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CatalogModel {
  id: string;
  displayName: string;
  totalWeightGram: number;
  taraWeightGram: number;
  grossWeightGram: number;
  netWeightGram: number;
  approvedPurpose: string | null;
  category: string;
  isDisplayed: boolean;
  quantity: number;
  approvedByUserId: string | null;
  productId: string;
  branchId: string;
  quality?: string | null;
  percentage?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  images: CatalogImageModel[];
  product: ProductModel;
  branch: BranchModel;
  approvedBy: UserModel | null;
  taraPrice: number;
}

export interface PaginationMetadata {
  hasMore: boolean;
  nextPageUrl: string | null;
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface CatalogListResponse extends PaginationMetadata {
  data: CatalogModel[];
}
