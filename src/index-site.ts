//import { initFunnelDatas, initTransmitFunnelDatas } from 'src/site/tracking/funnel';
import { getMemberDatas, getMemberJSON } from 'src/--global/auth/data';
import { initBunnyPlayer } from 'src/--global/video/video';
import { animateFormLabels } from 'src/site/animate/animateForm';
import {
  animateNavDropDownOnResponsive,
  animateNavOnResponsive,
} from 'src/site/animate/animateNav';
import { animateSliderC1OnResponsive } from 'src/site/animate/animatePossibilities';
import { revealElements } from 'src/site/animate/animateReveal';
import { animateMarqueeReviews } from 'src/site/animate/animateSlider';
// Importation des fonctions d'affichage
import { displayJoinAccess } from 'src/site/display/displayJoinAccess';
import { setupScrollBehavior } from 'src/site/display/displayPage';
import { manageNewsBanner } from 'src/site/display/displaySiteBanners';
import { manageDropdowns } from 'src/site/display/displaySiteDropdowns';
import { toggleModalV3 } from 'src/site/display/displaySiteModales';
import { addCurrentPageToNav } from 'src/site/display/displaySiteNav';
import { displaySiteTab } from 'src/site/display/displaySiteTab';
import { initializeDates } from 'src/site/display/displayTimeline';
// Importation des fonctions V3
import { checkLinks } from 'src/site/internal/checkLinks';
import { sliderReviewsCards, sliderReviewsMarquee } from 'src/site/sliders/slidersReviews';
import { sliderTargetsCards } from 'src/site/sliders/slidersTargets';

// Déclaration des types globaux
declare global {
  interface Window {
    fsAttributes: Array<unknown>; // Attributs personnalisés pour le CMS
    Webflow?: Array<() => void>;
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
  }
});

// Initialisation de Webflow
window.Webflow ||= [];
window.Webflow.push(() => {
  // --- --- Gestion des Vidéos HLS --- ---
  initBunnyPlayer();

  // --- --- Gestion des Components Webflow --- ---
  toggleModalV3();
  displaySiteTab();

  // Fonctionnalités de tracking
  // ⚠️ initFunnelDatas();
  // ⚠️ initTransmitFunnelDatas();

  // Fonctionnalités de gestion des données utilisateur
  // ⚠️ saveUserLocalDatas();
  // ⚠️ fillUserLocalDatas();

  // --- --- Gestion des Animations --- ---
  animateFormLabels();
  sliderReviewsCards();
  sliderReviewsMarquee();
  sliderTargetsCards();

  // --- --- Gestion des initialisations générales --- ---
  // ⚠️ setupScrollBehavior();
  // ⚠️ initializeDates();
  // ⚠️ revealElements();

  // --- --- Gestion des Fonctionnalités de l'Interface Utilisateur --- ---
  addCurrentPageToNav();
  manageNewsBanner();
  manageDropdowns();
  displayJoinAccess();

  // --- --- Gestion des Animations Responsives --- ---
  animateNavOnResponsive();
  animateNavDropDownOnResponsive();
  animateSliderC1OnResponsive();
  animateMarqueeReviews();

  // --- --- Fonctionnalités liées à Webflow Staging --- ---
  if (window.location.href.includes('site-initweb-v3')) {
    checkLinks();
  }
});
