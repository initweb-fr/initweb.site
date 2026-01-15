/*
export function createVideoOnLoad() {
  // Sélectionne tous les composants vidéo sur la page
  const videoComponents = document.querySelectorAll('[element="video-component"]');
  //console.log(videoComponents); // Ligne de débogage pour afficher les composants vidéo

  // Parcourt chaque composant vidéo
  videoComponents.forEach((container) => {
    // Sélectionne l'élément contenant l'ID Vimeo
    const vimeoIDElement = container.querySelector('[element="video-id"]');
    // Sélectionne l'élément du lecteur vidéo
    const vimeoPlayerElement = container.querySelector('[element="video-player"]');
    // Vérifie si les deux éléments existent
    if (vimeoIDElement && vimeoPlayerElement) {
      // Récupère l'ID Vimeo à partir du contenu textuel de l'élément
      const vimeoID = vimeoIDElement.textContent;
      //console.log(vimeoID); // Ligne de débogage pour afficher l'ID Vimeo
      // Remplace le placeholder dans l'URL du lecteur par l'ID Vimeo réel
      vimeoPlayerElement.src = vimeoPlayerElement.src.replace('--insertHereVideoID--', vimeoID);
    }
  });
}

export function loadVideoOnHover() {
  // Sélectionne tous les composants vidéo sur la page
  const videoComponents = document.querySelectorAll('[element="video-component"]');

  // Parcourt chaque composant vidéo
  videoComponents.forEach((container) => {
    // Sélectionne l'iframe du lecteur vidéo
    const iframe = container.querySelector('iframe');
    // Crée une instance du lecteur Vimeo
    const player = new Vimeo.Player(iframe);

    // Ajoute un événement pour jouer la vidéo au survol de la souris
    container.addEventListener('mouseenter', function () {
      player.play();
    });

    // Ajoute un événement pour mettre en pause la vidéo lorsque la souris quitte le composant
    container.addEventListener('mouseleave', function () {
      player.pause();
    });
  });
}
  */
