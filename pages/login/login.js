import { showError, showSuccess } from "../../shared/components/loginAndSignUp/displayError.js";
document.addEventListener("DOMContentLoaded", function () {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const btnLogin = document.getElementById("btnLogin");
    const textReport = document.querySelector("#textReport");

    [usernameInput, passwordInput].forEach((input) => {
        input.addEventListener("input", () => {
            textReport.style.setProperty("display", "none", "important"); // Ẩn thông báo lỗi khi người dùng nhập dữ liệu
        });
    });


    //Hàm xử lý sự kiện khi nhấn nút đăng nhập
    btnLogin.addEventListener("click", (event) => {
        event.preventDefault();

        // Lấy dữ liệu từ localStorage
        const storedData = JSON.parse(localStorage.getItem("users"));
        if (!storedData || !Array.isArray(storedData) || storedData.length === 0) {
            alert("Không tìm thấy dữ liệu trong localStorage.");
            return;
        }
    
        const allUsers = storedData[0].users; // Truy cập đúng vào mảng users
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        console.log(username, password);
        const user = allUsers.find((u) => u.tenDangNhap === username && u.matKhau === password);
        console.log(user);

        // Kiểm tra thông tin đăng nhập
        if (!user) {
            textReport.style.setProperty("display", "block", "important");
            textReport.textContent = "Tên đăng nhập hoặc mật khẩu không đúng.";
            
        } else {
            alert("Đăng nhập thành công!");
            // Lưu thông tin người dùng đang hoạt động vào localStorage
            localStorage.setItem("activeUser", JSON.stringify(user));
            window.location.href = "../homepage/homepage.html"; // Thay đổi đường dẫn theo nhu cầu
        }
    });
});
