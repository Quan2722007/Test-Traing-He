import { showError, showSuccess } from "../../shared/components/loginAndSignUp/displayError.js";

document.addEventListener("DOMContentLoaded", () => {
    const btnSign = document.getElementById("btnSign");
    const fullnameInput = document.getElementById("fullname");
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const boxPassword = document.getElementById("boxPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const formInputs = document.querySelectorAll(".formInput");

    

    const strengthText = document.createElement("div");
    strengthText.style.marginTop = "5px";
    strengthText.style.fontSize = "0.85rem";
    boxPassword.appendChild(strengthText);

    //Kiểm tra độ mạnh của mật khẩu
    function checkPasswordStrength(password) {
        let strength = 0;
        if (password.length >= 6) strength += 1;
        if (password.match(/[a-z]+/)) strength += 1;
        if (password.match(/[A-Z]+/)) strength += 1;
        if (password.match(/[0-9]+/)) strength += 1;
        if (password.match(/[\W_]+/)) strength += 1;
        return strength;
    }

    passwordInput.addEventListener("input", () => {
        const val = passwordInput.value;
        if (val.length === 0) {
            strengthText.textContent = "";
            return;
        }

        const score = checkPasswordStrength(val);
        if (score <= 2) {
            strengthText.textContent = "Mật khẩu yếu (Thêm chữ hoa, số hoặc ký tự đặc biệt)";
            strengthText.style.color = "#dc3545";
        } else if (score === 3 || score === 4) {
            strengthText.textContent = "Mật khẩu trung bình";
            strengthText.style.color = "#ffc107";
        } else {
            strengthText.textContent = "Mật khẩu mạnh";
            strengthText.style.color = "#198754";
        }
    });

    //kiểm tra họ và tên

    function validateFullname(fullName) {
        if (fullName.length === 0) {
            return { valid: false, message: "Vui lòng điền đầy đủ thông tin." };
        }
        const hasNumber = /\d/.test(fullName);

        if (hasNumber) {
            return { valid: false, message: "Họ tên không được chứa số." };
        }

        const words = fullName.trim().split(/\s+/);

        if (words.length < 2) {
            return { valid: false, message: "Họ tên phải có ít nhất 2 từ." };
        }

        const isAllCapitalized = words.every((word) => {
            const firstChar = word.charAt(0);

            return firstChar === firstChar.toUpperCase() && firstChar !== firstChar.toLowerCase();
        });

        if (!isAllCapitalized) {
            return { valid: false, message: "Chữ cái đầu của mỗi từ phải viết hoa." };
        }

        return { valid: true, message: "" };
    }

    //Hàm kiểm tra username
    function validateUsernameAndEmail(input) {
        if (input.length === 0) {
            return { valid: false, message: "Vui lòng điền đầy đủ thông tin." };
        } else if (!/[a-zA-Z]/.test(input)) {
            return { valid: false, message: "Phải có ít nhất một chữ cái." };
        } else if (input.length < 6 || input.length > 30) {
            return { valid: false, message: "Phải chứa ít nhất 6 đến 30 ký tự." };
        }
        return { valid: true, message: "" };
    }

    // Hàm kiểm tra hợp lệ cho từng trường
    function validateField(input) {
        const val = input.value.trim();
        let isValid = true;

        switch (input.id) {
            case "fullname":
                const fullnameResult = validateFullname(val);
                if (!fullnameResult.valid) {
                    showError(input, fullnameResult.message);
                    isValid = false;
                } else {
                    showSuccess(input);
                }
                break;
            case "username":
                const usernameResult = validateUsernameAndEmail(val);
                if (!usernameResult.valid) {
                    showError(input, usernameResult.message);
                    isValid = false;
                } else if (!/^[a-zA-Z0-9]+$/.test(val)) {
                    showError(input, "Chỉ được chứa chữ cái và số.");
                    isValid = false;
                } else {
                    showSuccess(input);
                }
                break;
            case "email":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const emailResult = validateUsernameAndEmail(val);
                if (!emailResult.valid) {
                    showError(input, emailResult.message);
                    isValid = false;
                } else if (!emailRegex.test(val)) {
                    showError(input, "Định dạng email không hợp lệ.");
                    isValid = false;
                } else {
                    const localPart = val.split("@")[0];
                    if (!/^[a-zA-Z0-9]+$/.test(localPart)) {
                        showError(input, "Tên email không được chứa ký tự đặc biệt hoặc có dấu.");
                        isValid = false;
                    } else {
                        showSuccess(input);
                    }
                }

                break;
            case "password":
                if (val.length === 0) {
                    showError(input, "Vui lòng điền đầy đủ thông tin.");
                    isValid = false;
                } else if (checkPasswordStrength(val) <= 2) {
                    showError(input, "Mật khẩu quá yếu.");
                    isValid = false;
                } else {
                    showSuccess(input);
                }
                break;
            case "confirmPassword":
                if (val.length === 0) {
                    showError(input, "Vui lòng điền đầy đủ thông tin.");
                    isValid = false;
                } else if (val !== passwordInput.value.trim()) {
                    showError(input, "Mật khẩu xác nhận không khớp.");
                    isValid = false;
                } else {
                    showSuccess(input);
                }
                break;
        }
        return isValid;
    }

    // Gắn sự kiện 'blur' cho tất cả các input
    [fullnameInput, usernameInput, emailInput, passwordInput, confirmPasswordInput].forEach((input) => {
        input.addEventListener("blur", () => validateField(input));

        input.addEventListener("input", () => showSuccess(input));
    });

    const STORAGE_KEY = "users";

    /**
     * Lấy dữ liệu từ LocalStorage. Nếu không có, tạo một bản ghi mới.
     * @returns {Promise<{mainRecord: object, recordId: string}>} - Một object chứa bản ghi chính và ID của nó.
     */
    function getStorageData() {
        let data = [];
        let mainRecord = null;
        const storedData = localStorage.getItem(STORAGE_KEY);

        if (storedData) {
            try {
                data = JSON.parse(storedData);
            } catch (error) {
                console.error("Lỗi khi parse dữ liệu từ LocalStorage:", error);
                data = []; // Reset nếu dữ liệu bị hỏng
            }
        }

        if (!Array.isArray(data) || data.length === 0) {
            // Nếu không có dữ liệu hoặc dữ liệu không hợp lệ, tạo cấu trúc mới
            mainRecord = {
                id: "1",
                users: [],
                products: [],
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify([mainRecord]));
        } else {
            // Lấy record đầu tiên từ mảng
            mainRecord = data[0];
        }

        // Đảm bảo mainRecord.users là một mảng
        if (!Array.isArray(mainRecord.users)) {
            mainRecord.users = [];
        }
        return { mainRecord, recordId: mainRecord.id };
    }

    /**
     * Lưu người dùng mới vào LocalStorage.
     * @param {object} newUser - Đối tượng người dùng mới cần tạo.
     */
    function registerUserInStorage(newUser) {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (!storedData) {
            throw new Error("Không tìm thấy dữ liệu trong LocalStorage để cập nhật.");
        }

        try {
            const data = JSON.parse(storedData);
            const mainRecord = data[0];
            mainRecord.users.push(newUser);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            throw new Error("Lỗi khi cập nhật dữ liệu trong LocalStorage.");
        }
    }

    async function handleRegistration() {
        // 1. Lấy dữ liệu từ LocalStorage và kiểm tra trùng lặp
        const { mainRecord, recordId } = getStorageData();

        if (!mainRecord || !recordId) {
            throw new Error("Cấu trúc dữ liệu trên API không hợp lệ để cập nhật!");
        }

        const username = usernameInput.value.trim();
        if (mainRecord.users.some((u) => u.tenDangNhap === username)) {
            alert("Tên đăng nhập đã tồn tại! Vui lòng chọn tên khác.");
            return; // Dừng lại nếu tên đã tồn tại
        }

        // 2. Tạo người dùng mới và cập nhật bản ghi
        const newUser = {
            id: "user_" + Date.now(),
            tenDangNhap: username,
            matKhau: passwordInput.value.trim(),
            email: emailInput.value.trim(),
            role: "user",
            hoTen: fullnameInput.value.trim(),
        };

        // 3. Lưu người dùng mới vào LocalStorage
        registerUserInStorage(newUser);

        alert("Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.");
        window.location.href = "../login/login.html";
    }
    btnSign.addEventListener("click", async (e) => {
        e.preventDefault();

        const isFullnameValid = validateField(fullnameInput);
        const isUsernameValid = validateField(usernameInput);
        const isEmailValid = validateField(emailInput);
        const isPasswordValid = validateField(passwordInput);
        const isConfirmPasswordValid = validateField(confirmPasswordInput);

        if (!isFullnameValid || !isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
            alert("Vui lòng kiểm tra lại các thông tin đã nhập.");
            return;
        }

        // Hàm xử lý chính để đăng ký

        try {
            btnSign.textContent = "Đang xử lý...";
            btnSign.disabled = true;
            await handleRegistration();
        } catch (error) {
            console.error("Lỗi khi đăng ký:", error);
            alert("Lỗi kết nối máy chủ, vui lòng thử lại!");
        } finally {
            // Dù thành công hay thất bại, bật lại nút và trả lại văn bản cũ
            btnSign.textContent = "Đăng ký";
            btnSign.disabled = false;
        }
    });
});
