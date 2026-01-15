import Splide from '@splidejs/splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';

export function sliderReviewsCards() {
  const slidersReviewsCards = document.querySelectorAll('.splide.v-reviews-cards');
  slidersReviewsCards.forEach((slider) => {
    new Splide(slider as HTMLElement, {
      perMove: 1,
      perPage: 4,
      type: 'slide',
      gap: '1rem',
      transition: 'fade',
      drag: 'free',
      snap: true,
      arrows: true,
      pagination: false,
      autoplay: false,
      reduceMotion: {
        speed: 0,
        rewindSpeed: 0,
        autoplay: 'pause',
      },
      waitForTransition: true,
      breakpoints: {
        991: {
          autoScroll: {
            speed: 0.8,
          },
        },
      },
    }).mount();
  });
}

export function sliderReviewsMarquee() {
  const slidersReviewsMarquee = document.querySelectorAll('.splide.v-reviews-marquee');
  slidersReviewsMarquee.forEach((slider) => {
    new Splide(slider as HTMLElement, {
      type: 'loop',
      autoWidth: true,
      height: 'auto',
      drag: 'free',
      arrows: false,
      pagination: false,
      loop: true,
      transition: 'fade',
      label: 'Reviews Marquee',
      waitForTransition: false,
      updateOnMove: true,
      trimSpace: false,
      reduceMotion: {
        speed: 0,
        rewindSpeed: 0,
        autoplay: 'pause',
      },
      autoScroll: {
        speed: 1,
      },
      breakpoints: {
        991: {
          autoScroll: {
            speed: 1,
          },
        },
        767: {
          autoScroll: {
            speed: 1,
          },
        },
      },
    }).mount({ AutoScroll });
  });
}
