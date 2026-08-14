function updateCarousel(listProducts, bestSellerState, btnPrev, btnNext) {
    if (listProducts.children.length === 0) return;

    const gap = 20; // Giá trị gap từ CSS
    const card = listProducts.children[0];
    const cardWidth = card.offsetWidth + gap;
    listProducts.style.transform = `translateX(-${bestSellerState.currentIndex * cardWidth}px)`;

    // Cập nhật trạng thái của nút
    btnPrev.disabled = bestSellerState.currentIndex === 0;

    // --- TÍNH TOÁN ĐỘNG SỐ LƯỢNG CARD CÓ THỂ THẤY ---
    const containerWidth = listProducts.parentElement.offsetWidth;
    // Tính toán số card có thể thấy dựa trên chiều rộng container và chiều rộng mỗi card (bao gồm cả gap)
    const visibleCards = Math.floor(containerWidth / cardWidth);

    const lastPossibleIndex = Math.max(0, bestSellerState.products.length - visibleCards);
    btnNext.disabled = bestSellerState.currentIndex >= lastPossibleIndex;
}

function renderBestSeller(listProducts, bestSellerState) {
    if (!listProducts) return;

    listProducts.innerHTML = bestSellerState.products
        .map(
            (product) => `
            <div class="card cardProduct h-100 shadow-sm border-0">
                <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 250px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title fw-bold h43" style="font-size: 1.1rem;">${product.name}</h5>
                    <p class="card-text text-muted">${product.description}</p>
                    <div class="mt-auto d-flex justify-content-between align-items-center">
                        <span class="text-danger fw-bold fs-5">${product.price.toLocaleString("vi-VN")}đ</span>
                        <span class="quantitySold">${product.numberOfSales} đã bán</span>
                    </div>
                    <div class="d-flex gap-2 justify-content-between">
                            <button class="btn btn-success btn-sm viewDetail " data-id="${product.id}">Xem chi tiết</button>
                            <button class="btn btn-outline-success btn-sm addToCart"
                                data-id="${product.id}" 
                                data-name="${product.name}" 
                                data-price="${product.price}"
                                data-image="${product.image}">
                                <i class="fa-solid fa-cart-plus"></i> Thêm
                            </button>
                    </div>
                </div>
            </div>
    `,
        )
        .join("");

    const addToCartBtns = listProducts.querySelectorAll(".addToCart");
    addToCartBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            // Kiểm tra xem người dùng đã đăng nhập chưa
            const activeUser = localStorage.getItem("activeUser");
            if (!activeUser) {
                alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
                window.location.href = "../login/login.html"; 
                return;
            }

            const productInfo = {
                id: btn.getAttribute("data-id"),
                name: btn.getAttribute("data-name"),
                price: parseInt(btn.getAttribute("data-price")),
                image: btn.getAttribute("data-image"),
                quantity: 1,
            };

            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            const existingProduct = cart.find((item) => item.id === productInfo.id);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push(productInfo);
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            alert(`Đã thêm ${productInfo.name} vào giỏ hàng!`);
        });
    });

    const viewDetailBtns = listProducts.querySelectorAll(".viewDetail");
    viewDetailBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const productId = btn.getAttribute("data-id");
            window.location.href = `../productDetails/productDetails.html?id=${productId}`;
        });
    });
}

async function fetchBestSellerData() {
    let bestSellerState = {
        products: [],
        currentIndex: 0,
    };

    const bestSeller = document.querySelector(".bestSeller");
    if (!bestSeller) return;

    bestSeller.innerHTML = `
    <div class="containerPage d-flex flex-column containerGap position-relative">
        <h3 class="title text-center">5 sản phẩm bán chạy</h3>
        <div class="carouselWrapper position-relative overflow-hidden">
            <button class="btnArrow btnPrev position-absolute" id="btnPrevBestSeller"><i class="fa-solid fa-chevron-left"></i></button>
            <div class="wrapBestSeller d-flex gap-3" ></div>
            <button class="btnArrow btnNext position-absolute" id="btnNextBestSeller"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
    </div>
`;

    const listProducts = bestSeller.querySelector(".wrapBestSeller");
    const btnPrev = bestSeller.querySelector("#btnPrevBestSeller");
    const btnNext = bestSeller.querySelector("#btnNextBestSeller");
    try {
        const response = await fetch("https://6a786e0bf0f1cdf392245a82.mockapi.io/usersAndProducts");
        const data = await response.json();

        let listBestProducts = [];
        if (Array.isArray(data)) {
            const record = data.find((item) => item.products);
            if (record) listBestProducts = record.products;
        } else if (data.products) {
            listBestProducts = data.products;
        }

        bestSellerState.products = listBestProducts.sort((a, b) => b.numberOfSales - a.numberOfSales).slice(0, 5);

        renderBestSeller(listProducts, bestSellerState);
        updateCarousel(listProducts, bestSellerState, btnPrev, btnNext); // Cập nhật trạng thái ban đầu
    } catch (error) {
        console.error("Lỗi khi tải danh sách sản phẩm:", error);
    }

    if (btnNext) {
        btnNext.addEventListener("click", () => {
            // Tính toán tự động tương tự
            const gap = 20;
            const cardWidth = listProducts.children[0].offsetWidth + gap;
            const containerWidth = listProducts.parentElement.offsetWidth;
            const visibleCards = Math.floor(containerWidth / cardWidth);
            const lastPossibleIndex = Math.max(0, bestSellerState.products.length - visibleCards);

            if (bestSellerState.currentIndex < lastPossibleIndex) {
                bestSellerState.currentIndex++;
                updateCarousel(listProducts, bestSellerState, btnPrev, btnNext);
            }
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener("click", () => {
            if (bestSellerState.currentIndex > 0) {
                bestSellerState.currentIndex--;
                updateCarousel(listProducts, bestSellerState, btnPrev, btnNext);
            }
        });
    }

    // Thêm sự kiện resize để cập nhật lại carousel khi thay đổi kích thước cửa sổ
    window.addEventListener("resize", () => {
        updateCarousel(listProducts, bestSellerState, btnPrev, btnNext);
    });
}

export { fetchBestSellerData };
const cssBestSeller = document.createElement("link");
cssBestSeller.rel = "stylesheet";
cssBestSeller.href = "/shared/components/homepage/sectionBestSeller/bestSeller.css";
document.head.appendChild(cssBestSeller);
