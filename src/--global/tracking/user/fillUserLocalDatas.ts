import { getCookie } from '../../../utils/cookieUtilities';

export function fillUserLocalDatas() {
  document.querySelectorAll('input[iw-formdata]').forEach((input) => {
    const attr = input.getAttribute('iw-formdata');
    if (!attr) return;
    const val = getCookie('__iw-' + attr);
    const inputElement = input as HTMLInputElement;
    if (val) inputElement.value = val;
    // Si l'attribut contient "URL", on décode la valeur pour avoir l'URL en clair
    if (attr.includes('URL') && val) {
      inputElement.value = decodeURIComponent(val);
    }
  });
}
