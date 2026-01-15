export function displaySiteTab() {
  const tabWrappers = document.querySelectorAll(
    '[iw-tab-element=tab-wrapper]'
  ) as NodeListOf<HTMLElement>;

  if (!tabWrappers) return;

  tabWrappers.forEach((tabWrapper) => {
    const tabToggles = tabWrapper.querySelectorAll(
      '[iw-tab-element=tab-toggle]'
    ) as NodeListOf<HTMLElement>;
    const tabContents = tabWrapper.querySelectorAll(
      '[iw-tab-element=tab-content]'
    ) as NodeListOf<HTMLElement>;

    if (!tabToggles || !tabContents) return;

    // Activer par défaut le premier toggle et le premier contenu
    if (tabToggles.length > 0 && tabContents.length > 0) {
      tabToggles[0].classList.add('iw-tab-active');
      tabContents[0].classList.add('iw-tab-active');
    }

    tabToggles.forEach((tabToggle) => {
      tabToggle.addEventListener('click', () => {
        const thisTabIndex = Array.from(tabToggles).indexOf(tabToggle);
        const thisTabContent = tabContents[thisTabIndex];

        // Désactiver tous les contenus
        tabContents.forEach((content) => content.classList.remove('iw-tab-active'));
        // Désactiver tous les toggles
        tabToggles.forEach((toggle) => toggle.classList.remove('iw-tab-active'));

        // Activer le contenu et toggle correspondants
        thisTabContent?.classList.add('iw-tab-active');
        tabToggle.classList.add('iw-tab-active');
      });
    });
  });
}
