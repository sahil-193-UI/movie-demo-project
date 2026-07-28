export function truncateText(title, length = 100) {
  if (!title) return '';

  return title.length > length
    ? title.substring(0, length) + '...'
    : title;
}

export const createSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove special characters
    .replace(/\s+/g, '-')         // replace spaces with -
}