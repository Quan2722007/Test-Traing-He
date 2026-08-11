// Hiển thị lỗi ngay bên dưới input
function showError(input, message) {
    const formInput = input.closest(".formInput");
    if (!formInput) return; // Thêm kiểm tra để thoát nếu không tìm thấy
    const targetElement = formInput.querySelector(".input-group") || input;
    let errorElement = formInput.querySelector(".errorText");
    if (!errorElement) {
        errorElement = document.createElement("div");
        errorElement.classList.add("errorText", "text-danger", "mt-1");
        errorElement.style.fontSize = "0.85rem";
        targetElement.insertAdjacentElement("afterend", errorElement);
    }
    input.classList.add("is-invalid");
    errorElement.innerText = message;
}

// Ẩn lỗi và đánh dấu là thành công
function showSuccess(input) {
    const formInput = input.closest(".formInput");
    if (!formInput) return; // Thêm kiểm tra để thoát nếu không tìm thấy
    const errorElement = formInput.querySelector(".errorText");
    input.classList.remove("is-invalid");
    if (errorElement) {
        errorElement.innerText = "";
    }
}

export { showError, showSuccess };