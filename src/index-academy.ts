import { animateAcaPanels } from 'src/academy/animate/animatePanels';
import { animateSchemes } from 'src/academy/animate/animateSchemes';
import { scrollToCurrentLink } from 'src/academy/animate/animateTOC';
import { initProgressTracking } from 'src/academy/progress/tracker';

import { getMemberJSON } from './--global/auth/data';
//import { sendFunnelDatasToWebhook } from 'src/academy/tracking/transmit';

declare global {
  interface Window {
    $memberstackReady?: boolean; // Indicateur de disponibilité de Memberstack
    fsAttributes: Array<unknown>; // Attributs personnalisés pour le CMS
    $memberstackDom: {
      getCurrentMember: () => Promise<{
        data: {
          id: string;
          auth?: {
            email?: string;
          };
        } | null;
      }>;
    }; // DOM spécifique à Memberstack
    Webflow?: Array<() => void>;
    MemberStack?: {
      onReady: Promise<{
        member: { id: string; email: string } | null;
      }>;
    };
    sendFunnelDatasToWebhook?: () => void;
  }
}

// Initialisation de Memberstack
window.$memberstackDom.getCurrentMember().then(({ data: member }) => {
  if (member) {
    // --- --- Ajout de l'attribut data-memberstack-logged-in au body --- ---
    document.body.setAttribute('data-memberstack-logged-in', 'true');
    // --- --- Affichage des Données Membre dans la Console --- ---
    console.log('Membre connecté sur le site :', member.id);
    console.log('Membre connecté (Datas) :', member);
    getMemberJSON().then((memberJSON: { data?: unknown } | null) => {
      console.log('Membre connecté (JSON) :', memberJSON?.data);
    });
    // --- --- Gestion des Fonctions liées au Membre connecté --- ---
    initProgressTracking(member);
  }
});

// Initialisation de Webflow et du reste des fonctions après animateSchemes
window.Webflow ||= [];
window.Webflow.push(() => {
  // Fonctionnalités de tracking
  // ⚠️ saveFunnelDatas();

  // Fonctionnalités de gestion des données utilisateur
  // ⚠️ saveUserLocalDatas();
  // ⚠️ fillUserLocalDatas();

  // Fonctions d'animation
  animateSchemes();
  animateAcaPanels();

  // Fonctions d'interface utilisateur
  if (window.location.pathname.includes('/formations/modules')) {
    scrollToCurrentLink();
  }
  if (window.location.pathname.includes('/bienvenue')) {
    if (typeof window.sendFunnelDatasToWebhook === 'function') {
      window.sendFunnelDatasToWebhook();
    }
  }
});
