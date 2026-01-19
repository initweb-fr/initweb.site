import gsap from 'gsap';

export function animateMarquee() {
  const marquees = document.querySelectorAll('[data-iw-marquee]') as NodeListOf<HTMLElement>;

  marquees.forEach((marquee) => {
    const track = marquee.querySelector('[data-iw-marquee-element="track"]') as HTMLElement;

    if (!track) return;

    // 🔁 Clone du contenu pour boucle parfaite
    const items = Array.from(track.children);
    items.forEach((item) => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });

    // 📏 Largeur totale de la track originale
    const totalWidth = items.reduce((acc, item) => acc + (item as HTMLElement).offsetWidth, 0);

    // 🏃 GSAP marquee
    const tween = gsap.to(track, {
      x: -totalWidth, // défilement vers la gauche
      duration: totalWidth / 40, // vitesse de défilement (px/sec)
      ease: 'none', // pas d'effet de déplacement
      repeat: -1, // boucle infinie
    });

    // 🛑 Pause au hover
    marquee.addEventListener('mouseenter', () => tween.pause());
    marquee.addEventListener('mouseleave', () => tween.resume());
  });
}
