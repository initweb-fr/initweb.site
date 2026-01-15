// Fonction pour gérer le TOC global
export function manageGlobalTOC() {
  // Initialisation des éléments du TOC
  const resetTOC = document.querySelector('.mod-cont_toc_reset') as HTMLElement;
  const tocElement = document.querySelector('.mod-cont_toc_component') as HTMLElement;
  const openTOC = document.querySelector('.mod-cont_toc_open-all') as HTMLElement;

  // Vérifie si l'élément TOC existe
  if (tocElement) {
    // Vérifie si le bouton de réinitialisation existe
    if (resetTOC) {
      // Vérifie si le bouton d'ouverture existe
      if (openTOC) {
        // Définir les styles initiaux pour les boutons
        resetTOC.style.backgroundColor = 'var(--background-color--alternate-30)';
        resetTOC.style.borderColor = 'var(--border-color--alternate-100)';
        openTOC.style.backgroundColor = 'var(--background-color--alternate-15)';
        openTOC.style.borderColor = 'var(--border-color--alternate-0)';

        // Ajouter un événement de clic pour ouvrir tous les éléments du TOC
        openTOC.addEventListener('click', function () {
          if (tocElement) {
            tocElement.classList.add('all-open');
          }
          // Mettre à jour les styles des boutons après le clic
          resetTOC.style.backgroundColor = 'var(--background-color--alternate-15)';
          resetTOC.style.borderColor = 'var(--border-color--alternate-0)';
          openTOC.style.backgroundColor = 'var(--background-color--alternate-30)';
          openTOC.style.borderColor = 'var(--border-color--alternate-100)';
        });

        // Ajouter un événement de clic pour réinitialiser le TOC
        resetTOC.addEventListener('click', function () {
          if (tocElement) {
            tocElement.classList.remove('all-open');
          }
          // Mettre à jour les styles des boutons après le clic
          resetTOC.style.backgroundColor = 'var(--background-color--alternate-30)';
          resetTOC.style.borderColor = 'var(--border-color--alternate-100)';
          openTOC.style.backgroundColor = 'var(--background-color--alternate-15)';
          openTOC.style.borderColor = 'var(--border-color--alternate-0)';
        });
      }
    }
  }
}

// Fonction pour gérer le TOC des chapitres
export function manageChapterTOC() {
  // Initialisation des éléments du TOC
  const resetTOC = document.querySelector('.mod-cont_toc_reset') as HTMLElement;
  const currentChapter = document.querySelector(
    '.mod-cont_toc_chapter_item:has(.w--current)'
  ) as HTMLElement;
  const tocChapters = document.querySelectorAll(
    '.mod-cont_toc_chapter_item'
  ) as NodeListOf<Element>;

  // Ouvrir le chapitre actuel
  if (currentChapter) {
    currentChapter.classList.add('is-open');
  }

  // Ajouter un événement de clic pour chaque chapitre
  tocChapters.forEach((tocChapter) => {
    tocChapter.addEventListener('click', function (this: HTMLElement) {
      // Fermer tous les chapitres
      tocChapters.forEach((chapter) => {
        chapter.classList.remove('is-open');
      });

      // Ouvrir le chapitre cliqué
      this.classList.toggle('is-open');
    });
  });

  // Ajouter un événement de clic pour réinitialiser le TOC
  if (resetTOC) {
    resetTOC.addEventListener('click', function () {
      // Fermer tous les chapitres
      tocChapters.forEach((tocChapter) => {
        tocChapter.classList.remove('is-open');
      });

      // Ouvrir le chapitre actuel
      if (currentChapter) {
        currentChapter.classList.add('is-open');
      }
    });
  }
}

// Fonction pour gérer le TOC des sous-chapitres
export function manageSubChapterTOC() {
  // Initialisation des éléments du TOC
  const resetTOC = document.querySelector('.mod-cont_toc_reset');
  const currentSubChapter = document.querySelector(
    '.mod-cont_toc_subchapter_item:has(.w--current)'
  );
  const tocSubChapters = document.querySelectorAll('.mod-cont_toc_subchapter_item');

  // Ouvrir le sous-chapitre actuel
  if (currentSubChapter) {
    currentSubChapter.classList.add('is-open');
  }

  // Ajouter un événement de clic pour chaque sous-chapitre
  tocSubChapters.forEach((tocSubChapter) => {
    tocSubChapter.addEventListener('click', function (this: HTMLElement) {
      // Fermer tous les sous-chapitres
      tocSubChapters.forEach((tocSubChapter) => {
        tocSubChapter.classList.remove('is-open');
      });

      // Ouvrir le sous-chapitre cliqué
      this.classList.add('is-open');
    });
  });

  // Ajouter un événement de clic pour chaque sous-chapitre (duplication de code)
  tocSubChapters.forEach((tocSubChapter) => {
    tocSubChapter.addEventListener('click', function (this: HTMLElement) {
      // Fermer tous les sous-chapitres
      tocSubChapters.forEach((subChapter) => {
        subChapter.classList.remove('is-open');
      });

      // Ouvrir le sous-chapitre cliqué
      this.classList.add('is-open');
    });
  });

  // Ajouter un événement de clic pour réinitialiser le TOC
  if (resetTOC) {
    resetTOC.addEventListener('click', function () {
      // Fermer tous les sous-chapitres
      tocSubChapters.forEach((tocSubChapter) => {
        tocSubChapter.classList.remove('is-open');
      });

      // Ouvrir le sous-chapitre actuel
      if (currentSubChapter) {
        currentSubChapter.classList.add('is-open');
      }
    });
  }
}

// Fonction pour gérer le TOC global en mode mobile
export function manageGlobalTOC_mobile() {
  const breakpointDesktop = window.matchMedia('(min-width: 992px)');

  // Fonction pour gérer le redimensionnement de la fenêtre
  const handleResize = () => {
    if (breakpointDesktop.matches) {
      initManageGlobalTOC_mobile();
    } else {
      // Gérer le cas mobile si nécessaire
    }
  };

  handleResize(); // Appel initial pour configurer l'état correct au chargement
  window.addEventListener('resize', handleResize); // Écouter l'événement de redimensionnement

  // Initialisation des éléments du TOC en mode mobile
  function initManageGlobalTOC_mobile() {
    const headerTOC = document.querySelector('.mod-cont_toc_header_title') as HTMLElement;

    const resetTOC = document.querySelector('.mod-cont_toc_reset') as HTMLElement;
    const openTOC = document.querySelector('.mod-cont_toc_open-all') as HTMLElement;

    const tocElement = document.querySelector('.mod-cont_toc_component') as HTMLElement;

    // Définir les styles initiaux pour les boutons
    resetTOC.style.backgroundColor = 'var(--background-color--alternate-30)';
    resetTOC.style.borderColor = 'var(--border-color--alternate-100)';
    openTOC.style.backgroundColor = 'var(--background-color--alternate-15)';
    openTOC.style.borderColor = 'var(--border-color--alternate-0)';

    let clickCount = 0;
    // Ajouter un événement de clic pour le header du TOC
    headerTOC.addEventListener('click', function () {
      clickCount += 1;

      if (clickCount === 1) {
        // Ouvrir tous les éléments du TOC
        tocElement.classList.add('all-open');
        resetTOC.style.backgroundColor = 'var(--background-color--alternate-15)';
        resetTOC.style.borderColor = 'var(--border-color--alternate-0)';
        openTOC.style.backgroundColor = 'var(--background-color--alternate-30)';
        openTOC.style.borderColor = 'var(--border-color--alternate-100)';
      } else if (clickCount === 2) {
        // Fermer tous les éléments du TOC
        tocElement.classList.remove('all-open');
        resetTOC.style.backgroundColor = 'var(--background-color--alternate-30)';
        resetTOC.style.borderColor = 'var(--border-color--alternate-100)';
        openTOC.style.backgroundColor = 'var(--background-color--alternate-15)';
        openTOC.style.borderColor = 'var(--border-color--alternate-0)';
        clickCount = 0;
      }
    });
  }
}
