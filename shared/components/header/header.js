const header = document.getElementsByTagName("header")[0] ?? [];
header.innerHTML = `
    <div class="boxHeader bgGreen py-2">
        <div class="container containerHeader d-flex justify-content-between align-items-center">
            
            <div class="d-none d-md-flex gap-4">
                <div class="block d-flex align-items-center p-right">
                    <i class="fa-regular fa-clock icon me-2"></i>
                    <span>08:00 - 21:00</span>
                </div>
                <div class="block d-flex align-items-center p-left">
                    <i class="fa-solid fa-phone icon iconChangeColor me-2"></i>
                    <span>032628573 - 0327494564</span>
                </div>
            </div>

            <div class="d-flex d-md-none"></div>

            <div class="d-flex align-items-center gap-3">
                <div class="block btnCart p-right d-flex align-items-center" style="cursor: pointer;">
                    <i class="fa-solid fa-cart-shopping me-2"></i>
                    <span>Giỏ hàng</span>
                </div>
                
                <div id="auth-buttons" class="block p-left">
                    <button class="btn btn-success btn-sm btnLogin">Đăng nhập</button>
                </div>

                <div id="user-menu" class="dropdown d-none">
                    <button class="btn btn-sm text-white dropdown-toggle d-flex align-items-center gap-2 shadow-none border-0 btnCart" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fa-solid fa-user"></i>
                        <span id="display-username">Username</span>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="userDropdown">
                        <li><a class="dropdown-item" href="#">Thông tin tài khoản</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger fw-bold" href="#" id="btnLogout"><i class="fa-solid fa-right-from-bracket me-2"></i> Đăng xuất</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    
    <nav class="navbar navbar-expand-lg boxHeader bg-white shadow-sm">
        <div class="container containerHeader flex-wrap align-items-center justify-content-between">
            
            <a class="navbar-brand logo m-0" href="../../pages/homepage/homepage.html">
                <img src="../../assets/images/logo/logo.png" alt="logo" height="40">
            </a>

            <button class="navbar-toggler shadow-none border-0 px-0 order-2 order-md-3 ms-auto ms-md-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="w-100 d-md-none order-3"></div>

            <div class="order-4 order-md-2 flex-grow-1 d-flex justify-content-center mt-3 mt-md-0 mx-auto mx-lg-0 ms-lg-auto" style="max-width: 400px;">
                <form action="" class="searchBar d-flex w-100 m-0">
                    <input type="text" class="search form-control shadow-none flex-grow-1" placeholder="Tìm kiếm cây..."/>
                    <button type="submit" class="btnSearch btn btn-success flex-shrink-0"><i class="fa-solid fa-magnifying-glass"></i></button>
                </form>
            </div>

            <div class="collapse navbar-collapse order-5 order-lg-1" id="navbarContent">
                <ul class="navbar-nav navBar mx-lg-auto mb-2 mb-lg-0 gap-2 gap-lg-4 text-center">
                    <li class="navItem nav-item d-flex align-items-center justify-content-center">
                        <a class="navLink nav-link" href="../../pages/homepage/homepage.html" id="homepage">Trang chủ</a>
                    </li>
                    <li class="navItem nav-item d-flex align-items-center justify-content-center">
                        <a class="navLink nav-link" href="../../pages/productspage/productspage.html" id="productspage">Cây cảnh</a>
                    </li>
                </ul>
                
                <div class="d-block d-md-none mt-3 pt-3 border-top text-center">
                    <div class="mb-2 text-muted">
                        <i class="fa-regular fa-clock icon me-2"></i>
                        <span>08:00 - 21:00</span>
                    </div>
                    <div class="text-muted">
                        <i class="fa-solid fa-phone icon iconChangeColor me-2"></i>
                        <span>032628573 - 0327494564</span>
                    </div>
                </div>
            </div>

        </div>
    </nav>
`;

const searchValue = header.querySelector(".search");
searchValue.addEventListener("input", (e) => {
    const value = e.target.value.trim();
    if (value) {
        btnSearch.setAttribute("type", "submit");
    } else {
        btnSearch.setAttribute("type", "reset");
    }
});

const btnSearch = header.querySelector(".btnSearch");
btnSearch.addEventListener("click", (e) => {
    e.preventDefault();
    const keyword = searchValue.value.toLowerCase().trim();
    if (keyword) {
        window.location.href = `../productspage/productspage.html?keyword=${encodeURIComponent(keyword)}`;
    } else {
        searchValue.value = "";
    }
});

const btnCart = header.querySelector(".btnCart");
btnCart.addEventListener("click", () => {
    window.location.href = `../addtocartpage/addtocartpage.html`;
});

const btnLogin = header.querySelector(".btnLogin");
if (btnLogin) {
    btnLogin.addEventListener("click", () => {
        window.location.href = `../../pages/login/login.html`;
    });
}

const authButtons = header.querySelector("#auth-buttons");
const userMenu = header.querySelector("#user-menu");
const displayUsername = header.querySelector("#display-username");
const btnLogout = header.querySelector("#btnLogout");

const activeUserString = localStorage.getItem("activeUser");

if (activeUserString) {
    try {
        const activeUser = JSON.parse(activeUserString);
        if (authButtons) authButtons.classList.add("d-none");
        if (userMenu) userMenu.classList.remove("d-none");
        if (displayUsername) displayUsername.textContent = activeUser.tenDangNhap;
    } catch (error) {
        console.error("Lỗi khi parse dữ liệu User:", error);
    }
}

if (btnLogout) {
    btnLogout.addEventListener("click", (e) => {
        e.preventDefault();
        if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
            localStorage.removeItem("activeUser");
            localStorage.removeItem("userRole");
            window.location.reload();
        }
    });
}

export default header;