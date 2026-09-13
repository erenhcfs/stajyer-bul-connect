import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "admin_session";
const SESSION_HOURS = 12;

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET ortam değişkeni tanımlı değil.");
  }
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function createSessionCookie(): string {
  const expires = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = `${expires}`;
  const signature = sign(payload);
  const token = `${payload}.${signature}`;
  const maxAge = SESSION_HOURS * 60 * 60;
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header.split(";").map((part) => {
      const [k, ...v] = part.trim().split("=");
      return [k, decodeURIComponent(v.join("="))];
    }),
  );
}

export function isAuthenticated(cookieHeader: string | undefined): boolean {
  const cookies = parseCookies(cookieHeader);
  const token = cookies[COOKIE_NAME];
  if (!token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length) return false;
  if (!timingSafeEqual(sigBuf, expectedBuf)) return false;

  const expires = Number(payload);
  return Number.isFinite(expires) && Date.now() < expires;
}
