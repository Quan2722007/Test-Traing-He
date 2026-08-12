import header from "../../shared/components/header/header.js";
import footer from "../../shared/components/footer/footer.js";
import loadComponentStyle from "../../shared/js/renderHeaderAndFooter.js";

loadComponentStyle();

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const API = "http://localhost:3000/products";

const getProduct = async () => {
  const res = await fetch(`${API}/${id}`);
  const product = await res.json();
  renderProduct(product);
};

getProduct();

const renderProduct = (p) => {
  document.getElementById("product-detail").innerHTML = `
    <div class="col-12 col-md-6">
      <img src="${p.image}" class="product-img"/>
    </div>

    <div class="col-12 col-md-6" id="product-info">
      <h2>${p.name}</h2>
      <h4 id="product-price">${p.price}đ</h4>

      <p class="product-desc">
        ${p.description || "Chưa có mô tả cho sản phẩm này."}
      </p>

      <div class="product-meta">
        <div><strong>Tên khoa học:</strong> ${p.scientific || "Đang cập nhật"}</div>
        <div><strong>Tên gọi khác:</strong> ${p.alias || "Đang cập nhật"}</div>
        <div><strong>Quy cách:</strong> ${p.size || "Đang cập nhật"}</div>
        <div><strong>Độ khó:</strong> ${p.level || "Dễ chăm sóc"}</div>
        <div><strong>Ánh sáng:</strong> ${p.light || "Ánh sáng nhẹ"}</div>
        <div><strong>Nước:</strong> ${p.water || "2-3 lần/tuần"}</div>
      </div>

      <div class="cart-box">

        <div class="quantity">
          <button type="button" id="minus">-</button>

          <input
            type="number"
            id="quantity"
            value="1"
            min="1"
          >

          <button type="button" id="plus">+</button>
        </div>

        <button type="button" class="btn-add">
          ADD TO CART
        </button>

      </div>
    </div>
  `;

  // xu ly nut tang giam so luong

  const minus = document.getElementById("minus");
  const plus = document.getElementById("plus");
  const quantity = document.getElementById("quantity");

  // nut +
  plus.addEventListener("click", () => {
    let number = parseInt(quantity.value) || 1;

    quantity.value = number + 1;
  });

  // nut -
  minus.addEventListener("click", () => {
    let number = parseInt(quantity.value) || 1;

    if (number > 1) {
      quantity.value = number - 1;
    }
  });

  // khong cho nhap so nho hon 1
  quantity.addEventListener("change", () => {
    let number = parseInt(quantity.value) || 1;

    if (number < 1) {
      number = 1;
    }

    quantity.value = number;
  });
};
