export const setCookie = (name, value, days = 7, options = {}) => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();

  if (options.httpOnly) {
    return;
  }

  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    `expires=${expires}`,
    'path=/',
    'SameSite=Lax',
  ];

  if (options.secure) {
    parts.push('Secure');
  }

  document.cookie = parts.join('; ');
};

export const setAuthToken = (token) => {
  if (typeof window === 'undefined') return;

  if (!token) {
    deleteCookie('authToken');
    setAuthState(false);
    return;
  }

  const normalizedToken = typeof token === 'string' && token.startsWith('Bearer ') ? token.slice(7) : token;

  setCookie('authToken', normalizedToken, 7);
  setAuthState(true);
};

export const setAuthState = (isAuthenticated) => {
  if (typeof window === 'undefined') return;

  const value = isAuthenticated ? 'true' : 'false';
  setCookie('isAuthenticated', value, 7);
};

export const getAuthState = () => {
  if (typeof window === 'undefined') return false;

  return getCookie('isAuthenticated') === 'true';
};

export const getAuthToken = () => {
  if (typeof window === 'undefined') return '';

  return getCookie('authToken') || '';
};

export const clearAuthToken = () => {
  if (typeof window === 'undefined') return;
  deleteCookie('authToken');
  deleteCookie('isAuthenticated');
};

export const getCookie = (name) => {
  const cookies = document.cookie.split(';').map((item) => item.trim());
  const cookie = cookies.find((item) => item.startsWith(`${name}=`));

  if (!cookie) return "";
  return decodeURIComponent(cookie.substring(name.length + 1));
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
};
