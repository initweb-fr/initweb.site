/**
 * 🎛️ Animation des panneaux académie
 *
 * Gère l'ouverture/fermeture des panneaux de navigation.
 * Supporte les interactions entre menu principal et sous-menu.
 */

// ===============================
// Configuration
// ===============================

const PANEL_STATUS = {
  OPEN: 'open',
  CLOSE: 'close',
} as const;

const PANEL_TYPES = {
  MENU: 'menu',
  SUBMENU: 'submenu',
} as const;

// ===============================
// Sélecteurs
// ===============================

/**
 * Récupère les panneaux principaux
 */
function getPanels() {
  return {
    menu: document.querySelector('[iw-aca-element="panel"][iw-aca-panel-type="menu"]'),
    submenu: document.querySelector('[iw-aca-element="panel"][iw-aca-panel-type="submenu"]'),
  };
}

// ===============================
// Gestion des panneaux
// ===============================

/**
 * Ouvre un panneau et ferme les autres si nécessaire
 * @param panel - Le panneau à ouvrir
 * @param panelType - Le type du panneau (menu ou submenu)
 */
function openPanel(panel: Element, panelType: string): void {
  // Ouvre le panneau cliqué
  panel.setAttribute('iw-aca-panel-status', PANEL_STATUS.OPEN);

  // Ferme l'autre panneau selon le type
  const panels = getPanels();

  if (panelType === PANEL_TYPES.SUBMENU) {
    // Si on ouvre le sous-menu, ferme le menu principal
    panels.menu?.setAttribute('iw-aca-panel-status', PANEL_STATUS.CLOSE);
  } else if (panelType === PANEL_TYPES.MENU) {
    // Si on ouvre le menu principal, ferme le sous-menu
    panels.submenu?.setAttribute('iw-aca-panel-status', PANEL_STATUS.CLOSE);
  }
}

/**
 * Ferme un panneau
 * @param panel - Le panneau à fermer
 */
function closePanel(panel: Element): void {
  panel.setAttribute('iw-aca-panel-status', PANEL_STATUS.CLOSE);
}

// ===============================
// Gestion des événements
// ===============================

/**
 * Initialise les boutons d'ouverture des panneaux
 */
function initOpeners(): void {
  const openers = document.querySelectorAll('[iw-aca-element="panel-opener"]');

  openers.forEach((opener) => {
    opener.addEventListener('click', function (this: HTMLElement) {
      const parentPanel = this.closest('[iw-aca-element="panel"]');

      if (!parentPanel) return;

      const panelStatus = parentPanel.getAttribute('iw-aca-panel-status');
      const panelType = parentPanel.getAttribute('iw-aca-panel-type');

      // Ouvre le panneau seulement s'il est fermé
      if (panelStatus === PANEL_STATUS.CLOSE) {
        openPanel(parentPanel, panelType || '');
      }
    });
  });
}

/**
 * Initialise les boutons de fermeture des panneaux
 */
function initResizers(): void {
  const resizers = document.querySelectorAll('[iw-aca-element="panel-resizer"]');

  resizers.forEach((resizer) => {
    resizer.addEventListener('click', function (this: HTMLElement) {
      const parentPanel = this.closest('[iw-aca-element="panel"]');

      if (!parentPanel) return;

      const panelStatus = parentPanel.getAttribute('iw-aca-panel-status');

      // Ferme le panneau seulement s'il est ouvert
      if (panelStatus === PANEL_STATUS.OPEN) {
        closePanel(parentPanel);
      }
    });
  });
}

// ===============================
// Fonction principale
// ===============================

/**
 * Initialise le système de gestion des panneaux
 *
 * Fonctionnalités :
 * - Ouverture/fermeture des panneaux
 * - Gestion des interactions entre menu et sous-menu
 * - Boutons d'ouverture et de fermeture
 */
export function animateAcaPanels(): void {
  initOpeners();
  initResizers();
}
