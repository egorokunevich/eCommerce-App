import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function createSwiper(): void {
  Swiper.use([Navigation, Pagination]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const swiper = new Swiper('.swiper', {
    direction: 'vertical',
    loop: true,
    cssMode: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    // mousewheel: true,
    // keyboard: true,
  });
}
