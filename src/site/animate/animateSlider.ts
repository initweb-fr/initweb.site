import { Splide } from '@splidejs/splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';

export function animateMarqueeReviews() {
  const slider = document.querySelector('.splide.marquee_reviews');
  if (slider) {
    // Slider Tablette & Desktop
    const splideTabletDesktop = new Splide(slider as HTMLElement, {
      type: 'loop',
      arrows: false,
      gap: '4rem',
      pagination: false,
      autoWidth: true,
      autoScroll: {
        speed: 1,
      },
    });

    // Slider Mobile
    const splideMobile = new Splide(slider as HTMLElement, {
      type: 'loop',
      perPage: 1,
      autoplay: true,
      arrows: false,
      pagination: true,
      interval: 3000,
      pauseOnHover: false,
      pauseOnFocus: false,
      pauseOnScroll: false,
      pauseOnMouseEnter: false,
      pauseOnMouseLeave: false,
      drag: 'free',
      gap: '1rem',
    });

    // Affichage conditionnel
    const mediaQueryMinTablet = window.matchMedia('(min-width: 767px)');
    if (mediaQueryMinTablet.matches) {
      splideTabletDesktop.mount({ AutoScroll });
    } else {
      splideMobile.mount({});
    }
  }
}
