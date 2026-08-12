import header from "../../shared/components/header/header.js";
import footer from "../../shared/components/footer/footer.js";
import loadComponentStyle from "../../shared/js/renderHeaderAndFooter.js";

loadComponentStyle();

const API = "http://localhost:3000/products";

const productList = document.getElementById("product-list");

let allProducts = [];

// fetch du lieu
async function getProducts() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    allProducts = data;
    renderProducts(allProducts);
  } catch (err) {
    console.error("Lỗi load data:", err);
  }
}

// render UI
const renderProducts = (products) => {
  productList.innerHTML = products
    .map(
      (p) => `
      <div class="col-md-3">
        <a href="../productDetails/productDetails.html?id=${p.id}">
          <div class="card">
            <img src="${p.image}" class="card-img-top"/>
            <div class="card-body">
              <h5>${p.name}</h5>
              <p id="product-price">${p.price}đ</p>
            </div>
          </div>
        </a>
      </div>
    `,
    )
    .join("");
};

getProducts();

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const resetBtn = document.getElementById("resetBtn");

function filterProducts() {
  let result = [...allProducts];

  // filter theo ten
  const keyword = searchInput.value.toLowerCase();
  if (keyword) {
    result = result.filter((p) => p.name.toLowerCase().includes(keyword));
  }

  // filter danh muc
  const category = categoryFilter.value;
  if (category !== "all") {
    result = result.filter((p) => p.category == category);
  }

  // filter gia
  const price = priceFilter.value;

  if (price === "1") {
    result = result.filter((p) => p.price < 100000);
  } else if (price === "2") {
    result = result.filter((p) => p.price >= 100000 && p.price <= 500000);
  } else if (price === "3") {
    result = result.filter((p) => p.price > 500000);
  }

  renderProducts(result);
}

searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);
priceFilter.addEventListener("change", filterProducts);

resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  categoryFilter.value = "all";
  priceFilter.value = "all";

  renderProducts(allProducts);
});
