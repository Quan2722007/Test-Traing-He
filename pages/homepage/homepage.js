import header from "/shared/components/header/header.js";
import footer from "/shared/components/footer/footer.js";
import loadComponentStyle from "/shared/js/renderHeaderAndFooter.js";
import heroSection from "/shared/components/homepage/herosection/herosection.js";
import "/shared/js/bootstrap.bundle.min.js";
import { getAPICategories } from "/shared/components/homepage/sectionCategories/categories.js";
import { fetchBestSellerData } from "/shared/components/homepage/sectionBestSeller/bestSeller.js";


loadComponentStyle();
getAPICategories();
fetchBestSellerData();