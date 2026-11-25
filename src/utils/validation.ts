export const validateEmail = (v: string): string | null => {
  const s = v.trim();
  if (!s) return 'Enter your email';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)) return 'Enter a valid email address';
  return null;
};

export const validatePassword = (v: string, strict = true): string | null => {
  if (!v) return 'Enter your password';
  if (!strict) return null;
  if (v.length < 8) return 'At least 8 characters';
  if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return 'Use both letters and numbers';
  return null;
};

export const validateName = (v: string, label: string, required = true): string | null => {
  const s = v.trim();
  if (!s) return required ? `Enter ${label.toLowerCase()}` : null;
  if (s.length < 2) return 'Too short';
  if (!/^[\p{L}' -]+$/u.test(s)) return 'Letters, hyphens and spaces only';
  return null;
};

export const validateBirthDate = (v: string): string | null => {
  if (!v) return 'Enter your date of birth';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return 'Invalid date';
  const now = new Date();
  if (d > now) return 'Date cannot be in the future';
  const age = (now.getTime() - d.getTime()) / (365.25 * 24 * 3600 * 1000);
  if (age < 14 || age > 60) return 'Check the year of birth';
  return null;
};
