// À ajouter dans votre fichier principal
export function setupScrollBehavior() {
  // Désactiver la restauration automatique du scroll
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Force le scroll top au chargement
  window.addEventListener('load', () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  });
}
