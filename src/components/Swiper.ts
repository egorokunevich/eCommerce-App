import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';
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
