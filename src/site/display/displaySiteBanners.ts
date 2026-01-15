// Fonction pour gérer l'affichage de la bannière d'actualités
export function manageNewsBanner() {
  // Sélectionne l'élément de la bannière d'actualités dans le DOM
  const newsBanner = document.querySelector('.nav_banner') as HTMLElement;
  // Sélectionne le bouton de fermeture de la bannière
  const closeButton = document.querySelector('.nav_banner_item_close') as HTMLElement;

  // Vérifie si la bannière d'actualités est présente sur la page
  if (newsBanner) {
    // Fonction pour obtenir le temps actuel en millisecondes
    function getCurrentTime() {
      return new Date().getTime();
    }

    // Fonction pour calculer le temps d'expiration de la bannière (7 jours à partir de maintenant)
    function getExpiryTime() {
      const days = 7; // Durée en jours avant expiration
      return getCurrentTime() + days * 24 * 60 * 60 * 1000; // Convertit les jours en millisecondes
    }

    // Vérifie si la bannière a été fermée précédemment et si le délai de 7 jours n'est pas encore écoulé
    const bannerClosedTime = localStorage.getItem('newsBannerClosedTime');
    if (bannerClosedTime) {
      const closedTime = parseInt(bannerClosedTime, 10); // Convertit le temps de fermeture en nombre
      // Si le temps actuel est inférieur au temps de fermeture, cache la bannière
      if (!isNaN(closedTime) && getCurrentTime() < closedTime) {
        newsBanner.style.display = 'none';
      }
    }

    // Vérifie si le bouton de fermeture est présent
    if (closeButton) {
      // Ajoute un événement de clic au bouton de fermeture pour cacher la bannière
      closeButton.addEventListener('click', function () {
        newsBanner.style.display = 'none'; // Cache la bannière
        // Enregistre le temps d'expiration dans le stockage local
        localStorage.setItem('newsBannerClosedTime', getExpiryTime().toString());
      });
    }
  }
}
