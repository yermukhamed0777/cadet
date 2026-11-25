const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export const formatDate = (iso: string | null | undefined): string => {
  if (!iso) return '—';
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return dateFormatter.format(d);
};

/** English plural: forms = [singular, plural]. Third form kept for compatibility. */
export const pluralRu = (n: number, forms: [string, string, string?]) =>
  n === 1 ? forms[0] : (forms[1] ?? forms[2] ?? forms[0]);

export const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};
