import header from "../../shared/components/header/header.js";
import footer from "../../shared/components/footer/footer.js";
import loadComponentStyle from "../../shared/js/renderHeaderAndFooter.js";

loadComponentStyle();

const API = "https://6a786e0bf0f1cdf392245a82.mockapi.io/usersAndProducts";

const productList = document.getElementById("product-list");

let allProducts = [];

// Ánh xạ tên danh mục từ URL sang ID của thẻ <select>
const categoryNameToIdMap = {
  "Cây trong nhà": "1",
  "Cây ngoài trời": "2",
  "Cây ban công": "3",
  "Cây để bàn": "4",
};
// fetch du lieu
async function getProducts() {
  try {
    // Hiển thị thông báo đang tải
    productList.innerHTML = `
      <div class="col-12 text-center mt-5">
        <p class="fs-4 text-muted">Đang tải dữ liệu....</p>
      </div>
    `;
    const res = await fetch(API);
    const data = await res.json();

    // Kiểm tra: Trích xuất đúng mảng 'products' từ dữ liệu trả về
    if (Array.isArray(data) && data.length > 0 && data[0].products) {
      allProducts = data[0].products;
    } else {
      console.error("Cấu trúc dữ liệu API không hợp lệ.");
      allProducts = [];
    }

    renderProducts(allProducts);

    // Xử lý hàm lọc từ url window
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get("category");
    const keywordFromUrl = urlParams.get("keyword");

    if (categoryFromUrl) {
      const categoryId = categoryNameToIdMap[decodeURIComponent(categoryFromUrl)];
      if (categoryId) {
        document.getElementById("categoryFilter").value = categoryId;
      }
    }
    if (keywordFromUrl) {
      document.getElementById("searchInput").value = decodeURIComponent(keywordFromUrl);
    }
    // Gọi hàm lọc nếu có bất kỳ tham số nào trên URL
    if (categoryFromUrl || keywordFromUrl) {
      filterProducts();
    }
  } catch (err) {
    console.error("Lỗi load data:", err);
    // Hiển thị thông báo lỗi nếu không tải được
    productList.innerHTML = `
      <div class="col-12 text-center mt-5">
        <p class="fs-4 text-danger">Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
      </div>
    `;
  }
}

// render UI
const renderProducts = (products) => {
  if (products.length === 0) {
    productList.innerHTML = `
      <div class="col-12 text-center mt-5">
        <p class="fs-4 text-muted">Không tìm thấy sản phẩm nào.</p>
      </div>
    `;
  } else {
    productList.innerHTML = products
      .map(
        (p) => `
        <div class="col-6 col-md-4 col-lg-3 mb-4">
          <a href="../productDetails/productDetails.html?id=${p.id}">
            <div class="card h-100">
              <img src="${p.image}" class="card-img-top" alt="${p.name}"/>
              <div class="card-body d-flex flex-column">
                    <div class="card-title fw-bold h43 text-clamp-1" style="font-size: 1.1rem;">${p.name}</div>
                    <p class="card-text text-muted">${p.description}</p>
                    <div class="mt-auto d-flex justify-content-between align-items-end">
                        <span class="text-danger fw-bold fs-price">${p.price.toLocaleString("vi-VN")}đ</span>
                        <span class="quantitySold">${p.numberOfSales} đã bán</span>
                    </div>
                </div>
            </div>
          </a>
        </div>
      `,
      )
      .join("");
  }
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
