/**
 * 🎯 Tracker de progression - Orchestrateur principal
 *
 * Gère les clics sur les leçons et coordonne la sauvegarde.
 * Orchestre l'interaction entre l'interface et la base de données.
 */

// ===============================
// TRACKER DE PROGRESSION - tracker.ts
// ===============================
//
// RÔLE : Gère les clics sur les leçons et sauvegarde la progression
//
// COMMENT ÇA MARCHE :
// 1. Quand l'utilisateur clique sur une leçon
// 2. On change l'apparence (cochée/décochée)
// 3. On sauvegarde dans la base de données
//
// FICHIERS UTILISÉS :
// - utils.ts : Pour changer l'apparence des éléments
// ===============================

import {
  getCompletedLessonsList,
  getProgressStats,
  hideLoader,
  logProgress,
  markCompletedLessons,
  setupClickListeners,
  showLoader,
  trackLastLessons,
  updateLessonState,
} from './utils';

// ===============================
// TYPES
// ===============================

// ===============================
// DÉMARRAGE DU SYSTÈME
// ===============================

type Member = {
  id?: string;
  memberJSON?: Record<string, unknown>;
  memberDATAS?: { customFields?: Record<string, string> };
};

/**
 * Démarre le système de progression
 * Appelé au chargement de la page
 */
export async function initProgressTracking(member: Member) {
  try {
    // 1. Récupérer les infos du membre connecté
    const memberMSID = member?.id;
    if (!memberMSID) {
      console.log('❌ Aucun membre MS connecté');
      return;
    }
    const courseIWID = localStorage.getItem('__iw_currentlesson_course-iwid');
    if (!courseIWID) {
      console.log('❌ Aucun cours sélectionné');
      return;
    }
    trackLastLessons(courseIWID);

    // 2. Récupérer la progression depuis Memberstack
    const completedLessonsData = await getCompletedLessonsList(member, courseIWID);
    const completedLessons = completedLessonsData.lessons || [];
    const completedCount = completedLessonsData.count || 0;
    const stats = getProgressStats(completedCount);
    const lessonATIDs = completedLessons.map((lesson) => lesson.lessonATID).filter(Boolean);

    // 3. Marquer les leçons complétées dans le DOM
    markCompletedLessons(lessonATIDs);
    logProgress(stats);

    // 4. Installer les listeners sur les éléments interactifs
    setupClickListeners(memberMSID, (element) => handleClick(element, member));
    console.log('✅ Système de progression démarré');
  } catch (error) {
    console.error('❌ Erreur au démarrage:', error);
  }
}

// ===============================
// GESTION DES CLICS
// ===============================

/**
 * Appelé quand l'utilisateur clique sur une leçon
 * @param element - L'élément cliqué (bouton ou checkbox)
 * @param memberId - L'ID du membre connecté
 */
async function handleClick(element: Element, member: Member) {
  // Récupérer les infos de la leçon
  const lessonATID = element.getAttribute('iw-progress-target-atid') || '';
  const lessonIWID = element.getAttribute('iw-progress-target-iwid') || '';
  const lessonTitle = element.getAttribute('data-lesson-title') || '';

  const isWatched = element.getAttribute('iw-progress-watched') === 'true';
  if (!lessonATID || !lessonIWID) return;

  showLoader(element, lessonATID);

  try {
    let action = '';
    const isCompleted = !isWatched;
    updateLessonState(lessonATID, isCompleted);

    // 1. Lire le JSON complet depuis Memberstack
    const memberJSON = member?.memberJSON || {};
    const memberATID = member?.memberDATAS?.customFields?.['member-atid'] || '';

    //console.log('data', data);
    const courseIWID = localStorage.getItem('__iw_currentlesson_course-iwid') || 'unknown';
    console.log('[STEP 1] memberJSON initial:', JSON.stringify(memberJSON, null, 2));

    // 2. Ajouter ou retirer la leçon courante
    const courseProgress = (memberJSON[courseIWID] as Record<string, unknown>) || {};
    const lessonCompletedRaw =
      (courseProgress['lessonCompleted'] as Record<
        string,
        { completedAt: string; lessonATID: string; title: string }
      >) || {};

    if (isCompleted) {
      lessonCompletedRaw[lessonIWID] = {
        lessonATID: lessonATID,
        title: lessonTitle,
        completedAt: new Date().toISOString(),
      };
      action = 'add';
    } else {
      delete lessonCompletedRaw[lessonIWID];
      action = 'remove';
    }

    // Reconstruire le JSON du cours
    const lastLessonIWID = localStorage.getItem(`__iw_${courseIWID}_lastlessoniwid`);
    const lastLessonURL = localStorage.getItem(`__iw_${courseIWID}_lastlessonurl`);
    const completedCount = Object.keys(lessonCompletedRaw).length;
    const stats = getProgressStats(completedCount);
    const courseStats = { ...stats, completed: completedCount };

    const newCourseProgress = {
      lastLessonURL,
      lastLessonIWID,
      courseStats,
      lessonCompleted: lessonCompletedRaw,
    };

    const mergedJSON = {
      ...memberJSON,
      [courseIWID]: newCourseProgress,
    };
    console.log('[STEP 2] memberJSON modifié:', JSON.stringify(mergedJSON, null, 2));

    // 3. Sauvegarder dans Memberstack
    await (
      window.$memberstackDom as unknown as {
        updateMemberJSON: (args: { json: Record<string, unknown> }) => Promise<void>;
      }
    ).updateMemberJSON({ json: mergedJSON });
    console.log('[STEP 3] memberJSON envoyé à Memberstack:', JSON.stringify(mergedJSON, null, 2));
    // 4. Envoyer l'information à Airtable
    await sendProgressionWebhook(lessonATID, memberATID, action);
  } finally {
    hideLoader(element, lessonATID);
  }
}

async function sendProgressionWebhook(lessonATID: string, memberATID: string, action: string) {
  try {
    await fetch('https://hook.eu1.make.com/5y4mpe9zdd7ubmsyt12u3ojtpcaoht5r', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lesson_atid: lessonATID, member_atid: memberATID, action: action }),
    });
    console.log('✅ Webhook progression envoyé');
  } catch (error) {
    console.warn('⚠️ Erreur envoi webhook progression:', error);
  }
}
