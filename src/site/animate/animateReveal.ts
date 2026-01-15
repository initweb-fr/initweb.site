import { gsap } from 'gsap'; // Importation de la bibliothèque GSAP pour les animations
gsap.registerPlugin(ScrollTrigger); // Enregistrement du plugin ScrollTrigger de GSAP
import ScrollTrigger from 'gsap/ScrollTrigger'; // Importation du plugin ScrollTrigger de GSAP
import SplitType from 'split-type'; // Importation de la bibliothèque SplitType pour diviser le texte en lignes, mots et caractères

/*
Mémo rapide des valeurs possibles pour l'attribut "iw-animate-style" :

- "slide-up"         : Fait glisser l'élément vers le haut avec une animation de fondu.
- "slide-down"       : Fait glisser l'élément vers le bas avec une animation de fondu.
- "fade-in"          : Fait apparaître l'élément progressivement (opacité).
- "words"            : Anime chaque mot séparément (nécessite SplitType).
- "lines"            : Anime chaque ligne séparément (nécessite SplitType).
- "words-slide-up"   : Fait glisser chaque mot vers le haut avec un effet de fondu.
- "lines-slide-up"   : Fait glisser chaque ligne vers le haut avec un effet de fondu.
- "words-fade-in"    : Fait apparaître chaque mot progressivement.
- "lines-fade-in"    : Fait apparaître chaque ligne progressivement.

Astuce : Vous pouvez combiner certains styles avec les attributs "iw-animate-delay" (en ms) et "iw-animate-instant" pour personnaliser le comportement.
*/

export function revealElements() {
  const specDuration = 0.6;
  const specBaseMoveYLow = 16;
  const specStaggerWords = 0.05;
  const specStaggerLines = 0.1;
  const specBaseOpacity0 = 0;
  const specBaseOpacity10 = 0.1;
  const specEase = 'power2.out';

  const animatedElements = document.querySelectorAll('[iw-animate-style]');

  animatedElements.forEach((element) => {
    const specStyle = element.getAttribute('iw-animate-style');
    const specDelay = parseFloat(element.getAttribute('iw-animate-delay') || '0') / 1000;
    let elementSlice: SplitType | undefined;

    // Vérifier si l'animation doit être instantanée
    const isInstant = element.hasAttribute('iw-animate-instant');

    // Configuration de base pour l'animation
    const baseConfig = {
      duration: specDuration,
      ease: specEase,
      delay: specDelay,
    };

    // Configuration du scrollTrigger uniquement si ce n'est pas instantané
    const scrollTriggerConfig = isInstant
      ? undefined
      : {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none',
        };

    // Initialiser SplitType si nécessaire
    if (specStyle?.includes('words')) {
      elementSlice = new SplitType(element as HTMLElement, { types: 'words' });
    } else if (specStyle?.includes('lines')) {
      elementSlice = new SplitType(element as HTMLElement, { types: 'lines' });
    }

    switch (specStyle) {
      case 'slide-up':
        gsap.fromTo(
          element,
          { y: specBaseMoveYLow, opacity: specBaseOpacity0 },
          {
            ...baseConfig,
            y: 0,
            opacity: 1,
            scrollTrigger: scrollTriggerConfig,
          }
        );
        break;

      case 'fade-in':
        gsap.fromTo(
          element,
          { opacity: specBaseOpacity0 },
          {
            ...baseConfig,
            opacity: 1,
            scrollTrigger: scrollTriggerConfig,
          }
        );
        break;

      case 'words-slide-up':
        if (elementSlice?.words) {
          gsap.fromTo(
            elementSlice.words,
            { y: specBaseMoveYLow, opacity: specBaseOpacity0 },
            {
              ...baseConfig,
              y: 0,
              opacity: 1,
              stagger: specStaggerWords,
              scrollTrigger: scrollTriggerConfig,
            }
          );
        }
        break;

      case 'lines-slide-up':
        if (elementSlice?.lines) {
          gsap.fromTo(
            elementSlice.lines,
            { y: specBaseMoveYLow, opacity: specBaseOpacity0 },
            {
              ...baseConfig,
              y: 0,
              opacity: 1,
              stagger: specStaggerLines,
              scrollTrigger: scrollTriggerConfig,
            }
          );
        }
        break;
      case 'lines-fade-in':
        if (elementSlice?.lines) {
          gsap.fromTo(
            elementSlice.lines,
            { y: specBaseMoveYLow, opacity: specBaseOpacity10 },
            {
              ...baseConfig,
              y: 0,
              opacity: 1,
              stagger: specStaggerLines,
              scrollTrigger: scrollTriggerConfig,
            }
          );
        }
        break;
    }
  });

  // Forcer une mise à jour de ScrollTrigger
  ScrollTrigger.refresh();

  // Attendre que tout soit chargé pour rafraîchir ScrollTrigger
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
}
