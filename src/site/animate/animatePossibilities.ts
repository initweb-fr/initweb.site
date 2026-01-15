export function animateSliderC1OnResponsive() {
  const breakpointDesktop = window.matchMedia('(min-width: 992px)'); // Définition du breakpoint pour les écrans de bureau

  const handleResize = () => {
    if (breakpointDesktop.matches) {
      if (!window.location.pathname.includes('/academie')) {
        animateSliderC1(); // Initialisation des animations pour les écrans de bureau
      }
    }
  };

  handleResize(); // Appel initial de la fonction de redimensionnement
  window.addEventListener('resize', handleResize); // Ajout d'un écouteur d'événement pour le redimensionnement de la fenêtre
}

function animateSliderC1() {
  const selectors = document.querySelectorAll('[iw-element="possibilities_selector"]');
  const visuals = document.querySelectorAll('[iw-element="possibilities_visual"]');
  const timelines = document.querySelectorAll('[iw-element="possibilities_timeline"]');
  const slideDuration = 10000; // Durée en millisecondes

  if (selectors && visuals && timelines) {
    let currentSlide = 1;
    let interval: NodeJS.Timeout;

    // Fonction pour réinitialiser toutes les barres de progression
    function resetAllTimelines() {
      timelines.forEach((timeline) => {
        const timelineElement = timeline as HTMLElement;
        timelineElement.style.transition = 'none';
        timelineElement.style.width = '0%';
      });
    }

    // Fonction pour gérer la barre de progression
    // Fonction pour démarrer la progression
    function startProgress(index: number) {
      resetAllTimelines();
      const timeline = timelines[index] as HTMLElement;

      // Force un reflow pour assurer que la transition sera appliquée
      timeline.offsetHeight;

      // Applique la transition et démarre la progression
      timeline.style.transition = `width ${slideDuration}ms linear`;
      timeline.style.width = '100%';
    }

    // Fonction pour afficher une slide spécifique
    function showSlide(index: number) {
      // Retirer la classe active de toutes les slides et boutons
      visuals.forEach((visual) => visual.setAttribute('iw-possibilities-status', 'hidden'));
      selectors.forEach((selector) => selector.setAttribute('iw-possibilities-status', 'clear'));

      // Ajouter la classe active à la slide et au bouton courant
      visuals[index].setAttribute('iw-possibilities-status', 'visible');
      selectors[index].setAttribute('iw-possibilities-status', 'selected');
      currentSlide = index;

      // Démarrer la progression pour cette slide
      startProgress(index);
    }

    // Fonction pour passer à la slide suivante
    function nextSlide() {
      currentSlide = (currentSlide + 1) % visuals.length;
      showSlide(currentSlide);
    }

    // Ajouter les écouteurs d'événements aux boutons
    selectors.forEach((selector, index) => {
      selector.addEventListener('click', () => {
        clearInterval(interval);
        showSlide(index);
        interval = setInterval(nextSlide, slideDuration);
      });
    });

    // Afficher la première slide au chargement
    showSlide(0);

    // Démarrer le défilement automatique
    interval = setInterval(nextSlide, slideDuration);
  }
}
