import { Product } from "./Product";

export function filterProducts(
  products: Product[],
  color?: string,
  size?: string,
  priceRange?: [number, number]
): Product[] {
  return products.filter((p) => {
    const byColor = color ? p.color === color : true;
    const bySize = size ? p.size.includes(size) : true;
    const byPrice =
      priceRange ? p.price >= priceRange[0] && p.price <= priceRange[1] : true;
    return byColor && bySize && byPrice;
  });
}
