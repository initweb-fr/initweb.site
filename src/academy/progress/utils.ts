/**
 * 🎨 Interface utilisateur - Utilitaires
 *
 * Gère l'apparence des éléments de progression sur la page.
 * Marque les leçons complétées, calcule les statistiques et gère les interactions.
 */

// ===============================
// INTERFACE UTILISATEUR - utils.ts
// ===============================
//
// RÔLE : Change l'apparence des éléments sur la page
//
// COMMENT ÇA MARCHE :
// 1. Marque les leçons déjà faites (cochées)
// 2. Calcule et affiche les statistiques (ex: 5/10)
// 3. Gère les loaders (petits indicateurs de chargement)
// 4. Écoute les clics sur les boutons/checkboxes
//
// ÉLÉMENTS HTML UTILISÉS :
// - [iw-progress-target] : ID de la leçon
// - [iw-progress-watched] : true/false (faite ou pas)
// - [iw-progress-trigger] : bouton ou checkbox
// ===============================

// ===============================
// MARQUAGE DES LEÇONS
// ===============================

/**
 * Marque les leçons complétées dans le DOM
 * @param lessonATIDs - Liste des ATID des leçons faites
 */
export function markCompletedLessons(lessonATIDs: string[]) {
  lessonATIDs.forEach((lessonATID) => {
    document.querySelectorAll(`[iw-progress-target-atid="${lessonATID}"]`).forEach((el) => {
      el.setAttribute('iw-progress-watched', 'true');
    });
  });
}

// ===============================
// CALCUL DES STATISTIQUES
// ===============================

/**
 * Calcule les statistiques de progression
 * @param completedCount - Nombre de leçons faites
 * @returns {total, completed, percentage}
 */
export function getProgressStats(completedCount: number) {
  const total = document.querySelectorAll('[iw-progress-trigger]').length;
  return {
    total,
    completed: completedCount,
    percentage: total > 0 ? Math.round((completedCount / total) * 100) : 0,
  };
}

/**
 * Affiche la progression globale dans la console
 */
export function logProgress(stats: { completed: number; total: number; percentage: number }) {
  console.log(`📊 Progression: ${stats.completed}/${stats.total} (${stats.percentage}%)`);
}

// ===============================
// GESTION DES LOADERS
// ===============================

/**
 * Affiche un loader sur un élément
 */
export function showLoader(element: Element, lessonId: string) {
  element.setAttribute('iw-progress-trigger-loader', 'true');
  if (element.getAttribute('iw-progress-trigger') === 'button') {
    document
      .querySelectorAll(`[iw-progress-trigger="checkbox"][iw-progress-target="${lessonId}"]`)
      .forEach((el) => el.setAttribute('iw-progress-trigger-loader', 'true'));
  }
}

/**
 * Cache le loader sur un élément
 */
export function hideLoader(element: Element, lessonId: string) {
  element.setAttribute('iw-progress-trigger-loader', 'false');
  if (element.getAttribute('iw-progress-trigger') === 'button') {
    document
      .querySelectorAll(`[iw-progress-trigger="checkbox"][iw-progress-target="${lessonId}"]`)
      .forEach((el) => el.setAttribute('iw-progress-trigger-loader', 'false'));
  }
}

// ===============================
// MISE À JOUR DE L'APPARENCE
// ===============================

/**
 * Met à jour l'apparence d'une leçon (cochée/décochée)
 */
export function updateLessonState(lessonId: string, isCompleted: boolean) {
  document
    .querySelectorAll(`[iw-progress-target-atid="${lessonId}"]`)
    .forEach((el) => el.setAttribute('iw-progress-watched', isCompleted ? 'true' : 'false'));
}

// ===============================
// ÉCOUTE DES CLICS
// ===============================

/**
 * Ajoute les listeners sur tous les éléments de progression
 */
export function setupClickListeners(
  memberId: string,
  onProgressClick: (element: Element, memberId: string) => Promise<void>
) {
  document.querySelectorAll('[iw-progress-trigger]').forEach((element) => {
    element.addEventListener('click', async function (this: Element) {
      await onProgressClick(this, memberId);
    });
  });
}

// ===============================
// FONCTIONS UTILITAIRES
// ===============================

/**
 * Mémorise la dernière leçon visitée pour le cours
 */
export function trackLastLessons(courseIWID: string) {
  localStorage.setItem(`__iw_${courseIWID}_lastlessonurl`, window.location.pathname || '');
  localStorage.setItem(
    `__iw_${courseIWID}_lastlessoniwid`,
    localStorage.getItem(`__iw_currentlesson_iwid`) || ''
  );
}

// Types utiles pour la progression
export type CompletedLesson = {
  lessonIWID: string;
  lessonATID: string;
  title: string;
  completedAt: string;
};
export type CompletedLessonsList = {
  lessons: CompletedLesson[];
  count: number;
};

/**
 * Récupère la liste des leçons complétées pour un cours depuis Memberstack
 */
export async function getCompletedLessonsList(
  member: Record<string, unknown>,
  courseIWID: string
): Promise<CompletedLessonsList> {
  const memberJSON = member?.memberJSON || {};
  type CourseProgress = {
    [key: string]: unknown;
    lessonCompleted?: Record<string, { lessonATID?: string; title?: string; completedAt: string }>;
  };
  const courseProgress = memberJSON[courseIWID] as CourseProgress | undefined;
  const lessonCompletedRaw = courseProgress?.lessonCompleted as Record<string, unknown> | undefined;
  if (!lessonCompletedRaw) {
    return { lessons: [], count: 0 };
  }
  const lessons: CompletedLesson[] = Object.entries(lessonCompletedRaw).map(([lessonIWID, v]) => {
    const lesson = v as { lessonATID?: string; title?: string; completedAt: string };
    return {
      lessonIWID,
      lessonATID: lesson.lessonATID || '',
      title: lesson.title || '',
      completedAt: lesson.completedAt,
    };
  });
  return {
    lessons,
    count: lessons.length,
  };
}
