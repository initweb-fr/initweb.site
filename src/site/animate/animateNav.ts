/**
 * 📱 Animation de navigation responsive
 *
 * Gère l'ouverture/fermeture du menu mobile et les animations responsive.
 * S'adapte automatiquement selon la taille d'écran.
 */

export function animateNavOnResponsive() {
  const breakpointDesktop = window.matchMedia('(min-width: 992px)'); // Définition du breakpoint pour les écrans de bureau

  const handleResize = () => {
    if (breakpointDesktop.matches) {
    } else {
      openNavOnMobile();
      // Pas d'animation pour les écrans plus petits
    }
  };

  handleResize(); // Appel initial de la fonction de redimensionnement
  window.addEventListener('resize', handleResize); // Ajout d'un écouteur d'événement pour le redimensionnement de la fenêtre
}
function openNavOnMobile() {
  // Sélection du NavWrapper
  const navWrapper = document.querySelector('[iw-nav-element="nav"]') as HTMLElement;
  if (!navWrapper) return;
  //Sélection des éléments
  const navMenu = navWrapper.querySelector('[iw-nav-element="nav-menu"]') as HTMLElement;
  const navMobileOpen = navWrapper.querySelector('[iw-nav-element="button-open"]') as HTMLElement;
  const navMobileClose = navWrapper.querySelector('[iw-nav-element="button-close"]') as HTMLElement;
  if (!navMobileOpen || !navMobileClose || !navMenu) return;
  // Initialisation
  navMobileOpen.style.display = 'flex';
  navMobileClose.style.display = 'none';
  navMenu.style.display = 'none';

  function openNav() {
    //Paramètres du Wrapper
    navWrapper.classList.add('v-menu-open');
    //Paramètres des Boutons
    navMobileOpen.style.display = 'none';
    navMobileClose.style.display = 'flex';
    //Paramètres du Menu
    navMenu.style.display = 'flex';
  }

  function closeNav() {
    //Paramètres du Wrapper
    navWrapper.classList.remove('v-menu-open');
    //Paramètres des Boutons
    navMobileOpen.style.display = 'flex';
    navMobileClose.style.display = 'none';
    //Paramètres du Menu
    navMenu.style.display = 'none';
  }

  // Ouverture du Menu
  navMobileOpen?.addEventListener('click', () => {
    openNav();
  });

  // Fermeture du Menu
  navMobileClose?.addEventListener('click', () => {
    closeNav();
  });
}

export function animateNavDropDownOnResponsive() {
  const navDropdowns = document.querySelectorAll('.nav_dd');
  navDropdowns.forEach((navDropdown) => {
    const navDropdownCloseBtn = navDropdown.querySelector('.nav_dd_back_button');
    const navDropdownToggle = navDropdown.querySelector('.nav_dd_button');
    // const navDropdownPanel = navDropdown.querySelector('.nav_dd_panel');
    console.log(navDropdownCloseBtn);
    if (navDropdownCloseBtn && navDropdown) {
      navDropdownCloseBtn.addEventListener('click', function () {
        console.log('clic');
        (navDropdownToggle as HTMLElement)?.click();
        /*
        navDropdown?.setAttribute('style', '');

        navDropdownsToggle?.classList.remove('w--open');
        navDropdownsToggle?.setAttribute('aria-expanded', 'false');

        navDropdownsPanel?.classList.remove('w--open');
        */
      });
    }
  });
}
