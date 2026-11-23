export const validateEmail = (v: string): string | null => {
  const s = v.trim();
  if (!s) return 'Введите email';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)) return 'Email указан неверно';
  return null;
};

export const validatePassword = (v: string, strict = true): string | null => {
  if (!v) return 'Введите пароль';
  if (!strict) return null;
  if (v.length < 8) return 'Минимум 8 символов';
  if (!/[A-Za-zА-Яа-я]/.test(v) || !/\d/.test(v)) return 'Пароль должен содержать буквы и цифры';
  return null;
};

export const validateName = (v: string, label: string, required = true): string | null => {
  const s = v.trim();
  if (!s) return required ? `Укажите: ${label.toLowerCase()}` : null;
  if (s.length < 2) return 'Слишком коротко';
  if (!/^[A-Za-zА-Яа-яЁёӘәҒғҚқҢңӨөҰұҮүҺһІі' -]+$/.test(s)) return 'Только буквы, дефис и пробел';
  return null;
};

export const validateBirthDate = (v: string): string | null => {
  if (!v) return 'Укажите дату рождения';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return 'Неверная дата';
  const now = new Date();
  if (d > now) return 'Дата не может быть в будущем';
  const age = (now.getTime() - d.getTime()) / (365.25 * 24 * 3600 * 1000);
  if (age < 14 || age > 60) return 'Проверьте год рождения';
  return null;
};
