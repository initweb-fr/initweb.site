declare global {
  interface Window {
    /**
     * Swiper chargé globalement (ex: via Webflow/CDN).
     * On le type en `unknown` pour éviter toute dépendance NPM côté build.
     */
    Swiper?: unknown;
  }
}

export {};
