import header from "../../shared/components/header/header.js";
import footer from "../../shared/components/footer/footer.js";
import loadComponentStyle from "../../shared/js/renderHeaderAndFooter.js";

function renderCart() {
    const cartTableBody = document.getElementById("cartTableBody");
    const totalCartPrice = document.getElementById("totalCartPrice");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        cartTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">Giỏ hàng của bạn đang trống.</td></tr>`;
        totalCartPrice.innerText = "0đ";
        return;
    }

    let html = "";
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
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
    });

    cartTableBody.innerHTML = html;
    totalCartPrice.innerText = `${total.toLocaleString("vi-VN")}đ`;

    const quantityInputs = cartTableBody.querySelectorAll(".quantity-input");
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

    const deleteBtns = cartTableBody.querySelectorAll(".delete-btn");
    deleteBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const index = e.target.closest("button").getAttribute("data-index");
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
        });
    });
}

async function handlePurchase() {
    const API_URL = "https://6a786e0bf0f1cdf392245a82.mockapi.io/usersAndProducts";
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const btnBuy = document.querySelector(".btnBuy");

    // Kiểm tra xem người dùng đã đăng nhập chưa
    const activeUser = localStorage.getItem("activeUser");
    if (!activeUser) {
        alert("Vui lòng đăng nhập để thực hiện thanh toán!");
        window.location.href = "../login/login.html"; // Chuyển hướng đến trang đăng nhập
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

        // Kiểm tra xem bản ghi chính và ID của nó có tồn tại không
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

        renderCart(); // Cập nhật lại giao diện giỏ hàng (trống)
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
