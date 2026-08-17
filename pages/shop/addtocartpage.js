import header from "../../shared/components/header/header.js";
import footer from "../../shared/components/footer/footer.js";
import loadComponentStyle from "../../shared/js/renderHeaderAndFooter.js";

function renderCart() {
    const cartTableBody = document.getElementById("cartTableBody");
    const cartTableBodyRes = document.getElementById("cartTableBodyRes");
    const totalCartPrice = document.getElementById("totalCartPrice");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        cartTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">Giỏ hàng của bạn đang trống.</td></tr>`;
        cartTableBodyRes.innerHTML = `<div class="text-center py-4 text-muted">Giỏ hàng của bạn đang trống.</div>`;
        totalCartPrice.innerText = "0đ";
        return;
    }

    let htmlDesktop = "";
    let htmlResponsive = "";
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        htmlDesktop += `
            <tr>
                <td>
                    <img src="${item.image}" alt="${item.name}" class="img-fluid rounded" style="width: 80px; height: 80px; object-fit: cover;" />
                </td>
                <td class="fw-bold">${item.name}</td>
                <td>
                    <input type="number" class="form-control text-center mx-auto quantity-input" style="max-width: 80px;" data-index="${index}" value="${item.quantity}" min="1" />
                </td>
                <td class="text-danger fw-bold">${itemTotal.toLocaleString("vi-VN")}đ</td>
                <td>
                    <button class="btn btn-outline-danger btn-sm delete-btn" data-index="${index}" title="Xóa sản phẩm">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;

        htmlResponsive += `
            <div class="cart-item-row" data-index="${index}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" class="img-fluid rounded" />
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name fw-bold">${item.name}</div>
                    <div class="cart-item-qty-price">
                        <input type="number" class="form-control text-center quantity-input" data-index="${index}" value="${item.quantity}" min="1" />
                        <span class="text-danger fw-bold">${itemTotal.toLocaleString("vi-VN")}đ</span>
                    </div>
                    <button class="btn btn-outline-danger btn-sm delete-btn" data-index="${index}" title="Xóa sản phẩm">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });

    cartTableBody.innerHTML = htmlDesktop;
    cartTableBodyRes.innerHTML = htmlResponsive;
    totalCartPrice.innerText = `${total.toLocaleString("vi-VN")}đ`;

    // Gộp các event listeners 
    const attachEventListeners = (container) => {
        const quantityInputs = container.querySelectorAll(".quantity-input");
        quantityInputs.forEach((input) => {
            input.addEventListener("change", (e) => {
                const index = e.target.getAttribute("data-index");
                const newQuantity = parseInt(e.target.value);
                if (newQuantity >= 1) {
                    cart[index].quantity = newQuantity;
                    localStorage.setItem("cart", JSON.stringify(cart));
                    renderCart();
                } else {
                    e.target.value = cart[index].quantity;
                }
            });
        });

        const deleteBtns = container.querySelectorAll(".delete-btn");
        deleteBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const targetButton = e.target.closest("button");
                if (targetButton) {
                    const index = targetButton.getAttribute("data-index");
                    cart.splice(index, 1);
                    localStorage.setItem("cart", JSON.stringify(cart));
                    renderCart();
                }
            });
        });
    };

    attachEventListeners(cartTableBody);
    attachEventListeners(cartTableBodyRes);
}

async function handlePurchase() {
    const API_URL = "https://6a786e0bf0f1cdf392245a82.mockapi.io/usersAndProducts";
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const btnBuy = document.querySelector(".btnBuy");

    // Kiểm tra xem người dùng đã đăng nhập chưa
    const activeUser = localStorage.getItem("activeUser");
    if (!activeUser) {
        alert("Vui lòng đăng nhập để thực hiện thanh toán!");
        window.location.href = "../login/login.html";
        return;
    }

    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
    }

    btnBuy.disabled = true;
    btnBuy.textContent = "Đang xử lý...";

    try {
        const response = await fetch(API_URL);
        const apiData = await response.json();
        const mainRecord = apiData[0]; // API trả về mảng chứa 1 object

        // Kiểm tra bản ghi chính và ID của nó có tồn tại không
        if (!mainRecord || !mainRecord.products) {
            throw new Error("Cấu trúc dữ liệu API không hợp lệ.");
        }

        //Cập nhật số lượng đã bán (numberOfSales)
        cart.forEach((cartItem) => {
            const productToUpdate = mainRecord.products.find((p) => p.id == cartItem.id);
            if (productToUpdate) {
                productToUpdate.numberOfSales = (productToUpdate.numberOfSales || 0) + cartItem.quantity;
            }
        });
        // Gửi dữ liệu đã cập nhật trở lại API
        await fetch(`${API_URL}/${mainRecord.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(mainRecord),
        });

        localStorage.removeItem("cart");
        alert("Bạn đã thanh toán thành công!");

        renderCart();
    } catch (error) {
        console.error("Lỗi khi xử lý thanh toán:", error);
        alert("Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.");
    } finally {
        btnBuy.disabled = false;
        btnBuy.textContent = "Thanh toán";
    }
}
document.addEventListener("DOMContentLoaded", () => {
    renderCart();
    const btnBuy = document.querySelector(".btnBuy");
    if (btnBuy) {
        btnBuy.addEventListener("click", handlePurchase);
    }
});

loadComponentStyle();
