import header from "../../shared/components/header/header.js";
import footer from "../../shared/components/footer/footer.js";
import loadComponentStyle from "../../shared/js/renderHeaderAndFooter.js";

loadComponentStyle();

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const API_URL = "https://6a786e0bf0f1cdf392245a82.mockapi.io/usersAndProducts";

const getProduct = async () => {
    if (!id) {
        document.getElementById("product-detail").innerHTML = `<div class="alert alert-danger">Không tìm thấy ID sản phẩm.</div>`;
        return;
    }

    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        // API trả về một mảng chứa một object
        const allProducts = data[0]?.products || [];
        const product = allProducts.find((p) => p.id == id); // So sánh với id từ URL

        if (product) {
            renderProduct(product);
        } else {
            document.getElementById("product-detail").innerHTML = `<div class="alert alert-warning">Không tìm thấy sản phẩm với ID: ${id}</div>`;
        }
    } catch (error) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", error);
        document.getElementById("product-detail").innerHTML = `<div class="alert alert-danger">Lỗi kết nối đến máy chủ.</div>`;
    }
};

getProduct();

const renderProduct = (p) => {
    document.getElementById("product-detail").innerHTML = `
    <div class=" col-12 col-md-5">
      <img src="${p.image}" class="product-img"/>
    </div>

    <div class=" col-12 col-md-7" id="product-info">
      <h2>${p.name}</h2>
      <h4 id="product-price" class="text-danger fw-bold">${p.price.toLocaleString("vi-VN")}đ</h4>

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
        <div><strong>Đã bán:</strong> ${p.numberOfSales || "0"}</div>
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

        <button type="button" class="btn-add btn btn-success primary" 
            data-id="${p.id}" 
            data-name="${p.name}" 
            data-price="${p.price}"
            data-image="${p.image}"
        >
          Thêm vào giỏ hàng
        </button>

      </div>
    </div>
  `;

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

    // Xử lý thêm vào giỏ hàng
    const btnAdd = document.querySelector(".btn-add");
    btnAdd.addEventListener("click", () => {
        // Kiểm tra xem người dùng đã đăng nhập chưa
        const activeUser = localStorage.getItem("activeUser");
        if (!activeUser) {
            alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
            window.location.href = "../login/login.html"; 
            return;
        }
        const productInfo = {
            id: btnAdd.getAttribute("data-id"),
            name: btnAdd.getAttribute("data-name"),
            price: parseInt(btnAdd.getAttribute("data-price")),
            image: btnAdd.getAttribute("data-image"),
            quantity: parseInt(quantity.value) || 1,
        };

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingProduct = cart.find((item) => item.id === productInfo.id);

        if (existingProduct) {
            existingProduct.quantity += productInfo.quantity;
        } else {
            cart.push(productInfo);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`Đã thêm ${productInfo.quantity} sản phẩm "${productInfo.name}" vào giỏ hàng!`);
    });
};
