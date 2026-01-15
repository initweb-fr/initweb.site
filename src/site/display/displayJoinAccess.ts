// Fonction pour gérer l'affichage des éléments d'accès en fonction des onglets sélectionnés
export function displayJoinAccess() {
  // Sélectionne tous les éléments de type "onglet" ayant l'attribut 'join-element="tab"'
  const joinAccessTabs = document.querySelectorAll('[iw-element="join_tab"]');

  // Sélectionne tous les éléments de type "détail" ayant l'attribut 'join-element="detail"'
  const joinAccessDetails = document.querySelectorAll('[iw-element="join_detail"]');

  // Sélectionne tous les éléments de type "bouton" ayant l'attribut 'join-element="button"'
  const joinAccessButtons = document.querySelectorAll('[iw-element="join_button"]');

  // Vérifie que tous les éléments nécessaires sont présents
  if (joinAccessTabs && joinAccessDetails && joinAccessButtons) {
    // Parcourt chaque onglet pour initialiser son état
    joinAccessTabs.forEach((tab) => {
      // Retire la classe indiquant la sélection actuelle
      tab.classList.remove('is-current-selection');
      // Ajoute la classe de sélection si l'onglet est lié à 'core'
      if (tab.getAttribute('iw-join-access')?.includes('core')) {
        tab.classList.add('is-current-selection');
      }
      // Parcourt chaque détail pour initialiser son état
      joinAccessDetails.forEach((detail) => {
        // Retire la classe indiquant la sélection actuelle
        detail.classList.remove('is-current-selection');
        // Ajoute la classe de sélection si le détail est lié à 'core'
        if (detail.getAttribute('iw-join-access')?.includes('core')) {
          detail.classList.add('is-current-selection');
        }
      });
      // Parcourt chaque bouton pour initialiser son état
      joinAccessButtons.forEach((button: Element) => {
        // Cache le bouton par défaut
        (button as HTMLElement).style.display = 'none';
        // Affiche le bouton si celui-ci est lié à 'core'
        if (button.getAttribute('iw-join-access')?.includes('core')) {
          (button as HTMLElement).style.display = 'flex';
        }
      });

      // Ajoute un écouteur d'événement pour gérer le clic sur un onglet
      tab.addEventListener('click', () => {
        // Réinitialise l'affichage de tous les onglets, détails et boutons
        joinAccessTabs.forEach((t) => {
          t.classList.remove('is-current-selection');
        });
        joinAccessDetails.forEach((d) => {
          d.classList.remove('is-current-selection');
        });
        joinAccessButtons.forEach((b: Element) => {
          (b as HTMLElement).style.display = 'none';
        });

        // Met à jour l'affichage pour l'onglet sélectionné
        tab.classList.add('is-current-selection');
        const tabID = tab.getAttribute('iw-join-access');

        // Si un ID d'onglet est présent, met à jour les détails et boutons correspondants
        if (tabID) {
          joinAccessDetails.forEach((detail) => {
            if (detail.getAttribute('iw-join-access')?.includes(tabID)) {
              detail.classList.add('is-current-selection');
            }
          });
          joinAccessButtons.forEach((button: Element) => {
            if (button.getAttribute('iw-join-access')?.includes(tabID)) {
              (button as HTMLElement).style.display = 'flex';
            }
          });
        }
      });
    });
  }
}
