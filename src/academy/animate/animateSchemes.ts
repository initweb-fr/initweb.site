/**
 * 🎨 Gestion des thèmes - Light/Dark/System
 *
 * Gère les thèmes de couleur de l'interface utilisateur.
 * Supporte les modes light, dark et system (préférence OS).
 */

// ===============================
// Configuration
// ===============================

const THEME_KEY = 'theme';
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

const CSS_CLASSES = {
  LIGHT: 'iw-theme-light',
  DARK: 'iw-theme-dark',
  SYSTEM: 'iw-theme-system',
} as const;

// ===============================
// Fonctions utilitaires
// ===============================

/**
 * Vérifie si le système préfère le mode sombre
 */
function prefersDarkMode(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Récupère le thème sauvegardé ou retourne 'system' par défaut
 */
function getSavedTheme(): string {
  return localStorage.getItem(THEME_KEY) || THEMES.SYSTEM;
}

/**
 * Récupère le thème actuellement appliqué
 */
function getCurrentTheme(): 'light' | 'dark' {
  return document.body.classList.contains(CSS_CLASSES.DARK) ? 'dark' : 'light';
}

// ===============================
// Gestion des thèmes
// ===============================

/**
 * Applique un thème sur l'interface
 * @param theme - Le thème à appliquer ('light', 'dark', 'system')
 * @param save - Si true, sauvegarde le choix dans localStorage
 */
function applyTheme(theme: string, save = true): void {
  // Détermine le thème final
  let finalTheme = theme;
  if (theme === THEMES.SYSTEM) {
    finalTheme = prefersDarkMode() ? THEMES.DARK : THEMES.LIGHT;
  }

  // Nettoie toutes les classes de thème
  document.body.classList.remove(CSS_CLASSES.LIGHT, CSS_CLASSES.DARK, CSS_CLASSES.SYSTEM);

  // Applique le thème final
  if (finalTheme === THEMES.DARK) {
    document.body.classList.add(CSS_CLASSES.DARK);
  } else {
    document.body.classList.add(CSS_CLASSES.LIGHT);
  }

  // Ajoute la classe system si nécessaire
  if (theme === THEMES.SYSTEM) {
    document.body.classList.add(CSS_CLASSES.SYSTEM);
  }

  // Sauvegarde si demandé
  if (save) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.warn('❌ Erreur sauvegarde thème:', error);
    }
  }
}

/**
 * Met à jour l'état des boutons de bascule
 */
function updateToggleButtons(): void {
  const theme = getCurrentTheme();
  document.querySelectorAll('[iw-theme-toggle="light-dark"]').forEach((button) => {
    button.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
  });
}

// ===============================
// Gestion des événements
// ===============================

/**
 * Initialise les boutons de sélection de thème
 */
function initThemeButtons(): void {
  // Boutons de sélection directe
  const buttonSelectors = {
    light: '[iw-theme-button="color-mode-light"]',
    dark: '[iw-theme-button="color-mode-dark"]',
    system: '[iw-theme-button="color-mode-system"]',
  };

  Object.entries(buttonSelectors).forEach(([theme, selector]) => {
    document.querySelectorAll(selector).forEach((button) => {
      button.addEventListener('click', () => {
        console.log(`🎨 Changement thème: ${theme}`);
        applyTheme(theme);
        updateToggleButtons();
        button.setAttribute('iw-theme-active', 'true');
      });
    });
  });

  // Boutons de bascule (switch)
  document.querySelectorAll('[iw-theme-toggle="light-dark"]').forEach((button) => {
    button.addEventListener('click', () => {
      const newTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      updateToggleButtons();
    });
  });
}

/**
 * Initialise le système de thèmes
 */
function initTheme(): void {
  const savedTheme = getSavedTheme();
  applyTheme(savedTheme, false); // Applique sans resauvegarder
  updateToggleButtons();
  initThemeButtons();
}

// ===============================
// Fonction principale
// ===============================

/**
 * Initialise le système de gestion des thèmes
 *
 * Fonctionnalités :
 * - Applique le thème sauvegardé au chargement
 * - Gère les boutons de sélection et bascule
 * - S'adapte aux changements de préférence système
 * - Sauvegarde automatique des choix utilisateur
 */
export function animateSchemes(): void {
  // Attend que le DOM soit prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }

  // Écoute les changements de préférence système
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getSavedTheme() === THEMES.SYSTEM) {
      applyTheme(THEMES.SYSTEM, false);
      updateToggleButtons();
    }
  });
}
