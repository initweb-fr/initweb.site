export function getCookie(name: string): string | null {
  const prefix = name + '=';
  const parts = document.cookie.split('; ');
  for (let i = 0; i < parts.length; i++) {
    const row = parts[i];
    if (row.indexOf(prefix) === 0) return row.split('=')[1] ?? null;
  }
  return null;
}

export function setCookie(
  name: string,
  value: string,
  options?: {
    domain?: string;
    path?: string;
    sameSite?: 'Lax' | 'Strict' | 'None';
    secure?: boolean;
  }
) {
  let cookie = `${name}=${value}`;

  if (options?.domain) cookie += `; domain=${options.domain}`;
  if (options?.path) cookie += `; path=${options.path}`;
  if (options?.sameSite) cookie += `; SameSite=${options.sameSite}`;
  if (options?.secure) cookie += `; Secure`;

  document.cookie = cookie;
}

export function deleteCookie(name: string, domain?: string) {
  document.cookie = `
    ${name}=;
    path=/;
    ${domain ? `domain=${domain};` : ''}
    expires=Thu, 01 Jan 1970 00:00:00 UTC;
  `;
}
