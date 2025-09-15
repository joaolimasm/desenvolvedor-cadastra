import { Product } from "./Product";

const API_URL = "http://localhost:5000/products";

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(API_URL);
  return res.json();
}
