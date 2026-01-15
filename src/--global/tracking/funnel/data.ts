
// --------- Fonctions gérant la sauvegarde des données

import { getCookie, setCookie } from '$utils/cookieUtilities';

export function getFunnelDeviceInfos() {
  const deviceSupport = getCookie('__iw-funnel_device_support');
  const deviceLang = getCookie('__iw-funnel_device_lang');
  return { deviceSupport, deviceLang };
}

export function getFunnelUTMInfos() {
  const utmSource = getCookie('__iw-funnel_utm_source');
  const utmMedium = getCookie('__iw-funnel_utm_medium');
  const utmCampaign = getCookie('__iw-funnel_utm_campaign');
  const utmTerm = getCookie('__iw-funnel_utm_term');
  const utmContent = getCookie('__iw-funnel_utm_content');
  return { utmSource, utmMedium, utmCampaign, utmTerm, utmContent };
}

export function getFunnelNavInfos() {
  const currentPage = getCookie('__iw-funnel_page_current');
  const previousPage = getCookie('__iw-funnel_page_previous');

  return { currentPage, previousPage };
}

export function getFunnelDatas() {
  const userUTM = getFunnelUTMInfos();
  const userDevice = getFunnelDeviceInfos();
  const userNavigation = getFunnelNavInfos();

  return { userUTM, userDevice, userNavigation };
}



export function saveUserDeviceInfos() {
  // Détermination du type d'écran
  const deviceWidth = window.innerWidth;
  const deviceSupport = deviceWidth > 992 ? 'computer' : deviceWidth > 768 ? 'tablet' : 'phone';

  // Détermination de la langue de l'utilisateur
  const deviceLang =
    navigator.language || (navigator as unknown as { userLanguage: string }).userLanguage || '';

  // Sauvegarde des données
  setCookie('__iw-funnel_device_support', deviceSupport);
  setCookie('__iw-funnel_device_lang', deviceLang);
}

export function saveUserUTMInfos() {
  // Récupération des paramètres UTM
  const urlParams = new URLSearchParams(window.location.search);

  const utm_source = urlParams.get('utm_source');
  const utm_medium = urlParams.get('utm_medium');
  const utm_campaign = urlParams.get('utm_campaign');
  const utm_term = urlParams.get('utm_term');
  const utm_content = urlParams.get('utm_content');

  // Sauvegarde des cookies seulement si les valeurs existent et ne sont pas vides
  if (utm_source) {
    setCookie('__iw-funnel_utm_source', utm_source);
  }
  if (utm_medium) {
    setCookie('__iw-funnel_utm_medium', utm_medium);
  }
  if (utm_campaign) {
    setCookie('__iw-funnel_utm_campaign', utm_campaign);
  }
  if (utm_term) {
    setCookie('__iw-funnel_utm_term', utm_term);
  }
  if (utm_content) {
    setCookie('__iw-funnel_utm_content', utm_content);
  }
}

export function saveUserNavigationInfos() {
  // Si l'URL contient "/log/", on arrête la fonction
  if (window.location.pathname.includes('/log/')) {
    // Si les paramètres utm_page_current et utm_page_previous existent dans l'URL, on les sauvegarde dans les cookies
    const urlParams = new URLSearchParams(window.location.search);
    const utmPageCurrent = urlParams.get('page_current');
    const utmPagePrevious = urlParams.get('page_previous');
    if (utmPageCurrent) {
      setCookie('__iw-funnel_page_current', utmPageCurrent);
    }
    if (utmPagePrevious) {
      setCookie('__iw-funnel_page_previous', utmPagePrevious);
    }
  } else {
    const previousPagePath = getCookie('__iw-funnel_page_current');
    const currentPagePath: string = decodeURIComponent(window.location.pathname);

    // Sauvegarde du chemin de la page précédente si différent
    if (previousPagePath !== currentPagePath && previousPagePath) {
      setCookie('__iw-funnel_page_previous', previousPagePath);
    }

    // Mise à jour du chemin de la page courante
    setCookie('__iw-funnel_page_current', currentPagePath);
  }
}

export function saveMSPlanFromURL() {
  const priceID = new URLSearchParams(window.location.search).get('ms_priceID');
  if (priceID && window.location.pathname.includes('/log/')) {
    // Sauvegarde du plan dans le sessionStorage
    // sessionStorage.setItem('ms_priceID', priceID);
    // console.log('📦 Plan détecté dans l’URL, sauvegarde dans le sessionStorage:', priceID);
    // On applique l'attribut data-ms-price avec la valeur de priceID au formulaire de signup/login
    const form =
      document.querySelector('[data-ms-form="signup"]') ||
      document.querySelector('[data-ms-form="login"]');

    form?.setAttribute('data-ms-price:add', priceID);
    console.log(`Attribut data-ms-price="${priceID}" appliqué au formulaire.`);
  }
}

export function saveFunnelDatas() {
  saveUserDeviceInfos();
  saveUserUTMInfos();
  saveUserNavigationInfos();
  saveMSPlanFromURL();
}
