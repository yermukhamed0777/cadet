const toHex = (buf: ArrayBuffer | Uint8Array) =>
  Array.from(buf instanceof Uint8Array ? buf : new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

const fromHex = (hex: string) => new Uint8Array(hex.match(/.{2}/g)!.map((h) => parseInt(h, 16)));

export const randomId = (): string => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return toHex(bytes);
};

async function pbkdf2(password: string, salt: Uint8Array): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 150_000, hash: 'SHA-256' },
    keyMaterial,
    256,
  );
  return toHex(bits);
}

/** Пароль никогда не хранится в открытом виде: PBKDF2-SHA256 + случайная соль. */
export async function hashPassword(password: string) {
  if (!crypto?.subtle) throw new Error('Безопасное хранение недоступно: откройте приложение по HTTPS или localhost.');
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  return { salt: toHex(salt), hash: await pbkdf2(password, salt) };
}

export async function verifyPassword(password: string, saltHex: string, hash: string) {
  if (!crypto?.subtle) return false;
  const computed = await pbkdf2(password, fromHex(saltHex));
  if (computed.length !== hash.length) return false;
  let diff = 0;
  for (let i = 0; i < hash.length; i++) diff |= computed.charCodeAt(i) ^ hash.charCodeAt(i);
  return diff === 0;
}
