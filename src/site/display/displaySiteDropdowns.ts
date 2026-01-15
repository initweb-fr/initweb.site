export function manageDropdowns() {
  // 1. Sélectionne toutes les listes de Dropdowns
  const dropdownsLists = document.querySelectorAll('[iw-element="dropdown-list"]');

  dropdownsLists.forEach((dropdownsList) => {
    // 2. Sélectionne tous les Dropdowns dans la liste actuelle
    const dropdowns = dropdownsList.querySelectorAll('[iw-element="dropdown"]');

    // Ouvre par défaut le premier dropdown de la liste, s'il existe
    if (dropdowns.length > 0) {
      dropdowns[0].setAttribute('iw-status', 'active');
    }

    dropdowns.forEach((dropdown) => {
      // 3. Sélectionne l'élément "Toggle" & l'élément "Content" du dropdown actuel
      const dropdownToggle = dropdown.querySelector('[iw-element="dropdown-toggle"]');
      const dropdownContent = dropdown.querySelector('[iw-element="dropdown-content"]');

      if (dropdownToggle && dropdownContent) {
        // 4. Ajoute un écouteur d'événement de clic sur l'élément "Toggle"
        dropdownToggle.addEventListener('click', () => {
          // Si le dropdown est déjà actif, on le ferme et on arrête l'exécution
          if (dropdown.getAttribute('iw-status') === 'active') {
            dropdown.removeAttribute('iw-status');
            return;
          }
          // Supprime l'attribut status="active" de tous les dropdowns
          dropdowns.forEach((openedDropdown) => {
            openedDropdown.removeAttribute('iw-status');
          });

          // Ajoute l'attribut status="active" uniquement sur le dropdown cliqué
          dropdown.setAttribute('iw-status', 'active');
        });
      }
    });
  });
}
