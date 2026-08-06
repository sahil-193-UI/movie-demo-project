export const setCookie = (name, value, days = 7, options = {}) => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();

  if (options.httpOnly) {
    console.warn('HttpOnly cookies must be set by the server via Set-Cookie, not by JavaScript.');
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

export const getCookie = (name) => {
  const cookies = document.cookie.split(';').map((item) => item.trim());
  const cookie = cookies.find((item) => item.startsWith(`${name}=`));

  if (!cookie) return "";
  return decodeURIComponent(cookie.substring(name.length + 1));
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
};
