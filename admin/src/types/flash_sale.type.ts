export interface FlashSale {
  _id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FlashSaleInput {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}

export interface FlashSaleItem {
  _id: string
  flashSaleId: string | FlashSaleRef
  productId: string | ProductRef
  variantId?: string | VariantRef | null
  discountPercent: number
  createdAt: string
  updatedAt: string
}

export interface FlashSaleItemInput {
  flashSaleId: string
  productId: string
  variantId?: string | null
  discountPercent: number
}

export interface FlashSaleRef {
  _id: string
  name: string
}

export interface ProductRef {
  _id: string
  name: string
  price: number
}

export interface VariantRef {
  _id: string
  sku: string
  price: number
}
