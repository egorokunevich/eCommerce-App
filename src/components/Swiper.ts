import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function createSwiper(): void {
  Swiper.use([Navigation, Pagination]);
  const swiper = new Swiper('.swiper', {
    direction: 'horizontal',
    // loop: true,
    allowSlideNext: true,
    allowSlidePrev: true,
    slidesPerView: 1,
    cssMode: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });
  swiper.init();
}

export function createSwiperZoom(): void {
  Swiper.use([Navigation, Pagination]);
  const swiper = new Swiper('.swiper-zoom', {
    direction: 'horizontal',
    //  loop: true,
    allowSlideNext: true,
    allowSlidePrev: true,
    slidesPerView: 1,
    cssMode: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });
  swiper.init();
}

export function createSwiperDiscountCode(): void {
  Swiper.use([Navigation, Pagination]);

  const swiper = new Swiper('.swiperPromoCode', {
    direction: 'horizontal',
    allowSlideNext: true,
    allowSlidePrev: true,
    centeredSlides: true,
    spaceBetween: 30,
    grabCursor: true,
    loop: true,
    effect: 'coverflow',
    slidesPerView: 'auto',
    autoplay: { delay: 2250, disableOnInteraction: false },
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    navigation: { prevEl: '.swiper-button-prev', nextEl: '.swiper-button-next' },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });
  swiper.init();
}
