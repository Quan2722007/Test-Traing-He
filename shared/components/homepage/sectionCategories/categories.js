async function getAPICategories() {
    try {
        const productCategory = document.getElementById("sectionCategories");
        if (!productCategory) return;

        const response = await fetch("https://6a786e0bf0f1cdf392245a82.mockapi.io/usersAndProducts");
        const data = await response.json();

        let listCategories = [];
        if (Array.isArray(data)) {
            const record = data.find((item) => item.categories);
            if (record) listCategories = record.categories;
        } else if (data.categories) {
            listCategories = data.categories;
        }

        productCategory.innerHTML = `
            <div class="containerPage  d-flex flex-column containerGap">
                <h3 class="title text-center">Danh mục sản phẩm</h3>
                <div class="wrapProductCategory d-flex flex-nowrap gap-3"></div>
            </div>
        `;

        const listProductContainer = productCategory.querySelector(".wrapProductCategory");
        renderProductCategory(listCategories, listProductContainer);
    } catch (error) {
        console.error("Lỗi khi tải danh sách đề mục:", error);
    }
}
function renderProductCategory(categories, listProductContainer) {
    if (!listProductContainer) return;
    listProductContainer.innerHTML = `
            ${categories
                .map(
                    (category) => ` 
                <div class="cardCategory d-flex position-relative flex-shrink-0" style="scroll-snap-align: start; cursor: pointer;" data-name="${category.tenDanhMuc}">
                    <img src="../../${category.hinhAnh}" alt="${category.tenDanhMuc}" class="imgCategory" >
                    <div class="blockNameCategory position-absolute d-flex justify-content-center">
                        <div class="nameCategory">${category.tenDanhMuc}</div>
                    </div>
                </div>
            `,
                )
                .join("")}
       
    `;

    const categoryCards = listProductContainer.querySelectorAll(".cardCategory");
    categoryCards.forEach((card) => {
        card.addEventListener("click", () => {
            const categoryName = card.getAttribute("data-name").trim();
            window.location.href = `../../pages/products/products.html?category=${encodeURIComponent(categoryName)}`;
        });
    });
}


const cssCategory = document.createElement("link");
cssCategory.rel = "stylesheet";
cssCategory.href = "/shared/components/homepage/sectionCategories/categories.css";
document.head.appendChild(cssCategory);
export { getAPICategories };
