import { getCookie, setCookie } from '$utils/--global/cookieUtilities';

export function saveUserLocalDatas() {
  document.querySelectorAll('input[iw-formdata]').forEach((input) => {
    input.addEventListener('blur', () => {
      const attr = input.getAttribute('iw-formdata');
      // Si l'attribu n'existe pas ou ne contient pas "user_", on ne fait rien et on sort de la fonction
      if (!attr || !attr.includes('user_')) return;

      const inputElement = input as HTMLInputElement;
      setCookie('__iw-' + attr, inputElement.value);

      if (attr === 'firstName' || attr === 'lastName') {
        const firstName =
          attr === 'firstName' ? inputElement.value : getCookie('__iw-user_firstname') || '';
        const lastName =
          attr === 'lastName' ? inputElement.value : getCookie('__iw-user_lastname') || '';
        setCookie('__iw-user_fullname', (firstName + ' ' + lastName).trim());
      }
    });
  });
}
