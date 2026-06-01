import type { BookableProduct, MuseumProduct } from "@/lib/travel-data";

export const DEFAULT_SERVICE_FEE = 9;

type PricedProduct = Pick<MuseumProduct | BookableProduct, "adultPrice" | "serviceFee">;

export function getServiceFee(product?: Pick<PricedProduct, "serviceFee">) {
  return product?.serviceFee ?? DEFAULT_SERVICE_FEE;
}

export function getAdultPackagePrice(product: PricedProduct) {
  return product.adultPrice + getServiceFee(product);
}
