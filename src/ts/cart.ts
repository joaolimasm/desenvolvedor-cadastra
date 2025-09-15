import { Product } from "./Product";

let cart: Product[] = [];

export function addToCart(product: Product) {
  cart.push(product);
  updateCartCount();
}

export function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (el) el.textContent = cart.length.toString();
}
