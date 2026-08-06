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
    window.sessionStorage.removeItem('authToken');
    window.localStorage.removeItem('authToken');
    deleteCookie('authToken');
    setAuthState(false);
    return;
  }

  const normalizedToken = typeof token === 'string' && token.startsWith('Bearer ') ? token.slice(7) : token;

  window.sessionStorage.setItem('authToken', normalizedToken);
  window.localStorage.setItem('authToken', normalizedToken);
  setCookie('authToken', normalizedToken, 7);
  setAuthState(true);
};

export const setAuthState = (isAuthenticated) => {
  if (typeof window === 'undefined') return;

  const value = isAuthenticated ? 'true' : 'false';
  window.sessionStorage.setItem('isAuthenticated', value);
  window.localStorage.setItem('isAuthenticated', value);
};

export const getAuthState = () => {
  if (typeof window === 'undefined') return false;

  const sessionState = window.sessionStorage.getItem('isAuthenticated');
  if (sessionState !== null) {
    return sessionState === 'true';
  }

  const localState = window.localStorage.getItem('isAuthenticated');
  return localState === 'true';
};

export const getAuthToken = () => {
  if (typeof window === 'undefined') return '';

  const sessionToken = window.sessionStorage.getItem('authToken') || '';
  if (sessionToken) return sessionToken;

  const localToken = window.localStorage.getItem('authToken') || '';
  if (localToken) return localToken;

  return getCookie('authToken') || '';
};

export const clearAuthToken = () => {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem('authToken');
  window.localStorage.removeItem('authToken');
  window.sessionStorage.removeItem('isAuthenticated');
  window.localStorage.removeItem('isAuthenticated');
  deleteCookie('authToken');
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
