/**
 * 📝 Animation des labels de formulaire
 *
 * Anime les labels des champs de formulaire lors du focus/blur.
 * Les labels se déplacent et changent de couleur selon l'état du champ.
 */

export function animateFormLabels() {
  const formFieldWrapper = document.querySelectorAll('.form_field-wrapper');
  formFieldWrapper.forEach((wrapper) => {
    const formLabel = wrapper.querySelector('.form_field-label');
    const formInput = wrapper.querySelector('.form_field-input');

    if (formInput && formLabel) {
      formInput.addEventListener('focus', () => {
        formLabel.classList.add('iw-form-input-active');
        formInput.classList.add('iw-form-input-active');
      });

      formInput.addEventListener('blur', () => {
        const inputElement = formInput as HTMLInputElement;
        if (!inputElement.value.trim()) {
          formLabel.classList.remove('iw-form-input-active');
          formInput.classList.remove('iw-form-input-active');
        }
      });
      // Vérifier si le champ est déjà rempli au chargement de la page
      const inputElement = formInput as HTMLInputElement;
      if (inputElement.value.trim()) {
        formLabel.classList.add('iw-form-input-active');
        formInput.classList.add('iw-form-input-active');
      }
    }
  });
}
