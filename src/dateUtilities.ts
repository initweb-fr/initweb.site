/**
 * 📅 Utilitaires de dates
 *
 * Fonctions pour formater et manipuler les dates.
 * Format standard : DD/MM/YYYY - HH:MM
 */

/**
 * Formate une date en chaîne au format "DD MM YYYY - HH:MM"
 * @param dateInput Date | string | number
 * @returns string
 */
export function formatDateDDMMYYYY(dateInput: Date | string | number): string {
  const date = new Date(dateInput);

  const jour = String(date.getDate()).padStart(2, '0');
  const mois = String(date.getMonth() + 1).padStart(2, '0');
  const annee = date.getFullYear();

  const heures = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${jour}/${mois}/${annee} - ${heures}:${minutes}`;
}
