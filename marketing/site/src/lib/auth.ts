import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "startcont_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 dias

/**
 * Segredo que assina o cookie. Em produção é obrigatório: sem ele nenhuma
 * sessão é aceita (um segredo padrão permitiria forjar o cookie).
 */
function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;
  return process.env.NODE_ENV === "production" ? null : "dev-secret-change-me";
}

function sign(value: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

// Token simples: "<expira>.<assinatura>"
function makeToken(secret: string) {
  const expires = Date.now() + MAX_AGE * 1000;
  const payload = String(expires);
  return `${payload}.${sign(payload, secret)}`;
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

function isValidToken(token?: string) {
  const secret = getSecret();
  if (!token || !secret) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  if (!safeEqual(sign(payload, secret), sig)) return false;
  return Number(payload) > Date.now();
}

export function checkPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  // comparação em tempo constante
  return safeEqual(password, expected);
}

export async function createSession() {
  const secret = getSecret();
  if (!secret) throw new Error("SESSION_SECRET não configurado.");
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, makeToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return isValidToken(cookieStore.get(COOKIE_NAME)?.value);
}
