import { Product } from "./Product";
import { fetchProducts } from "./api";
import { addToCart } from "./cart";
import { filterProducts } from "./filters";

let allProducts: Product[] = [];
let filteredProducts: Product[] = [];
let displayedProducts: Product[] = [];
let currentPage = 1;
const perPage = 6;

let selectedColor: string | undefined = undefined;
let selectedSize: string | undefined = undefined;
let selectedPrice: [number, number] | undefined = undefined;

let cartCount = 0;

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;
  if (cartCount > 0) {
    badge.textContent = cartCount.toString();
    badge.style.display = "flex";
  } else {
    badge.style.display = "none";
  }
}

function renderProducts(products: Product[]) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  grid.innerHTML = "";
  products.forEach((p) => {
    const div = document.createElement("div");
    div.className = "product-card";
    const imagePath = `img/${p.image.replace(/^.*[\\/]/, "")}`;
    div.innerHTML = `
     <img src="${imagePath}" alt="${p.name}" class="product-image">
      <div class="product-name">${p.name}</div>
      <div class="product-price">R$ ${p.price.toFixed(2)}</div>
      <div class="product-installments">até ${
        p.parcelamento[0]
      }x de R$${p.parcelamento[1].toFixed(2)}</div>
      <button class="buy-btn" data-id="${p.id}">COMPRAR</button>
    `;
    grid.appendChild(div);
  });

  document.querySelectorAll(".buy-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const id = (e.target as HTMLButtonElement).dataset.id!;
      const product = allProducts.find((p) => p.id === id);
      if (product) {
        addToCart(product);
        cartCount++;
        updateCartBadge();
      }
    })
  );
}

function applyFiltersAndRender(resetPage = true) {
  filteredProducts = filterProducts(
    allProducts,
    selectedColor,
    selectedSize,
    selectedPrice
  );
  if (resetPage) {
    displayedProducts = [];
    currentPage = 1;
  }
  loadMore();

  if (window.innerWidth <= 1024) {
    const mobileSidebar = document.getElementById("mobile-sidebar");
    const mobileSort = document.getElementById("mobile-sort-sidebar");
    mobileSidebar?.classList.remove("open");
    mobileSort?.classList.remove("open");
  }
}
function setupFilters() {
  document
    .querySelectorAll(".color-filters input[type=checkbox]")
    .forEach((el) => {
      el.addEventListener("change", (e) => {
        const checked = (e.target as HTMLInputElement).checked;
        selectedColor = checked
          ? (e.target as HTMLInputElement).nextElementSibling?.textContent ||
            undefined
          : undefined;
        applyFiltersAndRender();
      });
    });

  document.querySelectorAll(".size-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const isActive = btn.classList.contains("active");
      document
        .querySelectorAll(".size-btn")
        .forEach((b) => b.classList.remove("active"));
      if (!isActive) {
        btn.classList.add("active");
        selectedSize = (e.target as HTMLButtonElement).textContent || undefined;
      } else {
        selectedSize = undefined;
      }
      applyFiltersAndRender();
    });
  });

  document
    .querySelectorAll(".price-filters input[type=checkbox]")
    .forEach((el) => {
      el.addEventListener("change", (e) => {
        const checked = (e.target as HTMLInputElement).checked;
        if (checked) {
          document
            .querySelectorAll(".price-filters input[type=checkbox]")
            .forEach((other) => {
              if (other !== e.target)
                (other as HTMLInputElement).checked = false;
            });
          const label =
            (e.target as HTMLInputElement).nextElementSibling?.textContent ||
            "";
          if (label.includes("até R$50")) selectedPrice = [0, 50];
          else if (label.includes("até R$150")) selectedPrice = [51, 150];
          else if (label.includes("até R$300")) selectedPrice = [151, 300];
          else if (label.includes("até R$500")) selectedPrice = [301, 500];
          else if (label.includes("a partir de R$ 500"))
            selectedPrice = [501, Infinity];
        } else {
          selectedPrice = undefined;
        }
        applyFiltersAndRender();
      });
    });
}

function setupSorting() {
  const sortSelect = document.getElementById("sort") as HTMLSelectElement;
  if (!sortSelect) return;
  sortSelect.addEventListener("change", (e) => {
    const val = (e.target as HTMLSelectElement).value;
    if (val === "price-asc") filteredProducts.sort((a, b) => a.price - b.price);
    else if (val === "price-desc")
      filteredProducts.sort((a, b) => b.price - a.price);
    else if (val === "newest")
      filteredProducts.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    displayedProducts = [];
    currentPage = 1;
    loadMore();
  });
}

function loadMore() {
  const start = (currentPage - 1) * perPage;
  const end = currentPage * perPage;
  const next = filteredProducts.slice(start, end);
  displayedProducts = displayedProducts.concat(next);
  renderProducts(displayedProducts);
  currentPage++;
  const btn = document.querySelector(".load-more-btn") as HTMLButtonElement;
  if (btn)
    btn.style.display =
      displayedProducts.length >= filteredProducts.length
        ? "none"
        : "inline-block";
}

async function init() {
  allProducts = await fetchProducts();
  filteredProducts = allProducts.slice();
  setupFilters();
  setupSorting();
  const loadMoreBtn = document.querySelector(".load-more-btn");
  if (loadMoreBtn) loadMoreBtn.addEventListener("click", () => loadMore());
  applyFiltersAndRender();
}


function handleMobileButtons() {
  const mobileDiv = document.querySelector(".mobile-filters") as HTMLDivElement;
  if (!mobileDiv) return;
  if (window.innerWidth <= 1024) mobileDiv.style.display = "flex";
  else mobileDiv.style.display = "none";
}

function setupMobileSidebar() {
  const filterBtn = document.getElementById("filter-btn");
  const sidebar = document.getElementById("mobile-sidebar");
  const closeBtn = document.getElementById("mobile-sidebar-close");
  const applyBtn = document.getElementById("apply-filters");
  const clearBtn = document.getElementById("clear-filters");

  if (!filterBtn || !sidebar || !closeBtn || !applyBtn || !clearBtn) return;

  filterBtn.addEventListener("click", () => sidebar.classList.add("open"));

  closeBtn.addEventListener("click", () => sidebar.classList.remove("open"));

  applyBtn.addEventListener("click", () => {
    const checkedColor = sidebar.querySelector<HTMLInputElement>(
      ".color-filters input[type=checkbox]:checked"
    );
    selectedColor = checkedColor?.nextElementSibling?.textContent || undefined;

    const activeSize = sidebar.querySelector<HTMLButtonElement>(
      ".size-filters .size-btn.active"
    );
    selectedSize = activeSize?.textContent || undefined;

    const checkedPrice = sidebar.querySelector<HTMLInputElement>(
      ".price-filters input[type=checkbox]:checked"
    );
    if (checkedPrice) {
      const label = checkedPrice.nextElementSibling?.textContent || "";
      if (label.includes("até R$50")) selectedPrice = [0, 50];
      else if (label.includes("até R$150")) selectedPrice = [51, 150];
      else if (label.includes("até R$300")) selectedPrice = [151, 300];
      else if (label.includes("até R$500")) selectedPrice = [301, 500];
      else if (label.includes("a partir de R$ 500"))
        selectedPrice = [501, Infinity];
    } else selectedPrice = undefined;

    applyFiltersAndRender();
    sidebar.classList.remove("open");
  });

  clearBtn.addEventListener("click", () => {
    sidebar
      .querySelectorAll<HTMLInputElement>(
        ".color-filters input[type=checkbox], .price-filters input[type=checkbox]"
      )
      .forEach((el) => (el.checked = false));
    sidebar
      .querySelectorAll<HTMLButtonElement>(".size-filters .size-btn")
      .forEach((btn) => btn.classList.remove("active"));

    selectedColor = undefined;
    selectedSize = undefined;
    selectedPrice = undefined;
  });

  sidebar
    .querySelectorAll<HTMLButtonElement>(".size-filters .size-btn")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        sidebar
          .querySelectorAll(".size-filters .size-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
}

function setupMobileSortSidebar() {
  const sortBtn = document.getElementById("sort-btn");
  const sidebar = document.getElementById("mobile-sort-sidebar");
  const closeBtn = document.getElementById("mobile-sort-close");
  const options = sidebar?.querySelectorAll<HTMLElement>(".mobile-sort-option");

  if (!sortBtn || !sidebar || !closeBtn || !options) return;

  sortBtn.addEventListener("click", () => sidebar.classList.add("open"));

  closeBtn.addEventListener("click", () => sidebar.classList.remove("open"));

  options.forEach((option) => {
    option.addEventListener("click", () => {
      options.forEach((o) => o.classList.remove("selected"));
      option.classList.add("selected");
      const val = option.dataset.sort;
      if (val === "price-asc")
        filteredProducts.sort((a, b) => a.price - b.price);
      else if (val === "price-desc")
        filteredProducts.sort((a, b) => b.price - a.price);
      else if (val === "newest")
        filteredProducts.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      displayedProducts = [];
      currentPage = 1;
      loadMore();
      sidebar.classList.remove("open");
    });
  });
}
function handleMobileUI() {
  const mobileDiv = document.querySelector(".mobile-filters") as HTMLDivElement;
  if (!mobileDiv) return;
  if (window.innerWidth <= 1024) {
    mobileDiv.style.display = "flex";
    setupMobileSidebar();
    setupMobileSortSidebar();
  } else {
    mobileDiv.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  handleMobileButtons();
  setupMobileSidebar();
  setupMobileSortSidebar();
  handleMobileUI();
  updateCartBadge();
  init();
});