// ===============================
// Fonctions Memberstack
// ===============================

/**
 * Récupère le membre connecté depuis Memberstack
 * @returns Données membre Memberstack ou null
 */
export function getMemberDatas() {
  // Récupération des données du membre
  const memberstack = window.$memberstackDom;
  if (!memberstack) return null;
  const member = memberstack.getCurrentMember();
  // Récupération des données du membre JSON

  return member;
}

export function getMemberJSON() {
  const memberstack = window.$memberstackDom;
  if (!memberstack) return null;
  const memberJSON = memberstack.getMemberJSON();
  return memberJSON;
}
