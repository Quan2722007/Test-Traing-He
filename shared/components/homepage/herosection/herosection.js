const heroSection = document.getElementById("heroSection");
heroSection.innerHTML = `
    <div class="bgHero position-relative">
        <div class="hero-carousel">
            <img src="/assets/images/banners/bgHeroSection1.png" alt="heroSection background 1" class="picture active" />
            <img src="/assets/images/banners/bgHeroSection2.png" alt="heroSection background 2" class="picture" />
        </div>
        <div class="bgOverlay position-absolute top-0"></div>
        <div class="container d-flex flex-column align-items-center position-absolute top-50 start-50 translate-middle heroBanner">
            <div class="titleHero text-center">
                Một chậu cây nhỏ cho ngày nhẹ nhàng hơn
            </div>
            <div class="contentHero text-center">
                Từ sen đá, monstera đến các loại cây để bàn tối giản — tất cả
                đều được chọn để mang lại cảm giác thư giãn cho không gian của
                bạn.
            </div>
            <button class="primary btnCTA">Chọn cây ngay</button>
        </div>
    </div>
`;
const btnCTA = heroSection.querySelector(".btnCTA");
if (btnCTA) {
    btnCTA.addEventListener("click", () => {
        window.location.href = "/pages/productspage/productspage.html";
    });
}

// Carousel Logic
const carouselImages = heroSection.querySelectorAll(".hero-carousel .picture");
let currentImageIndex = 0;

function showNextImage() {
    // Ẩn ảnh hiện tại
    carouselImages[currentImageIndex].classList.remove("active");

    // Tăng chỉ số, quay lại 0 nếu hết ảnh
    currentImageIndex = (currentImageIndex + 1) % carouselImages.length;

    // Hiển thị ảnh tiếp theo
    carouselImages[currentImageIndex].classList.add("active");
}

// Tự động chuyển ảnh sau mỗi 5 giây (5000ms)
setInterval(showNextImage, 5000);

const cssHeroSection = document.createElement("link");
cssHeroSection.rel = "stylesheet";
cssHeroSection.href = "/shared/components/homepage/herosection/herosection.css";
document.head.appendChild(cssHeroSection);

export default heroSection;
