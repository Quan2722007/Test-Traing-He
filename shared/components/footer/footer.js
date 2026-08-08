const footer = document.getElementsByTagName("footer")[0] ?? [];
footer.innerHTML = `
    <div class="boxFooter">
        <div class="container d-flex justify-content-between wrapFooter">
            <div class=" d-flex flex-column blockFooter">
                <div class="titleFooter">About Green Haven</div>
                <div class="infor">
                    <span class="nameMeaning">Green Haven</span>
                    được tạo ra với mong muốn mang thiên nhiên đến gần hơn với không gian sống hiện đại. Website không chỉ là nơi mua sắm các loại cây cảnh đẹp mắt mà còn là nguồn cảm hứng giúp mọi người xây dựng một góc sống xanh, thư giãn và đầy sức sống.
                </div>
            </div>
            <div class=" d-flex flex-column blockFooter changeWidthBlock">
                <div class="titleFooter">Khám phá</div>
                <ul class="navBarFooter flex-column">
                    <li class="navItem d-flex align-items-center ">
                        <a class="navLinkFooter" href="../../pages/homepage/homepage.html" id="homepage">Trang chủ</a>
                    </li>
                    <li class="navItem d-flex align-items-center ">
                        <a class="navLinkFooter" href="../../pages/homepage/homepage.html" id="homepage">Cây cảnh</a>
                    </li>
                </ul>
            </div>
            <div class=" d-flex flex-column blockFooter">
                <div class="titleFooter">Liên hệ</div>
                <div class="d-flex flex-column wrapInfor">
                    <div class="infor">Hotline: 0326284573</div>
                    <div class="infor">Hotline: 0327494564</div>
                    <div class="infor">Địa chỉ: 12 Nguyễn Văn Bảo, Phường 1, Gò Vấp, thành phố Hồ Chí Minh, Việt Nam</div>
                </div>
            </div>
        </div>
    </div>
`;
export default footer;