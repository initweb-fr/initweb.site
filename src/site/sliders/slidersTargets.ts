import Splide from '@splidejs/splide';

export function sliderTargetsCards() {
  const slidersTargets = document.querySelectorAll('.splide.v-targets-cards');
  slidersTargets.forEach((slider) => {
    new Splide(slider as HTMLElement, {
      perMove: 1,
      gap: '1rem',
      transition: 'fade',
      drag: 'free',
      snap: true,
      arrows: true,
      pagination: false,
      label: 'Slider Targets',
      omitEnd: true,
      reduceMotion: {
        speed: 0,
        rewindSpeed: 0,
        autoplay: 'pause',
      },
      waitForTransition: true,
      breakpoints: {
        991: {
          arrows: false,
          pagination: false,
        },
      },
    }).mount();
  });
}
